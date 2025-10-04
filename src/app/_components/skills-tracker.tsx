import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Skill } from "@/lib/types";
import { BrainCircuit, Zap, HeartPulse, Gem } from "lucide-react";

type SkillsTrackerProps = {
    skills: Skill[];
}

const iconMap: { [key: string]: React.ElementType } = {
    Knowledge: BrainCircuit,
    Mindset: Zap,
    Health: HeartPulse,
    Creativity: Gem,
}

export default function SkillsTracker({ skills }: SkillsTrackerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Skill Tree</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills.map((skill) => {
          const progress = (skill.xp / skill.xpToNextLevel) * 100;
          const Icon = iconMap[skill.name] || Gem;
          return (
            <div key={skill.name} className="space-y-2">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-accent" />
                <h4 className="font-semibold flex-1">{skill.name}</h4>
                <span className="text-sm font-medium text-muted-foreground">
                  Lvl {skill.level}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
               <p className="text-xs text-muted-foreground text-right font-mono">
                {skill.xp} / {skill.xpToNextLevel} XP
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
