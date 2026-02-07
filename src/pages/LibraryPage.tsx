import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCultureTemplates, getGameStats } from '@/db/api';
import type { CultureTemplate, GameSession } from '@/types/game';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, TrendingUp, Users, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function LibraryPage() {
  const navigate = useNavigate();
  const [cultures, setCultures] = useState<CultureTemplate[]>([]);
  const [stats, setStats] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [culturesData, statsData] = await Promise.all([
        getCultureTemplates(),
        getGameStats()
      ]);
      setCultures(culturesData);
      setStats(statsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCultureStats = (cultureId: string) => {
    const cultureSessions = stats.filter(s => s.culture_id === cultureId);
    return {
      playCount: cultureSessions.length,
      avgPlayTime: cultureSessions.length > 0
        ? Math.round(cultureSessions.reduce((sum, s) => sum + s.play_time, 0) / cultureSessions.length)
        : 0
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <h1 className="text-xl md:text-2xl font-bold gradient-text">
              内容库
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cultures" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="cultures">
              <BookOpen className="w-4 h-4 mr-2" />
              文化模板
            </TabsTrigger>
            <TabsTrigger value="stats">
              <TrendingUp className="w-4 h-4 mr-2" />
              统计数据
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cultures" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-foreground">可用文化模板</h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <Skeleton key={i} className="h-48 w-full bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cultures.map((culture, index) => {
                    const cultureStats = getCultureStats(culture.id);
                    return (
                      <motion.div
                        key={culture.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-all">
                          <CardHeader>
                            <CardTitle>{culture.name}</CardTitle>
                            <CardDescription>
                              {culture.era} · {culture.region}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-foreground/80 mb-4">
                              {culture.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{cultureStats.playCount} 次游玩</span>
                              </div>
                              {cultureStats.avgPlayTime > 0 && (
                                <div>
                                  <span>平均 {cultureStats.avgPlayTime} 个事件</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-foreground">游戏统计</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      总游玩次数
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{stats.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      文化模板数
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{cultures.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      平均游戏时长
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      {stats.length > 0
                        ? Math.round(stats.reduce((sum, s) => sum + s.play_time, 0) / stats.length)
                        : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">个事件</p>
                  </CardContent>
                </Card>
              </div>

              {stats.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">暂无游戏记录</p>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>最近游戏记录</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.slice(0, 10).map((session, index) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              游戏 #{index + 1}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(session.created_at).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">
                              {session.play_time} 个事件
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
