'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mic, MicOff, Volume2, ArrowLeft } from 'lucide-react';
import { getTherapistResponseAction } from '@/lib/actions';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// SpeechRecognition might not be available in all browsers, or on the server.
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

type Message = {
  id: number;
  speaker: 'user' | 'ai';
  text: string;
  audio?: string;
};

export default function TherapistPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(getTherapistResponseAction, {data: undefined, error: undefined});

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      
      setConversation(prev => [...prev, { id: Date.now(), speaker: 'user', text: transcript }]);

      const formData = new FormData();
      formData.append('transcript', transcript);
      formAction(formData);

      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    }

    recognitionRef.current = recognition;
  }, [formAction]);

  useEffect(() => {
    if (state.data) {
        setConversation(prev => [...prev, { id: Date.now() + 1, speaker: 'ai', text: state.data.response, audio: state.data.audio }]);
        if (audioRef.current && state.data.audio) {
            audioRef.current.src = state.data.audio;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    } else if (state.error) {
        setError(state.error);
    }
  }, [state]);


  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      setError(null);
    }
  };

  const playAudio = (audioData: string) => {
      if (audioRef.current) {
          audioRef.current.src = audioData;
          audioRef.current.play().catch(e => console.error("Audio playback failed: ", e));
      }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="mb-6">
        <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Arena
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center">
        <Card className="w-full max-w-2xl flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-3">
              AI Therapist
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
              {conversation.map((msg) => (
                <div key={msg.id} className={cn("flex items-start gap-3", msg.speaker === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                      "p-3 rounded-lg max-w-md", 
                      msg.speaker === 'user' ? 'bg-primary/20 text-right' : 'bg-muted'
                  )}>
                    <p>{msg.text}</p>
                    {msg.speaker === 'ai' && msg.audio && (
                      <Button variant="ghost" size="sm" onClick={() => playAudio(msg.audio!)} className="mt-2 text-primary">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Listen
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={conversationEndRef} />
            </div>

            <div className="mt-auto pt-4 border-t">
              {error && <p className="text-sm text-center text-destructive mb-2">{error}</p>}
              <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {isRecording ? 'Listening...' : (isPending ? 'Thinking...' : 'Press the button and speak')}
                  </p>
                  <Button
                    onClick={toggleRecording}
                    disabled={isPending}
                    size="icon"
                    className={cn(
                      "rounded-full w-16 h-16 transition-all duration-300",
                      isRecording ? 'bg-destructive hover:bg-destructive/90 scale-110' : 'bg-primary hover:bg-primary/90',
                      isPending && 'animate-pulse'
                    )}
                  >
                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />)}
                  </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <audio ref={audioRef} className="hidden" />
      </main>
    </div>
  );
}
