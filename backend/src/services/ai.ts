import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenRouter } from '@openrouter/sdk';
import { config } from '../config/index.js';

// Initialize Google AI client
const genai = config.google.apiKey ? new GoogleGenerativeAI(config.google.apiKey) : null;

// Initialize OpenRouter client
const openRouter = config.openrouter.apiKey ? new OpenRouter({
  apiKey: config.openrouter.apiKey,
}) : null;

interface ProductSuggestionResult {
  suggestions: string[];
  reasoning: string;
}

interface ChatResult {
  response: string;
}

// Error types for quota detection
const QUOTA_ERROR_CODES = [
  'RESOURCE_EXHAUSTED',
  '429',
  'quota',
  'rate_limit',
  'rate limit',
  'quota exceeded',
];

/**
 * Check if an error indicates quota exhaustion
 */
function isQuotaError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = String(error).toLowerCase();
  const errorObj = error as { code?: string; status?: number; message?: string };

  // Check error code
  if (errorObj.code && QUOTA_ERROR_CODES.some(code => errorObj.code?.includes(code))) {
    return true;
  }

  // Check status code
  if (errorObj.status === 429) {
    return true;
  }

  // Check error message
  if (errorObj.message && QUOTA_ERROR_CODES.some(code => errorObj.message?.toLowerCase().includes(code))) {
    return true;
  }

  // Check string representation
  return QUOTA_ERROR_CODES.some(code => errorMessage.includes(code));
}

/**
 * Get product suggestions using Gemini (primary) or OpenRouter (fallback)
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

  // Try Gemini first
  if (genai && config.google.apiKey) {
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
      console.error('Gemini API error:', error);

      // If quota error, fall back to OpenRouter
      if (isQuotaError(error) && openRouter && config.openrouter.apiKey) {
        console.log('Gemini quota exhausted, falling back to OpenRouter...');
        return getProductSuggestionsWithOpenRouter(prompt);
      }

      // For other errors, try OpenRouter if available
      if (openRouter && config.openrouter.apiKey) {
        console.log('Gemini failed, falling back to OpenRouter...');
        return getProductSuggestionsWithOpenRouter(prompt);
      }

      return {
        suggestions: [],
        reasoning: 'AI service temporarily unavailable.',
      };
    }
  }

  // If Gemini not configured, try OpenRouter
  if (openRouter && config.openrouter.apiKey) {
    return getProductSuggestionsWithOpenRouter(prompt);
  }

  return {
    suggestions: [],
    reasoning: 'AI suggestions are not available. Please configure the Google API key or OpenRouter API key.',
  };
}

/**
 * Get product suggestions using OpenRouter
 */
async function getProductSuggestionsWithOpenRouter(
  prompt: string
): Promise<ProductSuggestionResult> {
  if (!openRouter || !config.openrouter.apiKey) {
    return {
      suggestions: [],
      reasoning: 'OpenRouter is not configured.',
    };
  }

  try {
    const result = await openRouter.chat.send({
      model: config.openrouter.defaultModel,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: false,
    });

    const content = result.choices[0]?.message?.content || '';

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
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
    console.error('OpenRouter API error:', error);
    return {
      suggestions: [],
      reasoning: 'AI service temporarily unavailable.',
    };
  }
}

/**
 * AI-powered customer support chat using Gemini (primary) or OpenRouter (fallback)
 */
export async function supportChat(
  message: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<ChatResult> {
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

  // Try Gemini first
  if (genai && config.google.apiKey) {
    try {
      const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      // Format messages for Gemini
      const geminiMessages = [
        systemPrompt,
        ...conversationHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`),
        `User: ${message}`,
      ].join('\n\n');

      const result = await model.generateContent(geminiMessages);
      const response = await result.response;

      return {
        response: response.text() || 'I apologize, but I couldn\'t process your request. Please try again.',
      };
    } catch (error) {
      console.error('Gemini API error:', error);

      // If quota error, fall back to OpenRouter
      if (isQuotaError(error) && openRouter && config.openrouter.apiKey) {
        console.log('Gemini quota exhausted, falling back to OpenRouter...');
        return supportChatWithOpenRouter(message, conversationHistory, systemPrompt);
      }

      // For other errors, try OpenRouter if available
      if (openRouter && config.openrouter.apiKey) {
        console.log('Gemini failed, falling back to OpenRouter...');
        return supportChatWithOpenRouter(message, conversationHistory, systemPrompt);
      }

      return {
        response: 'I\'m having trouble connecting right now. Please try again in a moment.',
      };
    }
  }

  // If Gemini not configured, try OpenRouter
  if (openRouter && config.openrouter.apiKey) {
    return supportChatWithOpenRouter(message, conversationHistory, systemPrompt);
  }

  return {
    response: 'Chat support is not available at the moment. Please try again later or contact us at support@footies-shop.com.',
  };
}

/**
 * Customer support chat using OpenRouter
 */
async function supportChatWithOpenRouter(
  message: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string
): Promise<ChatResult> {
  if (!openRouter || !config.openrouter.apiKey) {
    return {
      response: 'Chat support is not available at the moment. Please try again later or contact us at support@footies-shop.com.',
    };
  }

  try {
    // Format messages for OpenRouter (OpenAI-compatible format)
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    const result = await openRouter.chat.send({
      model: config.openrouter.defaultModel,
      messages,
      stream: false,
    });

    const content = result.choices[0]?.message?.content || '';

    return {
      response: content || 'I apologize, but I couldn\'t process your request. Please try again.',
    };
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return {
      response: 'I\'m having trouble connecting right now. Please try again in a moment.',
    };
  }
}
