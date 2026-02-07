import { supabase } from './supabase';
import type { CultureTemplate, Event, Ending, CreationRating, GameSession } from '@/types/game';

// 获取所有已批准的文化模板
export async function getCultureTemplates(): Promise<CultureTemplate[]> {
  const { data, error } = await supabase
    .from('culture_templates')
    .select('*')
    .eq('status', 'approved')
    .order('is_official', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// 获取单个文化模板
export async function getCultureTemplate(id: string): Promise<CultureTemplate | null> {
  const { data, error } = await supabase
    .from('culture_templates')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 获取指定文化和阶段的事件
export async function getEventsByCultureAndStage(
  cultureId: string,
  stage: string
): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('culture_id', cultureId)
    .eq('stage', stage)
    .eq('status', 'approved')
    .order('created_at');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// 获取指定文化的所有结局
export async function getEndingsByCulture(cultureId: string): Promise<Ending[]> {
  const { data, error } = await supabase
    .from('endings')
    .select('*')
    .eq('culture_id', cultureId)
    .eq('status', 'approved')
    .order('achievement_level');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// 保存游戏记录
export async function saveGameSession(session: Omit<GameSession, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('game_sessions')
    .insert(session);

  if (error) throw error;
}

// 获取内容评分
export async function getRatings(
  contentType: 'culture' | 'event' | 'ending',
  contentId: string
): Promise<CreationRating[]> {
  const { data, error } = await supabase
    .from('creation_ratings')
    .select('*')
    .eq('content_type', contentType)
    .eq('content_id', contentId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// 添加评分
export async function addRating(
  rating: Omit<CreationRating, 'id' | 'created_at'>
): Promise<void> {
  const { error } = await supabase
    .from('creation_ratings')
    .insert(rating);

  if (error) throw error;
}

// 获取平均评分
export async function getAverageRating(
  contentType: 'culture' | 'event' | 'ending',
  contentId: string
): Promise<number> {
  const ratings = await getRatings(contentType, contentId);
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / ratings.length;
}

// 获取游戏统计
export async function getGameStats() {
  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}
