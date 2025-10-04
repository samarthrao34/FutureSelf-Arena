'use client';
import { useState, useTransition } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { initialQuests } from '@/lib/data';
import type { Quest } from '@/lib/types';
import { Loader2, Swords, Star, Plus } from 'lucide-react';
import { SparkleIcon } from '@/components/icons/sparkle-icon';
import { cn } from '@/lib/utils';

export default function QuestBoard() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [newQuestTitle, setNewQuestTitle] = useState('');

  const handleAddQuest = () => {
    if (newQuestTitle.trim() === '') return;
    const newQuest: Quest = {
      id: `user-${Date.now()}`,
      title: newQuestTitle,
      description: 'User-added goal',
      xp: 50,
      type: 'daily',
      completed: false,
    };
    setQuests(prev => [newQuest, ...prev]);
    setNewQuestTitle('');
  };
  
  const handleQuestCompletion = (questId: string, completed: boolean) => {
    setQuests(quests.map(q => q.id === questId ? {...q, completed} : q))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SparkleIcon icon={Swords} className="w-6 h-6" />
          <CardTitle className="font-headline text-xl">Quest Board</CardTitle>
        </div>
        <CardDescription>
          Add your daily goals and complete legendary challenges.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
            <Input
              id="new-quest"
              name="new-quest"
              placeholder="e.g., Finish project proposal..."
              value={newQuestTitle}
              onChange={(e) => setNewQuestTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddQuest()}
            />
            <Button onClick={handleAddQuest}><Plus className='mr-2'/> Add Goal</Button>
        </div>
        <div className="h-64 overflow-y-auto space-y-3 pr-2">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={cn(
                "flex items-start gap-4 p-3 rounded-lg border bg-card-foreground/5 transition-colors",
                 quest.completed ? 'bg-card-foreground/10' : 'hover:bg-card-foreground/10'
              )}
            >
              <Checkbox 
                id={`quest-${quest.id}`}
                className='mt-1'
                checked={quest.completed}
                onCheckedChange={(checked) => handleQuestCompletion(quest.id, !!checked)}
              />
              <div className="flex-1">
                <label 
                    htmlFor={`quest-${quest.id}`}
                    className={cn(
                        "font-semibold cursor-pointer",
                        quest.completed && "line-through text-muted-foreground"
                    )}
                >
                    {quest.title}
                </label>
                <p className="text-sm text-muted-foreground">{quest.description}</p>
              </div>
              <div className="font-mono text-sm font-medium text-primary whitespace-nowrap">
                +{quest.xp} XP
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
