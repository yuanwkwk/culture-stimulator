import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { PlayerAttributes } from '@/types/game';
import { useI18n } from '@/contexts/I18nContext';

interface AttributePanelProps {
  attributes: PlayerAttributes;
  age: number;
  stage: string;
}

export default function AttributePanel({ attributes, age, stage }: AttributePanelProps) {
  const { t } = useI18n();
  const baseAttributes = ['学识', '技艺', '财富', '声望', '健康'];
  const specialAttributes = Object.keys(attributes).filter(key => !baseAttributes.includes(key));

  const getAttributeColor = (value: number) => {
    if (value >= 70) return 'bg-chart-2';
    if (value >= 40) return 'bg-chart-4';
    return 'bg-chart-3';
  };

  const translateAttribute = (attr: string) => {
    return t.attributes[attr as keyof typeof t.attributes] || attr;
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-foreground">{t.game.attributes}</h3>
            <p className="text-sm text-muted-foreground">
              {t.game.age}：{age}{t.game.years}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-primary">{stage}</span>
          </div>
        </div>

        <div className="space-y-3">
          {baseAttributes.map(attr => (
            <div key={attr} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  {translateAttribute(attr)}
                </span>
                <span className="text-sm font-bold text-primary">{attributes[attr] || 0}</span>
              </div>
              <Progress 
                value={attributes[attr] || 0} 
                className="h-2"
                indicatorClassName={getAttributeColor(attributes[attr] || 0)}
              />
            </div>
          ))}

          {specialAttributes.length > 0 && (
            <>
              <div className="border-t border-border/50 my-4" />
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                {t.game.specialAttributes}
              </h4>
              {specialAttributes.map(attr => (
                <div key={attr} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">
                      {translateAttribute(attr)}
                    </span>
                    <span className="text-sm font-bold text-primary">{attributes[attr]}</span>
                  </div>
                  <Progress 
                    value={attributes[attr]} 
                    className="h-2"
                    indicatorClassName={getAttributeColor(attributes[attr])}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
