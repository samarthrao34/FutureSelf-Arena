'use server';

import { generateDailyQuests } from '@/ai/flows/dynamic-quest-generation';
import { adaptiveAiMentor } from '@/ai/flows/adaptive-ai-mentor';
import { generateFutureSelfNarration } from '@/ai/flows/future-self-narration';
import { z } from 'zod';

const questSchema = z.object({
  goals: z.string().min(3, 'Goals must be at least 3 characters long.'),
});

export async function generateQuestsAction(prevState: any, formData: FormData) {
  const validatedFields = questSchema.safeParse({
    goals: formData.get('goals'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const output = await generateDailyQuests({
      userGoals: validatedFields.data.goals,
      calendarEvents: 'Team meeting at 11am, Project deadline at 5pm',
    });
    return { data: output.quests };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate quests. Is the API key configured?' };
  }
}

const mentorSchema = z.object({
    status: z.string().min(3, 'Status must be at least 3 characters long.'),
    mode: z.enum(['Sensei', 'Brother', 'Narrator', 'Futurist']),
});

export async function getMentorAdviceAction(prevState: any, formData: FormData) {
    const validatedFields = mentorSchema.safeParse({
        status: formData.get('status'),
        mode: formData.get('mode'),
    });

    if (!validatedFields.success) {
        return {
            error: 'Invalid input.',
        };
    }

    try {
        const output = await adaptiveAiMentor({
            currentUserStatus: validatedFields.data.status,
            mode: validatedFields.data.mode,
        });
        return { data: output };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get advice. Is the API key configured?' };
    }
}

const narrationSchema = z.object({
    log: z.string().min(10, 'Daily log must be at least 10 characters long.'),
});

export async function getNarrationAction(prevState: any, formData: FormData) {
    const validatedFields = narrationSchema.safeParse({
        log: formData.get('log'),
    });

    if (!validatedFields.success) {
        return {
            error: 'Invalid input.',
        };
    }

    try {
        const output = await generateFutureSelfNarration({
            dailyLog: validatedFields.data.log,
        });
        return { data: output };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get narration. Is the API key configured?' };
    }
}
