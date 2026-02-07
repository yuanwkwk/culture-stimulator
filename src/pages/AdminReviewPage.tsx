import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Check, X, Eye } from 'lucide-react';
import { getPendingCreations, reviewContent } from '@/db/api';
import { getCurrentUser, isAdmin } from '@/utils/user';
import { useI18n } from '@/contexts/I18nContext';
import { useToast } from '@/hooks/use-toast';
import type { CultureTemplate, Event, Ending } from '@/types/game';

export default function AdminReviewPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();
  const user = getCurrentUser();

  const [loading, setLoading] = useState(true);
  const [cultures, setCultures] = useState<CultureTemplate[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [endings, setEndings] = useState<Ending[]>([]);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'culture' | 'event' | 'ending' | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/');
      return;
    }
    loadPendingCreations();
  }, [user, navigate]);

  const loadPendingCreations = async () => {
    setLoading(true);
    try {
      const data = await getPendingCreations();
      setCultures(data.cultures);
      setEvents(data.events);
      setEndings(data.endings);
    } catch (error) {
      console.error('加载待审核内容失败:', error);
      toast({
        title: t.error.loadFailed,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (
    type: 'culture' | 'event' | 'ending',
    id: string,
    status: 'approved' | 'rejected'
  ) => {
    try {
      await reviewContent(type, id, status);
      toast({
        title: status === 'approved' ? '已批准' : '已拒绝'
      });
      loadPendingCreations();
      setShowDetail(false);
    } catch (error) {
      console.error('审核失败:', error);
      toast({
        title: t.create.reviewFailed,
        variant: 'destructive'
      });
    }
  };

  const viewDetail = (item: any, type: 'culture' | 'event' | 'ending') => {
    setSelectedItem(item);
    setSelectedType(type);
    setShowDetail(true);
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.common.back}
            </Button>
            <h1 className="text-xl font-bold">内容审核</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                待审核文化模板
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{cultures.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                待审核事件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-chart-2">{events.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                待审核结局
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-chart-3">{endings.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cultures" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="cultures">
              文化 ({cultures.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              事件 ({events.length})
            </TabsTrigger>
            <TabsTrigger value="endings">
              结局 ({endings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cultures" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full bg-muted" />)}
              </div>
            ) : cultures.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">暂无待审核的文化模板</p>
              </div>
            ) : (
              cultures.map(culture => (
                <Card key={culture.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{culture.name}</CardTitle>
                        <CardDescription>{culture.era} · {culture.region}</CardDescription>
                        <p className="text-sm text-muted-foreground mt-2">
                          创作者: {culture.creator_id}
                        </p>
                      </div>
                      <Badge variant="secondary">待审核</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{culture.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewDetail(culture, 'culture')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleReview('culture', culture.id, 'approved')}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        批准
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReview('culture', culture.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-2" />
                        拒绝
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full bg-muted" />)}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">暂无待审核的事件</p>
              </div>
            ) : (
              events.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          {(event as any).culture?.name} · {t.stages[event.stage]}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-2">
                          创作者: {event.creator_id}
                        </p>
                      </div>
                      <Badge variant="secondary">待审核</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewDetail(event, 'event')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleReview('event', event.id, 'approved')}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        批准
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReview('event', event.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-2" />
                        拒绝
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="endings" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full bg-muted" />)}
              </div>
            ) : endings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">暂无待审核的结局</p>
              </div>
            ) : (
              endings.map(ending => (
                <Card key={ending.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{ending.title}</CardTitle>
                        <CardDescription>
                          {(ending as any).culture?.name} · {t.achievement[ending.achievement_level]}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-2">
                          创作者: {ending.creator_id}
                        </p>
                      </div>
                      <Badge variant="secondary">待审核</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{ending.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewDetail(ending, 'ending')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleReview('ending', ending.id, 'approved')}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        批准
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReview('ending', ending.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-2" />
                        拒绝
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* 详情对话框 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title || selectedItem?.name}</DialogTitle>
            <DialogDescription>
              创作者: {selectedItem?.creator_id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedType === 'culture' && selectedItem && (
              <>
                <div>
                  <h4 className="font-medium mb-2">基本信息</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                  <p className="text-sm mt-2">时代: {selectedItem.era}</p>
                  <p className="text-sm">地区: {selectedItem.region}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">特殊属性</h4>
                  {selectedItem.special_attributes?.map((attr: any, idx: number) => (
                    <p key={idx} className="text-sm">
                      {attr.name}: {attr.description} (初始值: {attr.initial})
                    </p>
                  ))}
                </div>
              </>
            )}
            {selectedType === 'event' && selectedItem && (
              <>
                <div>
                  <h4 className="font-medium mb-2">事件描述</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">选择项</h4>
                  {selectedItem.choices?.map((choice: any, idx: number) => (
                    <p key={idx} className="text-sm">
                      {idx + 1}. {choice.text}
                    </p>
                  ))}
                </div>
              </>
            )}
            {selectedType === 'ending' && selectedItem && (
              <>
                <div>
                  <h4 className="font-medium mb-2">结局描述</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">成就等级</h4>
                  <p className="text-sm">{t.achievement[selectedItem.achievement_level]}</p>
                </div>
              </>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => selectedType && handleReview(selectedType, selectedItem.id, 'approved')}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                批准
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedType && handleReview(selectedType, selectedItem.id, 'rejected')}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                拒绝
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
