import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCultureTemplates } from '@/db/api';
import type { CultureTemplate } from '@/types/game';
import CultureCard from '@/components/game/CultureCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  const navigate = useNavigate();
  const [cultures, setCultures] = useState<CultureTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCultures();
  }, []);

  const loadCultures = async () => {
    try {
      const data = await getCultureTemplates();
      setCultures(data);
    } catch (error) {
      console.error('加载文化模板失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCulture = (culture: CultureTemplate) => {
    navigate('/game', { state: { culture } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              <h1 className="text-xl md:text-3xl font-bold gradient-text">
                文化人生模拟器
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/library')}
              className="hidden md:flex"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              内容库
            </Button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">
            选择你的文化背景
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            体验不同文化背景下的人生故事，做出选择，书写属于你的传奇
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full bg-muted" />
              </div>
            ))}
          </div>
        ) : cultures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无可用的文化模板</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cultures.map((culture, index) => (
              <motion.div
                key={culture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CultureCard
                  culture={culture}
                  onClick={() => handleSelectCulture(culture)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* 移动端内容库按钮 */}
        <div className="md:hidden fixed bottom-4 right-4">
          <Button
            size="lg"
            onClick={() => navigate('/library')}
            className="rounded-full shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            内容库
          </Button>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 文化人生模拟器 · 体验不同文化的人生故事</p>
        </div>
      </footer>
    </div>
  );
}
