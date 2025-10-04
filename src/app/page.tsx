'use client';

import { useState, useEffect } from 'react';
import Header from './_components/header';
import ProfileCard from './_components/profile-card';
import QuestBoard from './_components/quest-board';
import SkillsTracker from './_components/skills-tracker';
import AnalyticsDashboard from './_components/analytics-dashboard';
import MentorPanel from './_components/mentor-panel';
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedQuests = localStorage.getItem('quests');
      const storedTotalXp = localStorage.getItem('totalXp');
      const storedSkills = localStorage.getItem('skills');
      const storedAnalytics = localStorage.getItem('analyticsData');
  
      if (storedQuests) setQuests(JSON.parse(storedQuests));
      if (storedTotalXp) setTotalXp(JSON.parse(storedTotalXp));
      if (storedSkills) setSkills(JSON.parse(storedSkills));
      if (storedAnalytics) setLocalAnalyticsData(JSON.parse(storedAnalytics));
    } catch (error) {
        console.error("Failed to parse from local storage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
        localStorage.setItem('quests', JSON.stringify(quests));
        localStorage.setItem('totalXp', JSON.stringify(totalXp));
        localStorage.setItem('skills', JSON.stringify(skills));
        localStorage.setItem('analyticsData', JSON.stringify(localAnalyticsData));
    } catch (error) {
        console.error("Failed to save to local storage", error);
    }
  }, [quests, totalXp, skills, localAnalyticsData, isLoaded]);


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
      setLocalAnalyticsData(prev => {
        const today = new Date().toLocaleDateString();
        const existingEntryIndex = prev.xpOverTime.findIndex(e => e.date === today);
        let newXpOverTime;
        if (existingEntryIndex > -1) {
            newXpOverTime = [...prev.xpOverTime];
            newXpOverTime[existingEntryIndex] = {...newXpOverTime[existingEntryIndex], XP: newTotalXp };
        } else {
            newXpOverTime = [...prev.xpOverTime, { date: today, XP: newTotalXp }]
        }
        
        return {
        ...prev,
        xpOverTime: newXpOverTime,
        lifeMonitor: updatedSkills.map(s => ({stat: s.name, value: Math.round((s.xp / s.xpToNextLevel) * 100), fullMark: 100})),
      }});

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

        // Update analytics
        setLocalAnalyticsData(prev => {
            const today = new Date().toLocaleDateString();
            const existingEntryIndex = prev.xpOverTime.findIndex(e => e.date === today);
            let newXpOverTime;
            if (existingEntryIndex > -1) {
                newXpOverTime = [...prev.xpOverTime];
                newXpOverTime[existingEntryIndex] = {...newXpOverTime[existingEntryIndex], XP: newTotalXp };
            } else {
                newXpOverTime = [...prev.xpOverTime, { date: today, XP: newTotalXp }]
            }

            return {
                ...prev,
                xpOverTime: newXpOverTime,
                lifeMonitor: updatedSkills.map(s => ({stat: s.name, value: Math.round((s.xp / s.xpToNextLevel) * 100), fullMark: 100})),
            }
        });
    }
  };

  const handleAddQuest = (newQuest: Quest) => {
    setQuests(prev => [newQuest, ...prev]);
  }
  
  const handleDeleteQuest = (questId: string) => {
      const questToDelete = quests.find(q => q.id === questId);
      if (questToDelete?.completed) {
        // If the deleted quest was completed, subtract its XP
        const newTotalXp = totalXp - questToDelete.xp;
        setTotalXp(newTotalXp < 0 ? 0 : newTotalXp);

        const xpPerSkill = questToDelete.xp / skills.length;
        const updatedSkills = skills.map(skill => {
            let newSkillXp = skill.xp - xpPerSkill;
            // Basic level down, more complex logic might be needed for real app
            let newSkillLevel = skill.level;
            let newXpToNextLevel = skill.xpToNextLevel;
            if (newSkillXp < 0) {
              if (newSkillLevel > 1) {
                newSkillLevel--;
                newXpToNextLevel = Math.ceil(newXpToNextLevel / 1.5);
                newSkillXp += newXpToNextLevel;
              } else {
                newSkillXp = 0;
              }
            }
            return { ...skill, xp: Math.round(newSkillXp), level: newSkillLevel, xpToNextLevel: newXpToNextLevel };
        });
        setSkills(updatedSkills);
        setLocalAnalyticsData(prev => ({
            ...prev,
            lifeMonitor: updatedSkills.map(s => ({stat: s.name, value: Math.round((s.xp / s.xpToNextLevel) * 100), fullMark: 100})),
        }));
      }
      setQuests(quests.filter(q => q.id !== questId));
  }

  const level = Math.floor(totalXp / 1000) + 1;
  const xpForCurrentLevel = totalXp - ((level -1) * 1000);
  const xpToNextLevel = Math.floor(1000 * (Math.pow(1.5, level -1)));


  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-muted-foreground">Loading Your Arena...</p>
          </div>
      </div>
    );
  }

  const userContext = {
      totalXp,
      level,
      skills: skills.map(s => ({name: s.name, level: s.level, xp: s.xp, xpToNextLevel: s.xpToNextLevel})),
      quests: {
          completed: quests.filter(q => q.completed).map(q => q.title),
          remaining: quests.filter(q => !q.completed).map(q => q.title)
      },
      lifeMonitor: localAnalyticsData.lifeMonitor,
  };


  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ProfileCard 
            level={level}
            totalXp={totalXp}
            currentLevelXP={xpForCurrentLevel}
            xpToNextLevel={xpToNextLevel}
          />
          <SkillsTracker skills={skills} />
          <MentorPanel userContext={userContext} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <QuestBoard 
            quests={quests}
            onUpdateQuest={handleUpdateQuest}
            onAddQuest={handleAddQuest}
            onDeleteQuest={handleDeleteQuest}
          />
          <AnalyticsDashboard analyticsData={localAnalyticsData} />
        </div>
      </main>
    </div>
  );
}
