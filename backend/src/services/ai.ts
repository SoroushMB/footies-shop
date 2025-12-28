import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';

const genai = new GoogleGenerativeAI(config.google.apiKey);

interface ProductSuggestionResult {
  suggestions: string[];
  reasoning: string;
}

interface ChatResult {
  response: string;
}

/**
 * Get AI-powered product suggestions based on current selection
 */
export async function getProductSuggestions(
  currentProduct: {
    name: string;
    category: string;
    brand: string;
    price: number;
  },
  userProfile?: {
    recentPurchases?: string[];
    preferences?: string[];
  }
): Promise<ProductSuggestionResult> {
  if (!config.google.apiKey) {
    return {
      suggestions: [],
      reasoning: 'AI suggestions are not available. Please configure the Google API key.',
    };
  }

  const prompt = `You are an expert e-commerce assistant for Footies-Shop, a premium football (soccer) gear store.

A customer is viewing: "${currentProduct.name}"
Category: ${currentProduct.category}
Brand: ${currentProduct.brand}
Price: $${currentProduct.price}

${userProfile ? `Customer profile:
- Recent purchases: ${userProfile.recentPurchases?.join(', ') || 'None'}
- Preferences: ${userProfile.preferences?.join(', ') || 'Not specified'}` : ''}

Based on this, suggest 3 related products that would complement their selection. Consider:
1. Products from the same brand or category
2. Complementary accessories
3. Similar price range products

Respond in JSON format:
{
  "suggestions": ["Product 1 name", "Product 2 name", "Product 3 name"],
  "reasoning": "Brief explanation of why these products are recommended"
}`;

  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text() || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        suggestions: parsed.suggestions || [],
        reasoning: parsed.reasoning || '',
      };
    }

    return {
      suggestions: [],
      reasoning: 'Could not parse AI response.',
    };
  } catch (error) {
    console.error('AI suggestion error:', error);
    return {
      suggestions: [],
      reasoning: 'AI service temporarily unavailable.',
    };
  }
}

/**
 * AI-powered customer support chat
 */
export async function supportChat(
  message: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<ChatResult> {
  if (!config.google.apiKey) {
    return {
      response: 'Chat support is not available at the moment. Please try again later or contact us at support@footies-shop.com.',
    };
  }

  const systemPrompt = `You are a helpful customer support assistant for Footies-Shop, a premium online store for football (soccer) gear.

You help customers with:
- Product questions and recommendations
- Order status and shipping inquiries
- Returns and exchanges
- Sizing guidance
- General football gear advice

Be friendly, professional, and concise. If you don't know something, suggest contacting human support.

Store policies:
- Free shipping on orders over $50
- 30-day return policy
- Size exchanges are free
- Standard shipping takes 3-5 business days`;

  const messages = [
    { role: 'user' as const, content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user' as const, content: message },
  ];

  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(messages.map(m => m.content).join('\n'));
    const response = await result.response;

    return {
      response: response.text() || 'I apologize, but I couldn\'t process your request. Please try again.',
    };
  } catch (error) {
    console.error('Chat support error:', error);
    return {
      response: 'I\'m having trouble connecting right now. Please try again in a moment.',
    };
  }
}

