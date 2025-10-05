import { Target } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
          FutureSelf Arena
        </h1>
      </div>
    </header>
  );
}
