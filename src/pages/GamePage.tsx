import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { CultureTemplate, Event } from '@/types/game';
import { GameEngine } from '@/services/gameEngine';
import { saveGameSession } from '@/db/api';
import AttributePanel from '@/components/game/AttributePanel';
import EventCard from '@/components/game/EventCard';
import StageIndicator from '@/components/game/StageIndicator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Home } from 'lucide-react';
import { STAGE_INFO } from '@/types/game';
import { motion } from 'motion/react';

export default function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const culture = location.state?.culture as CultureTemplate;

  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!culture) {
      navigate('/');
      return;
    }

    const engine = new GameEngine(culture);
    setGameEngine(engine);
    loadNextEvent(engine);
  }, [culture, navigate]);

  const loadNextEvent = async (engine: GameEngine) => {
    setLoading(true);
    try {
      const event = await engine.getNextEvent();
      if (!event) {
        // 游戏结束，显示结局
        await showEnding(engine);
      } else {
        setCurrentEvent(event);
      }
    } catch (error) {
      console.error('加载事件失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choiceIndex: number) => {
    if (!gameEngine || !currentEvent || processing) return;

    setProcessing(true);
    try {
      gameEngine.makeChoice(currentEvent, choiceIndex);
      
      // 延迟一下，让用户看到选择效果
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await loadNextEvent(gameEngine);
    } catch (error) {
      console.error('处理选择失败:', error);
    } finally {
      setProcessing(false);
    }
  };

  const showEnding = async (engine: GameEngine) => {
    try {
      const ending = await engine.getEnding();
      const state = engine.getState();

      // 保存游戏记录
      await saveGameSession({
        culture_id: culture.id,
        final_attributes: state.attributes,
        ending_id: ending?.id || '',
        play_time: engine.getPlayTime()
      });

      // 跳转到结局页面
      navigate('/ending', {
        state: {
          ending,
          attributes: state.attributes,
          eventCount: engine.getPlayTime(),
          culture
        }
      });
    } catch (error) {
      console.error('显示结局失败:', error);
    }
  };

  if (!culture) {
    return null;
  }

  const state = gameEngine?.getState();

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <h1 className="text-lg md:text-xl font-bold text-foreground">
              {culture.name}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* 阶段指示器 */}
      {state && (
        <div className="border-b border-border bg-card/30">
          <div className="container mx-auto px-4">
            <StageIndicator currentStage={state.stage} />
          </div>
        </div>
      )}

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：属性面板 */}
          <div className="lg:col-span-1">
            {state ? (
              <div className="sticky top-24">
                <AttributePanel
                  attributes={state.attributes}
                  age={state.age}
                  stage={STAGE_INFO[state.stage].name}
                />
              </div>
            ) : (
              <Skeleton className="h-96 w-full bg-muted" />
            )}
          </div>

          {/* 右侧：事件卡片 */}
          <div className="lg:col-span-2">
            {loading ? (
              <Skeleton className="h-96 w-full bg-muted" />
            ) : currentEvent && state ? (
              <EventCard
                event={currentEvent}
                age={state.age}
                onChoice={handleChoice}
                disabled={processing}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">加载中...</p>
              </div>
            )}
          </div>
        </div>

        {/* 事件历史（可选） */}
        {state && state.eventHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold mb-4 text-foreground">人生轨迹</h3>
            <div className="space-y-2">
              {state.eventHistory.slice(-5).reverse().map((item, index) => (
                <div
                  key={index}
                  className="text-sm text-muted-foreground bg-card/50 p-3 rounded-lg border border-border"
                >
                  <span className="font-medium text-foreground">{item.age}岁：</span>
                  {item.event.title} - {item.choice.text}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
