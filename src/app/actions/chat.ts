'use server';

import { supportChat } from '@/ai/flows/support-chat';
import type { ChatInput, ChatOutput } from '@/ai/flows/support-chat';

export async function getChatResponse(input: ChatInput): Promise<ChatOutput> {
  try {
    const response = await supportChat(input);
    return response;
  } catch (error) {
    console.error('Error fetching chat response:', error);
    return {
      response: 'Sorry, I am having trouble connecting. Please try again later.',
    };
  }
}
