import { BrainCircuit, HeartPulse, Swords, Zap, Gem } from "lucide-react";
import type { Skill, Quest } from "@/lib/types";

export const initialSkills: Skill[] = [
  { name: "Knowledge", level: 1, xp: 0, xpToNextLevel: 1000, icon: BrainCircuit },
  { name: "Mindset", level: 1, xp: 0, xpToNextLevel: 1000, icon: Zap },
  { name: "Health", level: 1, xp: 0, xpToNextLevel: 1000, icon: HeartPulse },
  { name: "Creativity", level: 1, xp: 0, xpToNextLevel: 1000, icon: Gem },
];

export const initialQuests: Quest[] = [];

export const analyticsData = {
  xpOverTime: [
    { date: "Start", XP: 0 },
  ],
  lifeMonitor: [
      { stat: 'Knowledge', value: 0, fullMark: 100 },
      { stat: 'Mindset', value: 0, fullMark: 100 },
      { stat: 'Health', value: 0, fullMark: 100 },
      { stat: 'Creativity', value: 0, fullMark: 100 },
      { stat: 'Finance', value: 0, fullMark: 100 },
  ],
  failureSuccess: [
    { name: 'Failures', value: 0, fill: "hsl(var(--destructive))" },
    { name: 'Successes', value: 0, fill: "hsl(var(--accent))" },
  ],
};
