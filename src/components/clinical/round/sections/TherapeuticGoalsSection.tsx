
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Target } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface TherapeuticGoalsSectionProps {
  formData: RoundFormData;
  updateFormData: (field: string, value: any) => void;
}

export const TherapeuticGoalsSection: React.FC<TherapeuticGoalsSectionProps> = ({
  formData,
  updateFormData
}) => {
  const goalItems = [
    { key: 'adequate_glycemic_control', label: 'Controle glicêmico adequado', obsKey: 'adequate_glycemic_control_obs' },
    { key: 'adequate_sedation_level', label: 'Nível de sedação adequado', obsKey: 'adequate_sedation_level_obs' },
    { key: 'sedation_can_be_reduced', label: 'Sedação pode ser reduzida', obsKey: 'sedation_can_be_reduced_obs' },
  ];

  return (
    <Card>
      <CardHeader className="bg-teal-50">
        <CardTitle className="flex items-center gap-2 text-teal-900">
          <Target size={20} />
          Seção 5 - Metas Terapêuticas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {goalItems.map((item) => (
            <div key={item.key} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={item.key}
                  checked={formData[item.key] as boolean}
                  onCheckedChange={(checked) => updateFormData(item.key, checked)}
                />
                <Label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                  {item.label}
                </Label>
              </div>
              
              <Textarea
                value={formData[item.obsKey] as string}
                onChange={(e) => updateFormData(item.obsKey, e.target.value)}
                placeholder={`Observações sobre ${item.label.toLowerCase()}`}
                rows={2}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
