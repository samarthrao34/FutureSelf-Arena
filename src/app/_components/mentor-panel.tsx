'use client';
import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getMentorAdviceAction } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, User, Sparkles, Volume2 } from 'lucide-react';
import { SparkleIcon } from '@/components/icons/sparkle-icon';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Summoning Wisdom...
        </>
      ) : (
        'Get Advice'
      )}
    </Button>
  );
}

export default function MentorPanel() {
  const [state, formAction] = useActionState(getMentorAdviceAction, { data: undefined, error: undefined });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state.data?.audio && audioRef.current) {
      audioRef.current.src = state.data.audio;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [state.data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SparkleIcon icon={User} className="w-6 h-6" />
          <CardTitle className="font-headline text-xl">Future-Self Mentor</CardTitle>
        </div>
        <CardDescription>Get guidance from the one who has already walked the path.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="mode" className="text-sm font-medium">Mentor Mode</label>
            <Select name="mode" defaultValue="Sensei">
              <SelectTrigger>
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sensei">Sensei</SelectItem>
                <SelectItem value="Brother">Brother</SelectItem>
                <SelectItem value="Narrator">Narrator</SelectItem>
                <SelectItem value="Futurist">Futurist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
             <label htmlFor="status" className="text-sm font-medium">Current Status</label>
            <Textarea
              id="status"
              name="status"
              placeholder="e.g., Feeling stressed about exams, motivated but unsure where to start..."
              rows={3}
            />
          </div>
          {state.data && (
            <div className="p-3 rounded-md bg-primary/10 border border-primary/20 text-sm">
                <p className='italic'>"{state.data.advice}"</p>
                <audio ref={audioRef} className="hidden" />
                <Button variant="ghost" size="sm" onClick={() => audioRef.current?.play()} className="mt-2 text-primary">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Play Narration
                </Button>
            </div>
          )}
           {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
