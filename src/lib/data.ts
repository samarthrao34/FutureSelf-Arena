import { BrainCircuit, HeartPulse, Swords, Zap, Gem } from "lucide-react";
import type { Skill, Quest } from "@/lib/types";

export const initialSkills: Skill[] = [
  { name: "Knowledge", level: 12, xp: 340, xpToNextLevel: 1000, icon: BrainCircuit },
  { name: "Mindset", level: 15, xp: 880, xpToNextLevel: 1200, icon: Zap },
  { name: "Health", level: 10, xp: 120, xpToNextLevel: 800, icon: HeartPulse },
  { name: "Creativity", level: 8, xp: 500, xpToNextLevel: 700, icon: Gem },
];

export const initialQuests: Quest[] = [
    { id: 'q1', title: 'Boss Fight: Assignment Ogre', description: 'Complete the upcoming assignment.', xp: 250, type: 'daily' },
    { id: 'q2', title: 'Speed Reading Practice', description: 'Practice speed reading for 20 minutes.', xp: 50, type: 'daily' },
    { id: 'q3', title: 'Launch Startup', description: 'Ultra-hard long-term quest for the Top 1% Path.', xp: 10000, type: 'legendary' },
];

export const analyticsData = {
  xpOverTime: [
    { date: "Oct 1", XP: 200 },
    { date: "Oct 2", XP: 350 },
    { date: "Oct 3", XP: 320 },
    { date: "Oct 4", XP: 480 },
    { date: "Oct 5", XP: 510 },
    { date: "Oct 6", XP: 600 },
    { date: "Oct 7", XP: 750 },
  ],
  lifeMonitor: [
      { stat: 'Knowledge', value: 85, fullMark: 100 },
      { stat: 'Mindset', value: 92, fullMark: 100 },
      { stat: 'Health', value: 75, fullMark: 100 },
      { stat: 'Creativity', value: 80, fullMark: 100 },
      { stat: 'Finance', value: 60, fullMark: 100 },
  ],
  failureSuccess: [
    { name: 'Failures', value: 12, fill: "hsl(var(--destructive))" },
    { name: 'Successes', value: 45, fill: "hsl(var(--accent))" },
  ],
};
