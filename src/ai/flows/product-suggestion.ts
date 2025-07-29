// Product suggestion flow to suggest related products based on the user's current selection.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @fileOverview Product suggestion flow.
 *
 * - productSuggestion - A function that handles the product suggestion process.
 * - ProductSuggestionInput - The input type for the productSuggestion function.
 * - ProductSuggestionOutput - The return type for the productSuggestion function.
 */

const ProductSuggestionInputSchema = z.object({
  currentSelection: z.string().describe('The user\'s current product selection.'),
  userProfile: z.string().optional().describe('Optional user profile information to tailor suggestions.'),
});
export type ProductSuggestionInput = z.infer<typeof ProductSuggestionInputSchema>;

const ProductSuggestionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('Array of suggested product names.'),
  reasoning: z.string().describe('Explanation of why these products are suggested.'),
});
export type ProductSuggestionOutput = z.infer<typeof ProductSuggestionOutputSchema>;

export async function productSuggestion(input: ProductSuggestionInput): Promise<ProductSuggestionOutput> {
  return productSuggestionFlow(input);
}

const productSuggestionPrompt = ai.definePrompt({
  name: 'productSuggestionPrompt',
  input: {
    schema: ProductSuggestionInputSchema,
  },
  output: {
    schema: ProductSuggestionOutputSchema,
  },
  prompt: `You are an expert e-commerce product suggestion engine for a football gear website.

  Based on the user's current product selection and profile, suggest related products that the user might be interested in purchasing.
  Explain your reasoning for the suggestions.

  Current Selection: {{{currentSelection}}}
  User Profile: {{{userProfile}}}

  Respond with the suggested products and your reasoning.
  `,
});

const productSuggestionFlow = ai.defineFlow(
  {
    name: 'productSuggestionFlow',
    inputSchema: ProductSuggestionInputSchema,
    outputSchema: ProductSuggestionOutputSchema,
  },
  async input => {
    const {output} = await productSuggestionPrompt(input);
    return output!;
  }
);
