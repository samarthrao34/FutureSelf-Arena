'use server';

/**
 * @fileOverview Dynamic quest generation flow.
 *
 * - generateDailyQuests - A function that generates daily quests based on user calendar and goals.
 * - GenerateDailyQuestsInput - The input type for the generateDailyQuests function.
 * - GenerateDailyQuestsOutput - The return type for the generateDailyQuests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyQuestsInputSchema = z.object({
  calendarEvents: z.string().describe('A list of calendar events for the day.'),
  userGoals: z.string().describe('The user\u2019s goals.'),
});
export type GenerateDailyQuestsInput = z.infer<typeof GenerateDailyQuestsInputSchema>;

const GenerateDailyQuestsOutputSchema = z.object({
  quests: z.array(z.string()).describe('A list of generated daily quests.'),
});
export type GenerateDailyQuestsOutput = z.infer<typeof GenerateDailyQuestsOutputSchema>;

export async function generateDailyQuests(input: GenerateDailyQuestsInput): Promise<GenerateDailyQuestsOutput> {
  return generateDailyQuestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyQuestsPrompt',
  input: {schema: GenerateDailyQuestsInputSchema},
  output: {schema: GenerateDailyQuestsOutputSchema},
  prompt: `You are an AI quest generator that turns user's calendar events and goals into exciting quests.

  Calendar Events: {{{calendarEvents}}}
  User Goals: {{{userGoals}}}

  Generate a list of daily quests based on the calendar events and user goals. The quests should be actionable and engaging.
  Format the output as a list of strings.
  `,
});

const generateDailyQuestsFlow = ai.defineFlow(
  {
    name: 'generateDailyQuestsFlow',
    inputSchema: GenerateDailyQuestsInputSchema,
    outputSchema: GenerateDailyQuestsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
