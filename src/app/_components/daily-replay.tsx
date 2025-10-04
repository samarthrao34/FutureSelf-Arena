'use client';
import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getNarrationAction } from '@/lib/actions';
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
import { Loader2, PlayCircle, Sparkles, Volume2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Replay...
        </>
      ) : (
        'Create Replay'
      )}
    </Button>
  );
}

export default function DailyReplay() {
  const [state, formAction] = useActionState(getNarrationAction, { data: undefined, error: undefined });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state.data?.audioUri && audioRef.current) {
      audioRef.current.src = state.data.audioUri;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [state.data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <PlayCircle className="w-6 h-6 text-primary" />
          <CardTitle className="font-headline text-xl">Daily Replay</CardTitle>
        </div>
        <CardDescription>
          Hear today's story from your Future Self.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <Textarea
            id="log"
            name="log"
            placeholder="Log your accomplishments and failures from today..."
            rows={5}
          />
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          {state.data && (
            <div className="p-3 rounded-md bg-primary/10 border border-primary/20 text-sm space-y-2">
                <p className='italic'>"{state.data.narration}"</p>
                <audio ref={audioRef} className="hidden" />
                <Button variant="ghost" size="sm" onClick={() => audioRef.current?.play()} className="text-primary">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Play Narration
                </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
