import Header from './_components/header';
import ProfileCard from './_components/profile-card';
import QuestBoard from './_components/quest-board';
import SkillsTracker from './_components/skills-tracker';
import AnalyticsDashboard from './_components/analytics-dashboard';
import MentorPanel from './_components/mentor-panel';
import VoiceLogger from './_components/voice-logger';
import DailyReplay from './_components/daily-replay';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
          <ProfileCard />
          <SkillsTracker />
          <MentorPanel />
        </div>
        <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-6">
          <QuestBoard />
          <AnalyticsDashboard />
        </div>
        <div className="lg:col-span-3 xl:col-span-1 flex flex-col gap-6">
          <VoiceLogger />
          <DailyReplay />
        </div>
      </main>
    </div>
  );
}
