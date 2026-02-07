import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CultureTemplate } from '@/types/game';
import { motion } from 'motion/react';
import { useI18n } from '@/contexts/I18nContext';

interface CultureCardProps {
  culture: CultureTemplate;
  onClick: () => void;
}

export default function CultureCard({ culture, onClick }: CultureCardProps) {
  const { t } = useI18n();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all border-border hover:border-primary bg-card"
        onClick={onClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl md:text-2xl">{culture.name}</CardTitle>
            {culture.is_official && (
              <Badge variant="secondary" className="ml-2">{t.home.official}</Badge>
            )}
          </div>
          <CardDescription className="text-sm">
            {culture.era} · {culture.region}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-3">
            {culture.description}
          </p>
          {culture.special_attributes && culture.special_attributes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {culture.special_attributes.map((attr, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {t.attributes[attr.name as keyof typeof t.attributes] || attr.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
