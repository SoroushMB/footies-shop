'use server';

import { aiApi } from '@/lib/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(
  message: string,
  conversationHistory?: ChatMessage[]
) {
  try {
    const response = await aiApi.chat(message, conversationHistory);

    if (response.success && response.data) {
      return {
        response: response.data.response,
      };
    }

    return {
      response: 'I apologize, but I couldn\'t process your request. Please try again.',
    };
  } catch (error) {
    console.error('Error in chat:', error);
    return {
      response: 'I\'m having trouble connecting right now. Please try again later.',
    };
  }
}
