import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

interface Choice {
  text: string;
  effects: Record<string, number>;
}

interface EventData {
  title: string;
  description: string;
  stage: 'childhood' | 'youth' | 'adult' | 'elder';
  choices: Choice[];
  requirements: Record<string, number>;
}

interface EventEditorProps {
  event: EventData;
  index: number;
  attributes: string[]; // 可用的属性名称列表
  onUpdate: (index: number, field: keyof EventData, value: any) => void;
  onRemove: (index: number) => void;
  onAddChoice: (index: number) => void;
  onRemoveChoice: (eventIndex: number, choiceIndex: number) => void;
  onUpdateChoice: (eventIndex: number, choiceIndex: number, field: 'text' | 'effects', value: any) => void;
}

export default function EventEditor({
  event,
  index,
  attributes,
  onUpdate,
  onRemove,
  onAddChoice,
  onRemoveChoice,
  onUpdateChoice
}: EventEditorProps) {
  
  // 更新选择项的属性影响
  const updateChoiceEffect = (choiceIndex: number, attrName: string, value: string) => {
    const effects = { ...event.choices[choiceIndex].effects };
    const numValue = parseInt(value) || 0;
    
    if (numValue === 0) {
      delete effects[attrName];
    } else {
      effects[attrName] = numValue;
    }
    
    onUpdateChoice(index, choiceIndex, 'effects', effects);
  };

  // 更新触发条件
  const updateRequirement = (attrName: string, value: string) => {
    const requirements = { ...event.requirements };
    const numValue = parseInt(value) || 0;
    
    if (numValue === 0) {
      delete requirements[attrName];
    } else {
      requirements[attrName] = numValue;
    }
    
    onUpdate(index, 'requirements', requirements);
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">事件 {index + 1}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 事件标题 */}
        <div className="space-y-2">
          <Label>事件标题 *</Label>
          <Input
            value={event.title}
            onChange={(e) => onUpdate(index, 'title', e.target.value)}
            placeholder="例如：科举考试"
          />
        </div>

        {/* 事件描述 */}
        <div className="space-y-2">
          <Label>事件描述 *</Label>
          <Textarea
            value={event.description}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            placeholder="描述这个事件的情景..."
            rows={3}
          />
        </div>

        {/* 触发条件 */}
        <div className="space-y-2">
          <Label>触发条件（可选）</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['学识', '技艺', '财富', '声望', '健康', ...attributes].map(attr => (
              <div key={attr} className="flex items-center gap-2">
                <Label className="text-xs whitespace-nowrap">{attr}≥</Label>
                <Input
                  type="number"
                  value={event.requirements[attr] || ''}
                  onChange={(e) => updateRequirement(attr, e.target.value)}
                  placeholder="0"
                  className="h-8"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 选择项列表 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>选择项 * (至少2个)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddChoice(index)}
            >
              <Plus className="w-4 h-4 mr-2" />
              添加选择
            </Button>
          </div>

          {event.choices.map((choice, choiceIndex) => (
            <Card key={choiceIndex} className="p-3 bg-muted/30">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">选择 {choiceIndex + 1}</span>
                  {event.choices.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveChoice(index, choiceIndex)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {/* 选择文本 */}
                <Input
                  value={choice.text}
                  onChange={(e) => onUpdateChoice(index, choiceIndex, 'text', e.target.value)}
                  placeholder="选择的文本描述"
                />

                {/* 属性影响 */}
                <div>
                  <Label className="text-xs text-muted-foreground">属性影响</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {['学识', '技艺', '财富', '声望', '健康', ...attributes].map(attr => (
                      <div key={attr} className="flex items-center gap-1">
                        <Label className="text-xs whitespace-nowrap">{attr}</Label>
                        <Input
                          type="number"
                          value={choice.effects[attr] || ''}
                          onChange={(e) => updateChoiceEffect(choiceIndex, attr, e.target.value)}
                          placeholder="±0"
                          className="h-7 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
