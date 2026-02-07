import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { PlayerAttributes } from '@/types/game';

interface AttributePanelProps {
  attributes: PlayerAttributes;
  age: number;
  stage: string;
}

export default function AttributePanel({ attributes, age, stage }: AttributePanelProps) {
  const baseAttributes = ['学识', '技艺', '财富', '声望', '健康'];
  const specialAttributes = Object.keys(attributes).filter(key => !baseAttributes.includes(key));

  const getAttributeColor = (value: number) => {
    if (value >= 70) return 'bg-chart-2';
    if (value >= 40) return 'bg-chart-4';
    return 'bg-chart-3';
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-foreground">人物属性</h3>
            <p className="text-sm text-muted-foreground">年龄：{age}岁</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-primary">{stage}</span>
          </div>
        </div>

        <div className="space-y-3">
          {baseAttributes.map(attr => (
            <div key={attr} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{attr}</span>
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
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">特殊属性</h4>
              {specialAttributes.map(attr => (
                <div key={attr} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{attr}</span>
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
