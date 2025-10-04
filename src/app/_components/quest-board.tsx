'use client';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { generateQuestsAction } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { initialQuests } from '@/lib/data';
import type { Quest } from '@/lib/types';
import { Loader2, Swords, Star } from 'lucide-react';
import { SparkleIcon } from '@/components/icons/sparkle-icon';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate Quests
    </Button>
  );
}

export default function QuestBoard() {
  const [state, formAction] = useFormState(generateQuestsAction, {
    error: undefined,
    data: undefined,
  });
  const [quests, setQuests] = useState<Quest[]>(initialQuests);

  useState(() => {
    if (state.data) {
      const newQuests: Quest[] = state.data.map((q: string, i: number) => ({
        id: `gen-${i}`,
        title: q,
        description: 'AI generated quest',
        xp: Math.floor(Math.random() * 100) + 50,
        type: 'daily',
      }));
      setQuests(prev => [...newQuests, ...prev.filter(q => q.type === 'legendary')]);
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SparkleIcon icon={Swords} className="w-6 h-6" />
          <CardTitle className="font-headline text-xl">Quest Board</CardTitle>
        </div>
        <CardDescription>
          Generate daily quests from your goals or tackle legendary challenges.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="goals" className="text-sm font-medium">Your Goals for Today</label>
            <Input
              id="goals"
              name="goals"
              placeholder="e.g., Finish project proposal, learn Next.js server actions..."
            />
            {typeof state.error === 'object' && state.error?.goals && (
              <p className="text-sm text-destructive">{state.error.goals[0]}</p>
            )}
            {typeof state.error === 'string' && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </div>
          <div className="h-64 overflow-y-auto space-y-3 pr-2">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className="flex items-start gap-4 p-3 rounded-lg border bg-card-foreground/5 hover:bg-card-foreground/10"
              >
                {quest.type === 'legendary' ? (
                  <SparkleIcon icon={Star} className="w-5 h-5 mt-1 text-primary" />
                ) : (
                  <Swords className="w-5 h-5 mt-1 text-accent" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{quest.title}</p>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </div>
                <div className="font-mono text-sm font-medium text-primary whitespace-nowrap">
                  +{quest.xp} XP
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
