'use server';

import { aiApi } from '@/lib/api';

export async function getSuggestions(productId: string) {
  try {
    const response = await aiApi.getSuggestions(productId);

    if (response.success && response.data) {
      return {
        suggestions: response.data.suggestions,
        reasoning: response.data.reasoning,
      };
    }

    return {
      suggestions: [],
      reasoning: 'Unable to get suggestions at this time.',
    };
  } catch (error) {
    console.error('Error getting product suggestions:', error);
    return {
      suggestions: [],
      reasoning: 'Unable to get suggestions at this time.',
    };
  }
}
