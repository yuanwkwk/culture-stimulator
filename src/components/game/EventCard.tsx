import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Event, Choice } from '@/types/game';
import { motion } from 'motion/react';
import { useI18n } from '@/contexts/I18nContext';

interface EventCardProps {
  event: Event;
  age: number;
  onChoice: (choiceIndex: number) => void;
  disabled?: boolean;
}

export default function EventCard({ event, age, onChoice, disabled }: EventCardProps) {
  const { t } = useI18n();

  const getEffectText = (effects: Record<string, number>) => {
    return Object.entries(effects)
      .map(([key, value]) => {
        const translatedKey = t.attributes[key as keyof typeof t.attributes] || key;
        const sign = value > 0 ? '+' : '';
        return `${translatedKey}${sign}${value}`;
      })
      .join('、');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl md:text-2xl mb-2">{event.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {age}{t.game.years}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base md:text-lg leading-relaxed text-foreground/90">
            {event.description}
          </p>

          <div className="space-y-3 pt-2">
            <p className="text-sm font-semibold text-muted-foreground">{t.game.yourChoice}</p>
            {event.choices.map((choice: Choice, index: number) => (
              <Button
                key={index}
                onClick={() => onChoice(index)}
                disabled={disabled}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-accent hover:border-primary transition-all"
              >
                <div className="flex flex-col items-start gap-1 w-full">
                  <span className="font-medium text-foreground">{choice.text}</span>
                  <span className="text-xs text-muted-foreground">
                    {getEffectText(choice.effects)}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
