'use client';

import { useState } from 'react';
import Header from './_components/header';
import ProfileCard from './_components/profile-card';
import QuestBoard from './_components/quest-board';
import SkillsTracker from './_components/skills-tracker';
import AnalyticsDashboard from './_components/analytics-dashboard';
import MentorPanel from './_components/mentor-panel';
import VoiceLogger from './_components/voice-logger';
import DailyReplay from './_components/daily-replay';
import type { Quest, Skill } from '@/lib/types';
import { BrainCircuit, Zap, HeartPulse, Gem } from 'lucide-react';
import { analyticsData } from '@/lib/data';

const initialSkillsData: Skill[] = [
  { name: 'Knowledge', level: 1, xp: 0, xpToNextLevel: 1000, icon: BrainCircuit },
  { name: 'Mindset', level: 1, xp: 0, xpToNextLevel: 1000, icon: Zap },
  { name: 'Health', level: 1, xp: 0, xpToNextLevel: 1000, icon: HeartPulse },
  { name: 'Creativity', level: 1, xp: 0, xpToNextLevel: 1000, icon: Gem },
];

export default function Home() {
  const [totalXp, setTotalXp] = useState(0);
  const [skills, setSkills] = useState<Skill[]>(initialSkillsData);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [localAnalyticsData, setLocalAnalyticsData] = useState(analyticsData);

  const handleUpdateQuest = (updatedQuest: Quest) => {
    const questIndex = quests.findIndex(q => q.id === updatedQuest.id);
    if (questIndex === -1) return;
    
    const oldQuest = quests[questIndex];
    const newQuests = [...quests];
    newQuests[questIndex] = updatedQuest;
    setQuests(newQuests);

    // If quest is newly completed, add XP
    if (updatedQuest.completed && !oldQuest.completed) {
      const newTotalXp = totalXp + updatedQuest.xp;
      setTotalXp(newTotalXp);

      // Distribute XP among skills
      const xpPerSkill = updatedQuest.xp / skills.length;
      const updatedSkills = skills.map(skill => {
        let newSkillXp = skill.xp + xpPerSkill;
        let newSkillLevel = skill.level;
        let newXpToNextLevel = skill.xpToNextLevel;

        while (newSkillXp >= newXpToNextLevel) {
          newSkillXp -= newXpToNextLevel;
          newSkillLevel++;
          newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
        }

        return { ...skill, xp: Math.round(newSkillXp), level: newSkillLevel, xpToNextLevel: newXpToNextLevel };
      });
      setSkills(updatedSkills);
      
      // Update analytics
      setLocalAnalyticsData(prev => ({
        ...prev,
        xpOverTime: [...prev.xpOverTime, { date: new Date().toLocaleDateString(), XP: newTotalXp }],
        lifeMonitor: updatedSkills.map(s => ({stat: s.name, value: (s.xp / s.xpToNextLevel) * 100, fullMark: 100})),
        failureSuccess: [
            {...prev.failureSuccess[0]},
            {...prev.failureSuccess[1], value: prev.failureSuccess[1].value + 1}
        ]
      }));

    } else if (!updatedQuest.completed && oldQuest.completed) {
        // If quest is un-completed, remove XP
        const newTotalXp = totalXp - updatedQuest.xp;
        setTotalXp(newTotalXp < 0 ? 0 : newTotalXp);
        
        // This is a simplified version, for a real app you might need a more complex logic to revert skill levels
        const xpPerSkill = updatedQuest.xp / skills.length;
        const updatedSkills = skills.map(skill => {
            const newSkillXp = skill.xp - xpPerSkill;
            return {...skill, xp: newSkillXp < 0 ? 0 : Math.round(newSkillXp)};
        })
        setSkills(updatedSkills);
    }
  };

  const handleAddQuest = (newQuest: Quest) => {
    setQuests(prev => [newQuest, ...prev]);
  }
  
  const handleDeleteQuest = (questId: string) => {
      setQuests(quests.filter(q => q.id !== questId));
  }

  const level = Math.floor(totalXp / 1000) + 1;
  const currentLevelXP = totalXp % 1000;
  const xpToNextLevel = 1000;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
          <ProfileCard 
            level={level}
            totalXp={totalXp}
            currentLevelXP={currentLevelXP}
            xpToNextLevel={xpToNextLevel}
          />
          <SkillsTracker skills={skills} />
          <MentorPanel />
        </div>
        <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-6">
          <QuestBoard 
            quests={quests}
            onUpdateQuest={handleUpdateQuest}
            onAddQuest={handleAddQuest}
            onDeleteQuest={handleDeleteQuest}
          />
          <AnalyticsDashboard analyticsData={localAnalyticsData} />
        </div>
        <div className="lg:col-span-3 xl:col-span-1 flex flex-col gap-6">
          <VoiceLogger />
          <DailyReplay />
        </div>
      </main>
    </div>
  );
}
