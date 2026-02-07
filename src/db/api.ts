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

// ==================== 用户创作相关 ====================

// 创建文化模板
export async function createCultureTemplate(culture: Omit<CultureTemplate, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('culture_templates')
    .insert({
      ...culture,
      status: 'pending',
      is_official: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 创建事件
export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('events')
    .insert({
      ...event,
      status: 'pending',
      is_official: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 创建结局
export async function createEnding(ending: Omit<Ending, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('endings')
    .insert({
      ...ending,
      status: 'pending',
      is_official: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 获取用户的创作内容
export async function getUserCreations(userId: string) {
  const [cultures, events, endings] = await Promise.all([
    supabase.from('culture_templates').select('*').eq('creator_id', userId).order('created_at', { ascending: false }),
    supabase.from('events').select('*, culture:culture_templates(name)').eq('creator_id', userId).order('created_at', { ascending: false }),
    supabase.from('endings').select('*, culture:culture_templates(name)').eq('creator_id', userId).order('created_at', { ascending: false })
  ]);

  return {
    cultures: Array.isArray(cultures.data) ? cultures.data : [],
    events: Array.isArray(events.data) ? events.data : [],
    endings: Array.isArray(endings.data) ? endings.data : []
  };
}

// 获取社区创作内容（已批准的用户创作）
export async function getCommunityCreations() {
  const [cultures, events, endings] = await Promise.all([
    supabase
      .from('culture_templates')
      .select('*')
      .eq('status', 'approved')
      .eq('is_official', false)
      .order('created_at', { ascending: false }),
    supabase
      .from('events')
      .select('*, culture:culture_templates(name)')
      .eq('status', 'approved')
      .eq('is_official', false)
      .order('created_at', { ascending: false }),
    supabase
      .from('endings')
      .select('*, culture:culture_templates(name)')
      .eq('status', 'approved')
      .eq('is_official', false)
      .order('created_at', { ascending: false })
  ]);

  return {
    cultures: Array.isArray(cultures.data) ? cultures.data : [],
    events: Array.isArray(events.data) ? events.data : [],
    endings: Array.isArray(endings.data) ? endings.data : []
  };
}

// 获取待审核内容（管理员功能）
export async function getPendingCreations() {
  const [cultures, events, endings] = await Promise.all([
    supabase.from('culture_templates').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('events').select('*, culture:culture_templates(name)').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('endings').select('*, culture:culture_templates(name)').eq('status', 'pending').order('created_at', { ascending: false })
  ]);

  return {
    cultures: Array.isArray(cultures.data) ? cultures.data : [],
    events: Array.isArray(events.data) ? events.data : [],
    endings: Array.isArray(endings.data) ? endings.data : []
  };
}

// 审核内容
export async function reviewContent(
  type: 'culture' | 'event' | 'ending',
  id: string,
  status: 'approved' | 'rejected'
) {
  const tableName = type === 'culture' ? 'culture_templates' : type === 'event' ? 'events' : 'endings';
  
  const { error } = await supabase
    .from(tableName)
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

// 删除创作内容
export async function deleteCreation(
  type: 'culture' | 'event' | 'ending',
  id: string
) {
  const tableName = type === 'culture' ? 'culture_templates' : type === 'event' ? 'events' : 'endings';
  
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// 获取用户创作统计
export async function getUserCreationStats(userId: string) {
  const { cultures, events, endings } = await getUserCreations(userId);
  
  const allCreations = [...cultures, ...events, ...endings];
  
  return {
    total_creations: allCreations.length,
    approved_creations: allCreations.filter(c => c.status === 'approved').length,
    pending_creations: allCreations.filter(c => c.status === 'pending').length,
    rejected_creations: allCreations.filter(c => c.status === 'rejected').length,
    total_ratings: 0, // TODO: 实现评分统计
    average_rating: 0
  };
}
