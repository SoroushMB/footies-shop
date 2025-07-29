'use server';

import { productSuggestion } from '@/ai/flows/product-suggestion';
import type { ProductSuggestionInput, ProductSuggestionOutput } from '@/ai/flows/product-suggestion';

export async function getSuggestions(input: ProductSuggestionInput): Promise<ProductSuggestionOutput> {
  try {
    const suggestions = await productSuggestion(input);
    return suggestions;
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    return {
      suggestions: [],
      reasoning: 'Could not retrieve suggestions at this time.',
    };
  }
}
