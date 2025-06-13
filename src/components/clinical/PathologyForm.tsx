
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { useCreatePathology } from '@/hooks/usePathologies';

interface PathologyFormProps {
  onSuccess: () => void;
}

const PathologyForm = ({ onSuccess }: PathologyFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basicInfo: '',
    curiosity: '',
    therapeutic: '',
    iconName: 'Heart'
  });

  const createPathology = useCreatePathology();

  const iconOptions = [
    { value: 'Heart', label: '❤️ Coração' },
    { value: 'Activity', label: '📊 Atividade' },
    { value: 'Zap', label: '⚡ Energia' },
    { value: 'Brain', label: '🧠 Cérebro' },
    { value: 'Eye', label: '👁️ Olho' },
    { value: 'Lungs', label: '🫁 Pulmões' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createPathology.mutateAsync(formData);
      setFormData({
        name: '',
        description: '',
        basicInfo: '',
        curiosity: '',
        therapeutic: '',
        iconName: 'Heart'
      });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar patologia:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full border-dashed border-2 border-heal-green-300 text-heal-green-700 hover:bg-heal-green-50"
      >
        <Plus size={16} className="mr-2" />
        Adicionar Nova Patologia
      </Button>
    );
  }

  return (
    <Card className="border-heal-green-200">
      <CardHeader>
        <CardTitle className="text-heal-green-800">Nova Patologia</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Patologia</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Hipertensão Arterial"
                required
              />
            </div>
            <div>
              <Label htmlFor="iconName">Ícone</Label>
              <Select value={formData.iconName} onValueChange={(value) => handleInputChange('iconName', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descrição Breve</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição resumida da patologia"
              required
            />
          </div>

          <div>
            <Label htmlFor="basicInfo">Informações Básicas</Label>
            <Textarea
              id="basicInfo"
              value={formData.basicInfo}
              onChange={(e) => handleInputChange('basicInfo', e.target.value)}
              placeholder="Explicação detalhada sobre a patologia..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="curiosity">Curiosidade</Label>
            <Textarea
              id="curiosity"
              value={formData.curiosity}
              onChange={(e) => handleInputChange('curiosity', e.target.value)}
              placeholder="💡 Curiosidade: Informação interessante sobre a patologia..."
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="therapeutic">Importância Terapêutica</Label>
            <Textarea
              id="therapeutic"
              value={formData.therapeutic}
              onChange={(e) => handleInputChange('therapeutic', e.target.value)}
              placeholder="Explicação sobre a importância do tratamento..."
              rows={3}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="bg-heal-green-600 hover:bg-heal-green-700"
              disabled={createPathology.isPending}
            >
              <Save size={16} className="mr-2" />
              {createPathology.isPending ? 'Salvando...' : 'Salvar Patologia'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PathologyForm;
