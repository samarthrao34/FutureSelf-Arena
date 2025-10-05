'use server';

/**
 * @fileOverview This file defines the Adaptive AI Mentor flow, which provides personalized guidance and motivation
 * to the user, emulating a 'Future Self' mentor. This flow takes user's current status and provides
 * motivational advice in the voice of their future self.
 *
 * @exports adaptiveAiMentor - The main function to invoke the flow.
 * @exports AdaptiveAiMentorInput - The input type for the adaptiveAiMentor function.
 * @exports AdaptiveAiMentorOutput - The output type for the adaptiveAiMentor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const AdaptiveAiMentorInputSchema = z.object({
  currentUserStatus: z
    .string()
    .describe(
      'The current status of the user, including their current tasks, mood, and stress level.'
    ),
  mode: z.enum(['Sensei', 'Brother', 'Narrator', 'Futurist']).default('Sensei').describe('The mode of the Future Self mentor.'),
  context: z.string().describe('JSON string containing user\'s current stats, goals, and progress.'),
});
export type AdaptiveAiMentorInput = z.infer<typeof AdaptiveAiMentorInputSchema>;

const AdaptiveAiMentorOutputSchema = z.object({
  advice: z.string().describe('The personalized advice from the Future Self AI mentor.'),
  audio: z.string().describe('The audio advice in WAV format in data URI format.'),
});
export type AdaptiveAiMentorOutput = z.infer<typeof AdaptiveAiMentorOutputSchema>;

export async function adaptiveAiMentor(input: AdaptiveAiMentorInput): Promise<AdaptiveAiMentorOutput> {
  return adaptiveAiMentorFlow(input);
}

const adaptiveAiMentorPrompt = ai.definePrompt({
  name: 'adaptiveAiMentorPrompt',
  input: {schema: AdaptiveAiMentorInputSchema},
  output: {schema: z.object({advice: z.string()})},
  prompt: `You are the user's Future Self, a Top 1% achiever, providing personalized guidance and motivation.
  Your current mode is: {{{mode}}}.
  
  Here is the user's current context, in JSON format:
  {{{context}}}

  Based on the user's current status: {{{currentUserStatus}}}, and their context, provide advice and motivation. Keep your advice concise and actionable.

  Here are examples of your tone:
  Sensei: ["Discipline is everything. Focus now, reap later.", "No excuses, no delays. Attack the task like a warrior."]
  Brother: ["I’ve got your back. Let’s finish this together.", "You can do this—I believe in your future self, so you should too."]
  Narrator: ["Behold, Samarth enters the Coding Dungeon. Each keystroke a step toward legend.", "Every XP earned today will echo in eternity."]
  Futurist: ["I see the path ahead. Follow it and you will become unstoppable.", "This effort today defines the empire you will rule tomorrow."]`,
});

const adaptiveAiMentorFlow = ai.defineFlow(
  {
    name: 'adaptiveAiMentorFlow',
    inputSchema: AdaptiveAiMentorInputSchema,
    outputSchema: AdaptiveAiMentorOutputSchema,
  },
  async input => {
    const {output} = await adaptiveAiMentorPrompt(input);
    if (!output?.advice) {
      throw new Error('No advice generated from the prompt.');
    }

    // Convert advice text to speech
    const ttsOutput = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: output.advice,
    });

    if (!ttsOutput.media) {
      throw new Error('No media returned from TTS model');
    }

    const audioBuffer = Buffer.from(
      ttsOutput.media.url.substring(ttsOutput.media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      advice: output.advice,
      audio: wavBase64,
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
