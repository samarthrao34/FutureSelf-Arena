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

export default function ProfileCard() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
  const currentLevelXP = 0;
  const xpToNextLevel = 1000;
  const progress = (currentLevelXP / xpToNextLevel) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 bg-card/50">
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
          <CardTitle className="font-headline text-2xl">Samarth Rao</CardTitle>
          <CardDescription>Level 1 - Novice</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total XP</span>
            <Badge variant="secondary" className="font-mono">
              0 XP
            </Badge>
          </div>
          <div className="space-y-1">
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground text-right font-mono">
              {currentLevelXP} / {xpToNextLevel} XP to Level 2
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
