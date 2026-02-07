import type { 
  CultureTemplate, 
  Event, 
  Ending, 
  PlayerAttributes, 
  GameState, 
  Stage,
  Choice 
} from '@/types/game';
import { getEventsByCultureAndStage, getEndingsByCulture } from '@/db/api';

// 初始化玩家属性
export function initializeAttributes(culture: CultureTemplate): PlayerAttributes {
  const baseAttributes: PlayerAttributes = {
    学识: 10,
    技艺: 10,
    财富: 30,
    声望: 10,
    健康: 80
  };

  // 添加文化特有属性
  if (culture.special_attributes && Array.isArray(culture.special_attributes)) {
    culture.special_attributes.forEach(attr => {
      baseAttributes[attr.name] = attr.initial || 0;
    });
  }

  return baseAttributes;
}

// 应用选择效果
export function applyChoiceEffects(
  attributes: PlayerAttributes,
  effects: Record<string, number>
): PlayerAttributes {
  const newAttributes = { ...attributes };

  Object.entries(effects).forEach(([key, value]) => {
    if (newAttributes[key] !== undefined) {
      newAttributes[key] = Math.max(0, Math.min(100, newAttributes[key] + value));
    } else {
      newAttributes[key] = Math.max(0, Math.min(100, value));
    }
  });

  return newAttributes;
}

// 检查事件需求是否满足
export function checkEventRequirements(
  attributes: PlayerAttributes,
  requirements: Record<string, number>
): boolean {
  if (!requirements || Object.keys(requirements).length === 0) {
    return true;
  }

  return Object.entries(requirements).every(([key, value]) => {
    return attributes[key] !== undefined && attributes[key] >= value;
  });
}

// 从事件池中随机选择事件
export function selectRandomEvent(
  events: Event[],
  attributes: PlayerAttributes,
  usedEventIds: Set<string>
): Event | null {
  // 过滤掉已使用的事件和不满足需求的事件
  const availableEvents = events.filter(
    event => !usedEventIds.has(event.id) && checkEventRequirements(attributes, event.requirements)
  );

  if (availableEvents.length === 0) {
    // 如果没有可用事件，允许重复使用
    const repeatableEvents = events.filter(event =>
      checkEventRequirements(attributes, event.requirements)
    );
    if (repeatableEvents.length === 0) return null;
    return repeatableEvents[Math.floor(Math.random() * repeatableEvents.length)];
  }

  return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}

// 获取下一个阶段
export function getNextStage(currentStage: Stage): Stage | null {
  const stages: Stage[] = ['childhood', 'youth', 'adult', 'elder'];
  const currentIndex = stages.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === stages.length - 1) {
    return null;
  }
  return stages[currentIndex + 1];
}

// 根据阶段获取年龄
export function getAgeByStage(stage: Stage, eventCount: number): number {
  const ageRanges = {
    childhood: { start: 5, increment: 2 },
    youth: { start: 13, increment: 2 },
    adult: { start: 21, increment: 5 },
    elder: { start: 51, increment: 5 }
  };

  const range = ageRanges[stage];
  return range.start + eventCount * range.increment;
}

// 计算结局匹配度
export function calculateEndingMatch(
  ending: Ending,
  attributes: PlayerAttributes
): number {
  if (!ending.conditions || Object.keys(ending.conditions).length === 0) {
    return 0;
  }

  let totalMatch = 0;
  let conditionCount = 0;

  Object.entries(ending.conditions).forEach(([key, requiredValue]) => {
    if (attributes[key] !== undefined) {
      const actualValue = attributes[key];
      // 计算匹配度：如果达到要求，匹配度为100%；否则按比例计算
      const match = actualValue >= requiredValue ? 100 : (actualValue / requiredValue) * 100;
      totalMatch += match;
      conditionCount++;
    }
  });

  return conditionCount > 0 ? totalMatch / conditionCount : 0;
}

// 选择最佳结局
export function selectBestEnding(
  endings: Ending[],
  attributes: PlayerAttributes
): Ending | null {
  if (endings.length === 0) return null;

  // 计算每个结局的匹配度
  const endingsWithMatch = endings.map(ending => ({
    ending,
    match: calculateEndingMatch(ending, attributes)
  }));

  // 按匹配度排序
  endingsWithMatch.sort((a, b) => b.match - a.match);

  // 返回匹配度最高的结局
  return endingsWithMatch[0].ending;
}

// 游戏引擎类
export class GameEngine {
  private culture: CultureTemplate;
  private attributes: PlayerAttributes;
  private stage: Stage;
  private age: number;
  private eventHistory: Array<{ event: Event; choice: Choice; age: number }>;
  private usedEventIds: Set<string>;
  private eventsPerStage: number;
  private currentStageEventCount: number;

  constructor(culture: CultureTemplate) {
    this.culture = culture;
    this.attributes = initializeAttributes(culture);
    this.stage = 'childhood';
    this.age = 5;
    this.eventHistory = [];
    this.usedEventIds = new Set();
    this.eventsPerStage = 3; // 每个阶段3个事件
    this.currentStageEventCount = 0;
  }

  getState(): GameState {
    return {
      culture: this.culture,
      stage: this.stage,
      age: this.age,
      attributes: { ...this.attributes },
      eventHistory: [...this.eventHistory]
    };
  }

  async getNextEvent(): Promise<Event | null> {
    // 检查当前阶段是否完成
    if (this.currentStageEventCount >= this.eventsPerStage) {
      const nextStage = getNextStage(this.stage);
      if (!nextStage) {
        return null; // 游戏结束
      }
      this.stage = nextStage;
      this.currentStageEventCount = 0;
      this.age = getAgeByStage(this.stage, 0);
    }

    // 获取当前阶段的事件
    const events = await getEventsByCultureAndStage(this.culture.id, this.stage);
    const event = selectRandomEvent(events, this.attributes, this.usedEventIds);

    if (event) {
      this.usedEventIds.add(event.id);
    }

    return event;
  }

  makeChoice(event: Event, choiceIndex: number): void {
    if (choiceIndex < 0 || choiceIndex >= event.choices.length) {
      throw new Error('Invalid choice index');
    }

    const choice = event.choices[choiceIndex];
    
    // 应用选择效果
    this.attributes = applyChoiceEffects(this.attributes, choice.effects);

    // 记录事件历史
    this.eventHistory.push({
      event,
      choice,
      age: this.age
    });

    // 更新年龄和计数
    this.currentStageEventCount++;
    this.age = getAgeByStage(this.stage, this.currentStageEventCount);
  }

  async getEnding(): Promise<Ending | null> {
    const endings = await getEndingsByCulture(this.culture.id);
    return selectBestEnding(endings, this.attributes);
  }

  getPlayTime(): number {
    return this.eventHistory.length;
  }
}
