'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { Quest } from '@/lib/types';
import { Swords, Plus, Trash2 } from 'lucide-react';
import { SparkleIcon } from '@/components/icons/sparkle-icon';
import { cn } from '@/lib/utils';

type QuestBoardProps = {
    quests: Quest[];
    onUpdateQuest: (quest: Quest) => void;
    onAddQuest: (quest: Quest) => void;
    onDeleteQuest: (questId: string) => void;
}

export default function QuestBoard({ quests, onUpdateQuest, onAddQuest, onDeleteQuest }: QuestBoardProps) {
  const [newQuestTitle, setNewQuestTitle] = useState('');

  const handleAddQuest = () => {
    if (newQuestTitle.trim() === '') return;
    const newQuest: Quest = {
      id: `user-${Date.now()}`,
      title: newQuestTitle,
      description: 'User-added goal',
      xp: 50, // Default XP for a user-added goal
      type: 'daily',
      completed: false,
    };
    onAddQuest(newQuest);
    setNewQuestTitle('');
  };
  
  const handleQuestCompletion = (quest: Quest, completed: boolean) => {
    onUpdateQuest({ ...quest, completed });
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
                "group flex items-start gap-4 p-3 rounded-lg border bg-card-foreground/5 transition-colors",
                 quest.completed ? 'bg-card-foreground/10' : 'hover:bg-card-foreground/10'
              )}
            >
              <Checkbox 
                id={`quest-${quest.id}`}
                className='mt-1'
                checked={quest.completed}
                onCheckedChange={(checked) => handleQuestCompletion(quest, !!checked)}
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
               <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteQuest(quest.id)}
              >
                  <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
