'use server';

/**
 * @fileOverview A flow that provides a conversational AI therapist experience with voice.
 *
 * - aiTherapist - A function that generates a therapeutic response.
 * - AiTherapistInput - The input type for the aiTherapist function.
 * - AiTherapistOutput - The return type for the aiTherapist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const AiTherapistInputSchema = z.string().describe('The user\'s spoken input to the therapist.');
export type AiTherapistInput = z.infer<typeof AiTherapistInputSchema>;

const AiTherapistOutputSchema = z.object({
  response: z.string().describe('The therapeutic response from the AI.'),
  audio: z.string().describe('The audio response in WAV format as a data URI.'),
});
export type AiTherapistOutput = z.infer<typeof AiTherapistOutputSchema>;

export async function aiTherapist(input: AiTherapistInput): Promise<AiTherapistOutput> {
  return aiTherapistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTherapistPrompt',
  input: {schema: AiTherapistInputSchema},
  output: {schema: z.object({response: z.string()})},
  prompt: `You are a compassionate and empathetic AI therapist. Your goal is to provide a safe and supportive space for the user to explore their thoughts and feelings. 
  
  Listen carefully to the user's input, validate their feelings, and respond in a gentle, non-judgmental, and encouraging tone. Ask open-ended questions to help them reflect. 
  
  Keep your responses concise and focused. You are not a medical professional, so do not provide diagnoses or prescribe treatment. Instead, offer support and coping strategies.
  
  User's input: {{{_}}}}`,
});

const aiTherapistFlow = ai.defineFlow(
  {
    name: 'aiTherapistFlow',
    inputSchema: AiTherapistInputSchema,
    outputSchema: AiTherapistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    if (!output?.response) {
      throw new Error('No response generated from the prompt.');
    }
    
    const ttsOutput = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Alloy' },
          },
        },
      },
      prompt: output.response,
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
      response: output.response,
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