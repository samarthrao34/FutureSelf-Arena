'use client';
import { cn } from '@/lib/utils';

type WaveformProps = {
  state: 'idle' | 'user' | 'ai' | 'thinking';
};

export default function Waveform({ state }: WaveformProps) {
  const isAnimating = state === 'user' || state === 'ai';

  return (
    <div className="flex items-center justify-center gap-1.5 h-10 w-full">
      {Array.from({ length: 32 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-full transition-all duration-300 ease-in-out',
            state === 'thinking' && 'bg-muted-foreground animate-pulse',
            state === 'idle' && 'bg-muted h-1',
            isAnimating && 'bg-primary'
          )}
          style={{
            animationDelay: isAnimating ? `${i * 50}ms` : undefined,
            animationName: isAnimating ? `wave-${i % 4}` : undefined,
            animationDuration: isAnimating ? '1.5s' : undefined,
            animationIterationCount: isAnimating ? 'infinite' : undefined,
            height: state === 'idle' ? '0.25rem' : '100%',
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes wave-0 {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        @keyframes wave-1 {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(0.8); }
        }
        @keyframes wave-2 {
          0%, 100% { transform: scaleY(0.6); }
          50% { transform: scaleY(0.3); }
        }
        @keyframes wave-3 {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(0.7); }
        }
      `}</style>
    </div>
  );
}
