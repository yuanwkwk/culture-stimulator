import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Calendar, Trophy } from 'lucide-react';
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

  const creationTypes = [
    {
      title: t.create.cultureTitle,
      description: '创作一个全新的文化背景，定义时代、地区和特殊属性',
      icon: FileText,
      path: '/create/culture',
      color: 'text-chart-1'
    },
    {
      title: t.create.eventTitle,
      description: '为现有文化创作人生事件，设计选择和属性影响',
      icon: Calendar,
      path: '/create/event',
      color: 'text-chart-2'
    },
    {
      title: t.create.endingTitle,
      description: '创作人生结局，定义触发条件和成就等级',
      icon: Trophy,
      path: '/create/ending',
      color: 'text-chart-3'
    }
  ];

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

      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">
            {t.create.subtitle}
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.create.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {creationTypes.map((type, index) => (
            <motion.div
              key={type.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all border-border hover:border-primary h-full"
                onClick={() => navigate(type.path)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-lg bg-muted ${type.color}`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {t.create.submit}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 快捷链接 */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/my-creations')}
          >
            {t.create.myCreations}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/community')}
          >
            {t.create.communityCreations}
          </Button>
        </div>
      </main>
    </div>
  );
}
