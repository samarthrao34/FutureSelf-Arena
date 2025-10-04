export type Skill = {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  icon: React.ElementType;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: 'daily' | 'legendary';
};
