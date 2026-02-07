import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface EndingData {
  title: string;
  description: string;
  achievement_level: 'legendary' | 'excellent' | 'good' | 'ordinary' | 'poor';
  conditions: Record<string, number>;
}

interface EndingEditorProps {
  ending: EndingData;
  index: number;
  attributes: string[]; // 可用的属性名称列表
  onUpdate: (index: number, field: keyof EndingData, value: any) => void;
  onRemove: (index: number) => void;
}

export default function EndingEditor({
  ending,
  index,
  attributes,
  onUpdate,
  onRemove
}: EndingEditorProps) {
  
  // 更新触发条件
  const updateCondition = (attrName: string, value: string) => {
    const conditions = { ...ending.conditions };
    const numValue = parseInt(value) || 0;
    
    if (numValue === 0) {
      delete conditions[attrName];
    } else {
      conditions[attrName] = numValue;
    }
    
    onUpdate(index, 'conditions', conditions);
  };

  const achievementLevels = [
    { value: 'legendary', label: '传奇', color: 'text-chart-1' },
    { value: 'excellent', label: '卓越', color: 'text-chart-2' },
    { value: 'good', label: '良好', color: 'text-chart-3' },
    { value: 'ordinary', label: '普通', color: 'text-muted-foreground' },
    { value: 'poor', label: '困顿', color: 'text-destructive' }
  ];

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">结局 {index + 1}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 结局标题 */}
        <div className="space-y-2">
          <Label>结局标题 *</Label>
          <Input
            value={ending.title}
            onChange={(e) => onUpdate(index, 'title', e.target.value)}
            placeholder="例如：诗仙传世"
          />
        </div>

        {/* 结局描述 */}
        <div className="space-y-2">
          <Label>结局描述 *</Label>
          <Textarea
            value={ending.description}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            placeholder="描述这个结局的情景..."
            rows={3}
          />
        </div>

        {/* 成就等级 */}
        <div className="space-y-2">
          <Label>成就等级 *</Label>
          <Select
            value={ending.achievement_level}
            onValueChange={(value) => onUpdate(index, 'achievement_level', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {achievementLevels.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  <span className={level.color}>{level.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 触发条件 */}
        <div className="space-y-2">
          <Label>触发条件 * (至少设置一个)</Label>
          <p className="text-xs text-muted-foreground">
            设置属性的最低要求，满足所有条件才能触发此结局
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['学识', '技艺', '财富', '声望', '健康', ...attributes].map(attr => (
              <div key={attr} className="flex items-center gap-2">
                <Label className="text-xs whitespace-nowrap">{attr}≥</Label>
                <Input
                  type="number"
                  value={ending.conditions[attr] || ''}
                  onChange={(e) => updateCondition(attr, e.target.value)}
                  placeholder="0"
                  className="h-8"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
