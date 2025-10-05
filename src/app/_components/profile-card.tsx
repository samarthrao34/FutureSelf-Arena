import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

type ProfileCardProps = {
    level: number;
    totalXp: number;
    currentLevelXP: number;
    xpToNextLevel: number;
}

export default function ProfileCard({ level, totalXp, currentLevelXP, xpToNextLevel }: ProfileCardProps) {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
  const progress = (currentLevelXP / xpToNextLevel) * 100;
  const nextLevel = level + 1;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 bg-card/50 p-4">
        {userAvatar && (
          <Image
            src={userAvatar.imageUrl}
            alt={userAvatar.description}
            width={80}
            height={80}
            className="rounded-full border-2 border-primary shadow-lg"
            data-ai-hint={userAvatar.imageHint}
          />
        )}
        <div>
          <CardTitle className="font-headline text-xl">Samarth Rao</CardTitle>
          <CardDescription>Level {level} - Novice</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total XP</span>
            <Badge variant="secondary" className="font-mono">
              {totalXp} XP
            </Badge>
          </div>
          <div className="space-y-1">
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground text-right font-mono">
              {currentLevelXP} / {xpToNextLevel} XP to Level {nextLevel}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
