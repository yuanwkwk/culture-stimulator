import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Users, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '@/contexts/I18nContext';
import { isLoggedIn } from '@/utils/user';

export default function CreatePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{t.error.loginRequired}</CardTitle>
            <CardDescription>{t.user.loginPrompt}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              {t.common.back}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.common.back}
            </Button>
            <h1 className="text-xl md:text-2xl font-bold gradient-text">
              {t.create.title}
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            {t.create.description}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            创作完整的文化背景，包括基本信息、人生事件和结局，与社区分享你的创意
          </p>
        </motion.div>

        {/* 主创作卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-primary/10">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl md:text-2xl">{t.create.createCulture}</CardTitle>
                  <CardDescription className="mt-2">
                    一站式创作文化模板、人生事件和结局。定义文化背景、设计人生事件、创作多样化结局。
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-chart-1/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-chart-1 font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">基本信息</p>
                      <p className="text-muted-foreground text-xs">定义文化名称、时代、地区和特殊属性</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-chart-2 font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">人生事件</p>
                      <p className="text-muted-foreground text-xs">为每个人生阶段创作事件和选择</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-chart-3/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-chart-3 font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">人生结局</p>
                      <p className="text-muted-foreground text-xs">创作多样化的结局和成就等级</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/create/culture')} 
                  size="lg"
                  className="w-full"
                >
                  开始创作
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 快捷链接 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/my-creations')}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t.create.myCreations}
              </CardTitle>
              <CardDescription>
                查看和管理你的所有创作内容
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/library')}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                社区创作
              </CardTitle>
              <CardDescription>
                浏览其他创作者的优秀作品
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
