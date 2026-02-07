import { useLocation, useNavigate } from 'react-router-dom';
import type { Ending, PlayerAttributes, CultureTemplate } from '@/types/game';
import EndingDisplay from '@/components/game/EndingDisplay';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n, interpolate } from '@/contexts/I18nContext';

export default function EndingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  const ending = location.state?.ending as Ending;
  const attributes = location.state?.attributes as PlayerAttributes;
  const eventCount = location.state?.eventCount as number;
  const culture = location.state?.culture as CultureTemplate;

  if (!ending || !attributes) {
    navigate('/');
    return null;
  }

  const handlePlayAgain = () => {
    if (culture) {
      navigate('/game', { state: { culture } });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3 gradient-text">
            {t.ending.title}
          </h1>
          <p className="text-muted-foreground">
            {interpolate(t.ending.subtitle, { culture: culture?.name || '' })}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-8">
          <EndingDisplay
            ending={ending}
            attributes={attributes}
            eventCount={eventCount}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={handlePlayAgain}
            className="w-full md:w-auto"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t.ending.playAgain}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full md:w-auto"
          >
            <Home className="w-5 h-5 mr-2" />
            {t.ending.backHome}
          </Button>
        </motion.div>

        {/* 分享提示（未来功能） */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            {t.ending.saved}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
