import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileText, Calendar, Trophy, Trash2 } from 'lucide-react';
import { getUserCreations, getUserCreationStats, deleteCreation } from '@/db/api';
import { getCurrentUser } from '@/utils/user';
import { useI18n } from '@/contexts/I18nContext';
import { useToast } from '@/hooks/use-toast';
import type { CultureTemplate, Event, Ending, UserCreationStats } from '@/types/game';

export default function MyCreationsPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();
  const user = getCurrentUser();

  const [loading, setLoading] = useState(true);
  const [cultures, setCultures] = useState<CultureTemplate[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [endings, setEndings] = useState<Ending[]>([]);
  const [stats, setStats] = useState<UserCreationStats | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadCreations();
  }, [user, navigate]);

  const loadCreations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [creations, userStats] = await Promise.all([
        getUserCreations(user.id),
        getUserCreationStats(user.id)
      ]);

      setCultures(creations.cultures);
      setEvents(creations.events);
      setEndings(creations.endings);
      setStats(userStats);
    } catch (error) {
      console.error('加载创作失败:', error);
      toast({
        title: t.error.loadFailed,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'culture' | 'event' | 'ending', id: string) => {
    if (!confirm('确定要删除这个创作吗？')) return;

    try {
      await deleteCreation(type, id);
      toast({ title: t.create.deleteSuccess });
      loadCreations();
    } catch (error) {
      console.error('删除失败:', error);
      toast({
        title: t.create.deleteFailed,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      pending: { variant: 'secondary', label: t.create.pendingReview },
      approved: { variant: 'default', label: t.create.approved },
      rejected: { variant: 'destructive', label: t.create.rejected }
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/create')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.common.back}
            </Button>
            <h1 className="text-xl font-bold">{t.create.myCreations}</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.create.totalCreations}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{stats.total_creations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.create.approvedCount}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-chart-2">{stats.approved_creations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.create.pendingCount}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-chart-4">{stats.pending_creations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.create.rejectedCount}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">{stats.rejected_creations}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="cultures" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="cultures">
              <FileText className="w-4 h-4 mr-2" />
              文化 ({cultures.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="w-4 h-4 mr-2" />
              事件 ({events.length})
            </TabsTrigger>
            <TabsTrigger value="endings">
              <Trophy className="w-4 h-4 mr-2" />
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
                <p className="text-muted-foreground">{t.common.noData}</p>
              </div>
            ) : (
              cultures.map(culture => (
                <Card key={culture.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{culture.name}</CardTitle>
                        <CardDescription>{culture.era} · {culture.region}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(culture.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete('culture', culture.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{culture.description}</p>
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
                <p className="text-muted-foreground">{t.common.noData}</p>
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
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(event.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete('event', event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
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
                <p className="text-muted-foreground">{t.common.noData}</p>
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
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ending.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete('ending', ending.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{ending.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
