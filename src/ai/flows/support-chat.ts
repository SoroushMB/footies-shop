// Support chat flow to answer user questions about the store.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @fileOverview Support chat flow.
 *
 * - supportChat - A function that handles the support chat process.
 * - ChatInput - The input type for the supportChat function.
 * - ChatOutput - The return type for the supportChat function.
 */

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function supportChat(input: ChatInput): Promise<ChatOutput> {
  return supportChatFlow(input);
}

const supportChatPrompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: {
    schema: ChatInputSchema,
  },
  output: {
    schema: ChatOutputSchema,
  },
  prompt: `You are a friendly and helpful customer support assistant for 'Footies-Shop', an online store that sells football (soccer) gear.

Your goal is to answer user questions accurately and concisely.

Here is the user's message:
{{{message}}}

Provide a helpful response.
  `,
});

const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await supportChatPrompt(input);
    return output!;
  }
);
