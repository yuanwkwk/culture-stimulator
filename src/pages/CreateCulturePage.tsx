import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, X, Eye } from 'lucide-react';
import { createCultureTemplate, createEvent, createEnding } from '@/db/api';
import { getCurrentUser } from '@/utils/user';
import { useI18n } from '@/contexts/I18nContext';
import { useToast } from '@/hooks/use-toast';

interface SpecialAttribute {
  name: string;
  description: string;
  initial: number;
}

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

interface EndingData {
  title: string;
  description: string;
  achievement_level: 'legendary' | 'excellent' | 'good' | 'ordinary' | 'poor';
  conditions: Record<string, number>;
}

export default function CreateCulturePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();
  const user = getCurrentUser();

  // 基本信息
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [era, setEra] = useState('');
  const [region, setRegion] = useState('');
  const [specialAttributes, setSpecialAttributes] = useState<SpecialAttribute[]>([
    { name: '', description: '', initial: 30 }
  ]);

  // 事件列表（按阶段分类）
  const [events, setEvents] = useState<EventData[]>([]);
  const [currentStage, setCurrentStage] = useState<'childhood' | 'youth' | 'adult' | 'elder'>('childhood');

  // 结局列表
  const [endings, setEndings] = useState<EndingData[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // 特殊属性操作
  const addAttribute = () => {
    setSpecialAttributes([...specialAttributes, { name: '', description: '', initial: 30 }]);
  };

  const removeAttribute = (index: number) => {
    setSpecialAttributes(specialAttributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: keyof SpecialAttribute, value: string | number) => {
    const updated = [...specialAttributes];
    updated[index] = { ...updated[index], [field]: value };
    setSpecialAttributes(updated);
  };

  // 事件操作
  const addEvent = () => {
    setEvents([...events, {
      title: '',
      description: '',
      stage: currentStage,
      choices: [
        { text: '', effects: {} },
        { text: '', effects: {} }
      ],
      requirements: {}
    }]);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: keyof EventData, value: any) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    setEvents(updated);
  };

  const addChoice = (eventIndex: number) => {
    const updated = [...events];
    updated[eventIndex].choices.push({ text: '', effects: {} });
    setEvents(updated);
  };

  const removeChoice = (eventIndex: number, choiceIndex: number) => {
    const updated = [...events];
    updated[eventIndex].choices = updated[eventIndex].choices.filter((_, i) => i !== choiceIndex);
    setEvents(updated);
  };

  const updateChoice = (eventIndex: number, choiceIndex: number, field: 'text' | 'effects', value: any) => {
    const updated = [...events];
    updated[eventIndex].choices[choiceIndex] = {
      ...updated[eventIndex].choices[choiceIndex],
      [field]: value
    };
    setEvents(updated);
  };

  // 结局操作
  const addEnding = () => {
    setEndings([...endings, {
      title: '',
      description: '',
      achievement_level: 'good',
      conditions: {}
    }]);
  };

  const removeEnding = (index: number) => {
    setEndings(endings.filter((_, i) => i !== index));
  };

  const updateEnding = (index: number, field: keyof EndingData, value: any) => {
    const updated = [...endings];
    updated[index] = { ...updated[index], [field]: value };
    setEndings(updated);
  };

  // 表单验证
  const validateForm = (): string | null => {
    if (!name || !description || !era || !region) {
      return '请填写所有基本信息';
    }

    const validAttributes = specialAttributes.filter(attr => attr.name && attr.description);
    if (validAttributes.length === 0) {
      return '请至少添加一个特殊属性';
    }

    if (events.length < 4) {
      return '请至少为每个人生阶段添加一个事件（共4个）';
    }

    const stageCount = {
      childhood: events.filter(e => e.stage === 'childhood').length,
      youth: events.filter(e => e.stage === 'youth').length,
      adult: events.filter(e => e.stage === 'adult').length,
      elder: events.filter(e => e.stage === 'elder').length
    };

    if (stageCount.childhood === 0 || stageCount.youth === 0 || stageCount.adult === 0 || stageCount.elder === 0) {
      return '每个人生阶段至少需要一个事件';
    }

    for (const event of events) {
      if (!event.title || !event.description) {
        return '所有事件必须填写标题和描述';
      }
      if (event.choices.length < 2) {
        return '每个事件至少需要2个选择项';
      }
      for (const choice of event.choices) {
        if (!choice.text) {
          return '所有选择项必须填写文本';
        }
      }
    }

    if (endings.length < 3) {
      return '请至少添加3个结局';
    }

    for (const ending of endings) {
      if (!ending.title || !ending.description) {
        return '所有结局必须填写标题和描述';
      }
    }

    return null;
  };

  // 提交创作
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: t.error.loginRequired,
        variant: 'destructive'
      });
      return;
    }

    const error = validateForm();
    if (error) {
      toast({
        title: error,
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      // 1. 创建文化模板
      const validAttributes = specialAttributes.filter(attr => attr.name && attr.description);
      const culture = await createCultureTemplate({
        name,
        description,
        era,
        region,
        special_attributes: validAttributes,
        creator_id: user.id,
        is_official: false,
        status: 'pending'
      });

      // 2. 批量创建事件
      await Promise.all(
        events.map(event => 
          createEvent({
            culture_id: culture.id,
            title: event.title,
            description: event.description,
            stage: event.stage,
            choices: event.choices,
            requirements: event.requirements,
            creator_id: user.id,
            is_official: false,
            status: 'pending'
          })
        )
      );

      // 3. 批量创建结局
      await Promise.all(
        endings.map(ending =>
          createEnding({
            culture_id: culture.id,
            title: ending.title,
            description: ending.description,
            conditions: ending.conditions,
            achievement_level: ending.achievement_level,
            creator_id: user.id,
            is_official: false,
            status: 'pending'
          })
        )
      );

      toast({
        title: t.create.createSuccess
      });

      navigate('/my-creations');
    } catch (error) {
      console.error('创作提交失败:', error);
      toast({
        title: t.create.createFailed,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 获取当前阶段的事件
  const getEventsByStage = (stage: string) => {
    return events.filter(e => e.stage === stage);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/create')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.common.back}
            </Button>
            <h1 className="text-xl font-bold">{t.create.createCulture}</h1>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? '编辑' : '预览'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {showPreview ? (
          // 预览模式
          <Card>
            <CardHeader>
              <CardTitle>创作预览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">基本信息</h3>
                <p><strong>名称：</strong>{name || '未填写'}</p>
                <p><strong>描述：</strong>{description || '未填写'}</p>
                <p><strong>时代：</strong>{era || '未填写'}</p>
                <p><strong>地区：</strong>{region || '未填写'}</p>
                <p><strong>特殊属性：</strong>{specialAttributes.filter(a => a.name).length}个</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">事件统计</h3>
                <p>童年期：{getEventsByStage('childhood').length}个</p>
                <p>青少年期：{getEventsByStage('youth').length}个</p>
                <p>成年期：{getEventsByStage('adult').length}个</p>
                <p>晚年期：{getEventsByStage('elder').length}个</p>
                <p><strong>总计：</strong>{events.length}个事件</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">结局统计</h3>
                <p><strong>总计：</strong>{endings.length}个结局</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 编辑模式
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="events">人生事件 ({events.length})</TabsTrigger>
              <TabsTrigger value="endings">人生结局 ({endings.length})</TabsTrigger>
            </TabsList>

            {/* 基本信息标签页 */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>文化基本信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.create.cultureName} *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="例如：宋代商人"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t.create.cultureDescription} *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="描述这个文化背景的特点..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="era">{t.create.era} *</Label>
                      <Input
                        id="era"
                        value={era}
                        onChange={(e) => setEra(e.target.value)}
                        placeholder="例如：宋代（960-1279年）"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">{t.create.region} *</Label>
                      <Input
                        id="region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        placeholder="例如：中国"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{t.create.specialAttributes} *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                        <Plus className="w-4 h-4 mr-2" />
                        {t.create.addAttribute}
                      </Button>
                    </div>

                    {specialAttributes.map((attr, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">属性 {index + 1}</span>
                            {specialAttributes.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttribute(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Input
                              placeholder={t.create.attributeName}
                              value={attr.name}
                              onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                            />
                            <Input
                              placeholder={t.create.attributeDescription}
                              value={attr.description}
                              onChange={(e) => updateAttribute(index, 'description', e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder={t.create.initialValue}
                              value={attr.initial}
                              onChange={(e) => updateAttribute(index, 'initial', parseInt(e.target.value) || 0)}
                              min={0}
                              max={100}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 人生事件标签页 */}
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>人生事件创作</CardTitle>
                    <Select value={currentStage} onValueChange={(value: any) => setCurrentStage(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="childhood">童年期</SelectItem>
                        <SelectItem value="youth">青少年期</SelectItem>
                        <SelectItem value="adult">成年期</SelectItem>
                        <SelectItem value="elder">晚年期</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    为当前阶段添加事件。每个阶段至少需要1个事件，建议3-5个。
                  </p>
                  <Button onClick={addEvent} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    为{currentStage === 'childhood' ? '童年期' : currentStage === 'youth' ? '青少年期' : currentStage === 'adult' ? '成年期' : '晚年期'}添加事件
                  </Button>
                </CardContent>
              </Card>

              {/* 显示当前阶段的事件 */}
              <div className="space-y-4">
                {getEventsByStage(currentStage).map((event, idx) => {
                  const globalIndex = events.findIndex(e => e === event);
                  return (
                    <Card key={globalIndex} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">事件 {idx + 1}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeEvent(globalIndex)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>事件标题 *</Label>
                          <Input
                            value={event.title}
                            onChange={(e) => updateEvent(globalIndex, 'title', e.target.value)}
                            placeholder="例如：科举考试"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>事件描述 *</Label>
                          <Textarea
                            value={event.description}
                            onChange={(e) => updateEvent(globalIndex, 'description', e.target.value)}
                            placeholder="描述这个事件..."
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>选择项 (至少2个)</Label>
                            <Button size="sm" variant="outline" onClick={() => addChoice(globalIndex)}>
                              <Plus className="w-3 h-3 mr-1" />
                              添加选择
                            </Button>
                          </div>
                          {event.choices.map((choice, choiceIdx) => (
                            <Card key={choiceIdx} className="p-3 bg-muted/30">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">选择 {choiceIdx + 1}</span>
                                  {event.choices.length > 2 && (
                                    <Button size="sm" variant="ghost" onClick={() => removeChoice(globalIndex, choiceIdx)}>
                                      <X className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                                <Input
                                  value={choice.text}
                                  onChange={(e) => updateChoice(globalIndex, choiceIdx, 'text', e.target.value)}
                                  placeholder="选择的文本"
                                />
                                <p className="text-xs text-muted-foreground">
                                  属性影响：在提交前可以在代码中设置
                                </p>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {getEventsByStage(currentStage).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  当前阶段还没有事件，点击上方按钮添加
                </div>
              )}
            </TabsContent>

            {/* 人生结局标签页 */}
            <TabsContent value="endings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>人生结局创作</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    创作不同的人生结局。至少需要3个结局，建议5-8个，涵盖不同的成就等级。
                  </p>
                  <Button onClick={addEnding} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    添加结局
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {endings.map((ending, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">结局 {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeEnding(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>结局标题 *</Label>
                        <Input
                          value={ending.title}
                          onChange={(e) => updateEnding(index, 'title', e.target.value)}
                          placeholder="例如：诗仙传世"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>结局描述 *</Label>
                        <Textarea
                          value={ending.description}
                          onChange={(e) => updateEnding(index, 'description', e.target.value)}
                          placeholder="描述这个结局..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>成就等级 *</Label>
                        <Select
                          value={ending.achievement_level}
                          onValueChange={(value) => updateEnding(index, 'achievement_level', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="legendary">传奇</SelectItem>
                            <SelectItem value="excellent">卓越</SelectItem>
                            <SelectItem value="good">良好</SelectItem>
                            <SelectItem value="ordinary">普通</SelectItem>
                            <SelectItem value="poor">困顿</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        触发条件：在提交前可以在代码中设置
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {endings.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  还没有结局，点击上方按钮添加
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* 底部操作按钮 */}
        <div className="flex gap-4 mt-8">
          <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
            {submitting ? '提交中...' : t.create.submit}
          </Button>
          <Button variant="outline" onClick={() => navigate('/create')}>
            {t.create.cancel}
          </Button>
        </div>
      </main>
    </div>
  );
}
