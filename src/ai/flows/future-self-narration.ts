'use server';

/**
 * @fileOverview A flow that narrates daily logs of user actions from the perspective of their future self.
 *
 * - generateFutureSelfNarration - A function that generates the narration.
 * - FutureSelfNarrationInput - The input type for the generateFutureSelfNarration function.
 * - FutureSelfNarrationOutput - The return type for the generateFutureSelfNarration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const FutureSelfNarrationInputSchema = z.object({
  dailyLog: z.string().describe('A summary of the user\'s daily activities and accomplishments.'),
});

export type FutureSelfNarrationInput = z.infer<typeof FutureSelfNarrationInputSchema>;

const FutureSelfNarrationOutputSchema = z.object({
  narration: z.string().describe('The narration of the daily log from the perspective of the user\'s future self, in a human-like voice.'),
  audioUri: z.string().describe('The audio URI of the narration.'),
});

export type FutureSelfNarrationOutput = z.infer<typeof FutureSelfNarrationOutputSchema>;

export async function generateFutureSelfNarration(
  input: FutureSelfNarrationInput
): Promise<FutureSelfNarrationOutput> {
  return futureSelfNarrationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'futureSelfNarrationPrompt',
  input: {schema: FutureSelfNarrationInputSchema},
  output: {schema: z.string().describe('The narration from the perspective of Future Self.')},
  prompt: `You are the user's future self, a top 1% achiever. Narrate the following daily log in a motivational and insightful way, highlighting the importance of these actions in the user's long-term success. Use a tone that is both encouraging and wise.\n\nDaily Log: {{{dailyLog}}}`,
});

const futureSelfNarrationFlow = ai.defineFlow(
  {
    name: 'futureSelfNarrationFlow',
    inputSchema: FutureSelfNarrationInputSchema,
    outputSchema: FutureSelfNarrationOutputSchema,
  },
  async input => {
    const {output: narrationText} = await prompt(input);

    if (!narrationText) {
      throw new Error('No narration generated.');
    }

    const {media} = await ai.generate({
      model: 'gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: narrationText,
    });

    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const audioUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      narration: narrationText,
      audioUri: audioUri,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
