// 游戏相关类型定义

export interface Attribute {
  name: string;
  description: string;
  initial: number;
}

export interface CultureTemplate {
  id: string;
  name: string;
  description: string;
  era: string;
  region: string;
  special_attributes: Attribute[];
  is_official: boolean;
  creator_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Choice {
  text: string;
  effects: Record<string, number>;
}

export interface Event {
  id: string;
  culture_id: string;
  title: string;
  description: string;
  stage: 'childhood' | 'youth' | 'adult' | 'elder';
  choices: Choice[];
  requirements: Record<string, number>;
  is_official: boolean;
  creator_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Ending {
  id: string;
  culture_id: string;
  title: string;
  description: string;
  conditions: Record<string, number>;
  achievement_level: 'legendary' | 'excellent' | 'good' | 'ordinary' | 'poor';
  is_official: boolean;
  creator_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CreationRating {
  id: string;
  content_type: 'culture' | 'event' | 'ending';
  content_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface GameSession {
  id: string;
  culture_id: string;
  final_attributes: Record<string, number>;
  ending_id: string;
  play_time: number;
  created_at: string;
}

export interface PlayerAttributes {
  学识: number;
  技艺: number;
  财富: number;
  声望: number;
  健康: number;
  [key: string]: number;
}

export interface GameState {
  culture: CultureTemplate;
  stage: 'childhood' | 'youth' | 'adult' | 'elder';
  age: number;
  attributes: PlayerAttributes;
  eventHistory: Array<{
    event: Event;
    choice: Choice;
    age: number;
  }>;
  currentEvent?: Event;
}

export type Stage = 'childhood' | 'youth' | 'adult' | 'elder';

export const STAGE_INFO: Record<Stage, { name: string; ageRange: string; description: string }> = {
  childhood: { name: '童年期', ageRange: '0-12岁', description: '文化启蒙阶段' },
  youth: { name: '青少年期', ageRange: '13-20岁', description: '学习成长阶段' },
  adult: { name: '成年期', ageRange: '21-50岁', description: '主要人生阶段' },
  elder: { name: '晚年期', ageRange: '51岁+', description: '总结与结局阶段' }
};

export const ACHIEVEMENT_LEVELS = {
  legendary: { name: '传奇', color: 'text-chart-1', description: '名垂青史' },
  excellent: { name: '卓越', color: 'text-chart-2', description: '功成名就' },
  good: { name: '良好', color: 'text-chart-3', description: '小有成就' },
  ordinary: { name: '普通', color: 'text-muted-foreground', description: '平凡一生' },
  poor: { name: '困顿', color: 'text-destructive', description: '潦倒终生' }
};
