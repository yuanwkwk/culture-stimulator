import { type Stage } from '@/types/game';
import { motion } from 'motion/react';
import { useI18n } from '@/contexts/I18nContext';

interface StageIndicatorProps {
  currentStage: Stage;
}

export default function StageIndicator({ currentStage }: StageIndicatorProps) {
  const { t } = useI18n();
  const stages: Stage[] = ['childhood', 'youth', 'adult', 'elder'];
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {stages.map((stage, index) => {
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={stage} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                    font-bold text-sm md:text-base transition-all
                    ${isActive ? 'bg-primary text-primary-foreground shadow-lg' : ''}
                    ${isPast ? 'bg-chart-2 text-white' : ''}
                    ${isFuture ? 'bg-muted text-muted-foreground' : ''}
                  `}
                >
                  {index + 1}
                </motion.div>
                <div className="mt-2 text-center">
                  <p className={`text-xs md:text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {t.stages[stage]}
                  </p>
                  <p className="text-xs text-muted-foreground hidden md:block">
                    {t.stages[`${stage}Age` as keyof typeof t.stages]}
                  </p>
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className={`
                  h-0.5 flex-1 mx-2 transition-all
                  ${isPast ? 'bg-chart-2' : 'bg-muted'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
