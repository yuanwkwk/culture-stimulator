import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { createCultureTemplate } from '@/db/api';
import { getCurrentUser } from '@/utils/user';
import { useI18n } from '@/contexts/I18nContext';
import { useToast } from '@/hooks/use-toast';

interface SpecialAttribute {
  name: string;
  description: string;
  initial: number;
}

export default function CreateCulturePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();
  const user = getCurrentUser();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [era, setEra] = useState('');
  const [region, setRegion] = useState('');
  const [specialAttributes, setSpecialAttributes] = useState<SpecialAttribute[]>([
    { name: '', description: '', initial: 30 }
  ]);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: t.error.loginRequired,
        variant: 'destructive'
      });
      return;
    }

    if (!name || !description || !era || !region) {
      toast({
        title: '请填写所有必填字段',
        variant: 'destructive'
      });
      return;
    }

    const validAttributes = specialAttributes.filter(attr => attr.name && attr.description);
    if (validAttributes.length === 0) {
      toast({
        title: '请至少添加一个特殊属性',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      await createCultureTemplate({
        name,
        description,
        era,
        region,
        special_attributes: validAttributes,
        creator_id: user.id,
        is_official: false,
        status: 'pending'
      });

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
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>{t.create.cultureTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t.create.cultureName} *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：唐代文人"
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
                  placeholder="例如：唐代（618-907年）"
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

            <div className="flex gap-4">
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? '提交中...' : t.create.submit}
              </Button>
              <Button variant="outline" onClick={() => navigate('/create')}>
                {t.create.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
