import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Ending, PlayerAttributes } from '@/types/game';
import { ACHIEVEMENT_LEVELS } from '@/types/game';
import { motion } from 'motion/react';

interface EndingDisplayProps {
  ending: Ending;
  attributes: PlayerAttributes;
  eventCount: number;
}

export default function EndingDisplay({ ending, attributes, eventCount }: EndingDisplayProps) {
  const achievementInfo = ACHIEVEMENT_LEVELS[ending.achievement_level];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-card border-border shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-1 ${achievementInfo.color} border-current`}
            >
              {achievementInfo.name}
            </Badge>
          </div>
          <CardTitle className="text-2xl md:text-3xl gradient-text mb-2">
            {ending.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{achievementInfo.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm md:prose-base max-w-none">
            <p className="text-foreground/90 leading-relaxed text-center">
              {ending.description}
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">人生报告卡</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(attributes).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-foreground">{key}</span>
                    <span className="text-xs font-bold text-primary">{value}</span>
                  </div>
                  <Progress value={value} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{eventCount}</p>
                <p className="text-xs text-muted-foreground">人生事件</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {Object.values(attributes).reduce((a, b) => a + b, 0)}
                </p>
                <p className="text-xs text-muted-foreground">总属性值</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
