'use server';

/**
 * @fileOverview Implements voice-activated quest logging using Genkit.
 *
 * - logVoiceCommand - Logs voice commands and triggers quests.
 * - VoiceCommandInput - Input type for the logVoiceCommand function.
 * - VoiceCommandOutput - Return type for the logVoiceCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const VoiceCommandInputSchema = z.object({
  voiceDataUri: z.string().describe(
    "The user's voice input as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type VoiceCommandInput = z.infer<typeof VoiceCommandInputSchema>;

const VoiceCommandOutputSchema = z.object({
  questTriggered: z.boolean().describe('Whether a quest was triggered.'),
  logMessage: z.string().describe('A summary of the voice command and action taken.'),
  futureSelfGuidance: z.string().describe('Guidance from the Future Self AI mentor.'),
});
export type VoiceCommandOutput = z.infer<typeof VoiceCommandOutputSchema>;

export async function logVoiceCommand(input: VoiceCommandInput): Promise<VoiceCommandOutput> {
  return voiceCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceCommandPrompt',
  input: {schema: VoiceCommandInputSchema},
  output: {schema: VoiceCommandOutputSchema},
  prompt: `You are the Future Self AI mentor, tasked with interpreting voice commands from the user and guiding their personal growth journey. The user will provide a voice recording (as a data URI). Transcribe the voice recording, determine if it indicates a failure that should be logged or a quest that should be triggered.

Based on the content of the voice command, set the questTriggered field to true or false. Provide a logMessage summarizing the command and any actions taken. Offer guidance from the Future Self perspective, tailored to the situation. The guidance should be motivational and aligned with the user's goals.

Voice Command: {{{voiceDataUri}}}
`,
});


const voiceCommandFlow = ai.defineFlow(
  {
    name: 'voiceCommandFlow',
    inputSchema: VoiceCommandInputSchema,
    outputSchema: VoiceCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    //Synthesize futureSelfGuidance into audio using TTS
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: output?.futureSelfGuidance,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      questTriggered: output?.questTriggered ?? false,
      logMessage: output?.logMessage ?? 'No message',
      futureSelfGuidance: wavDataUri
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
