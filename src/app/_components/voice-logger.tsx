'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { logVoiceCommandAction } from '@/lib/actions';
import { useVoiceRecorder } from '@/hooks/use-voice-recorder';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, AlertTriangle, Volume2, Sparkles } from 'lucide-react';
import { SparkleIcon } from '@/components/icons/sparkle-icon';

function VoiceButton({
  status,
  start,
  stop,
}: {
  status: string;
  start: () => void;
  stop: () => void;
}) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button size="icon" disabled className="w-16 h-16 rounded-full animate-pulse">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Button>
    );
  }

  if (status === 'recording') {
    return (
      <Button
        size="icon"
        onClick={stop}
        variant="destructive"
        className="w-16 h-16 rounded-full"
      >
        <Square className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Button size="icon" onClick={start} className="w-16 h-16 rounded-full">
      <Mic className="h-6 w-6" />
    </Button>
  );
}

export default function VoiceLogger() {
  const { recordingStatus, audioDataUri, startRecording, stopRecording, resetRecording } = useVoiceRecorder();
  const [state, formAction] = useFormState(logVoiceCommandAction, { data: undefined, error: undefined });
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioDataUri) {
      const formData = new FormData();
      formData.append('audio', audioDataUri);
      formAction(formData);
      resetRecording();
    }
  }, [audioDataUri, formAction, resetRecording]);

  useEffect(() => {
    if (typeof window !== "undefined") {
        setAudio(new Audio());
    }
  }, []);

  useEffect(() => {
    if(state.data?.futureSelfGuidance && audio) {
        audio.src = state.data.futureSelfGuidance;
        audio.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [state.data, audio]);

  const getStatusText = () => {
    switch (recordingStatus) {
      case 'recording': return 'Recording...';
      case 'permission_denied': return 'Microphone access denied.';
      case 'error': return 'An error occurred.';
      default: return 'Log failures and trigger quests.';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SparkleIcon icon={Mic} className="w-6 h-6" />
          <CardTitle className="font-headline text-xl">Voice Command</CardTitle>
        </div>
        <CardDescription>{getStatusText()}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <form action={formAction} className='flex justify-center'>
          <VoiceButton status={recordingStatus} start={startRecording} stop={stopRecording} />
        </form>
         {(recordingStatus === 'permission_denied' || recordingStatus === 'error') && (
            <p className="text-sm text-destructive flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Please enable microphone permissions.</p>
        )}
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        {state.data && (
          <div className="w-full p-3 rounded-md bg-primary/10 border border-primary/20 text-sm space-y-2">
            <p className='font-semibold'>Log Message:</p>
            <p className='italic'>"{state.data.logMessage}"</p>
            <Button variant="ghost" size="sm" onClick={() => audio?.play()} className="text-primary">
                <Volume2 className="w-4 h-4 mr-2" />
                Play Guidance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
