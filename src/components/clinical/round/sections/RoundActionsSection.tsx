
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, Pill, Stethoscope, Activity, UtensilsCrossed } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface RoundActionsSectionProps {
  formData: RoundFormData;
  updateFormData: (field: string, value: any) => void;
}

export const RoundActionsSection: React.FC<RoundActionsSectionProps> = ({
  formData,
  updateFormData
}) => {
  const actionItems = [
    { key: 'pharmacy_actions', label: 'Ações Farmácia', icon: Pill, color: 'text-blue-600' },
    { key: 'medicine_actions', label: 'Ações Medicina', icon: Stethoscope, color: 'text-red-600' },
    { key: 'nursing_actions', label: 'Ações Enfermagem', icon: Users, color: 'text-green-600' },
    { key: 'physiotherapy_actions', label: 'Ações Fisioterapia', icon: Activity, color: 'text-purple-600' },
    { key: 'nutrition_actions', label: 'Ações Nutrição', icon: UtensilsCrossed, color: 'text-orange-600' },
  ];

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Users size={20} />
          Seção 8 - Ações do Round
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {actionItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.key} className="space-y-3">
                <Label className={`text-sm font-medium flex items-center gap-2 ${item.color}`}>
                  <IconComponent size={16} />
                  {item.label}:
                </Label>
                <Textarea
                  value={formData[item.key] as string}
                  onChange={(e) => updateFormData(item.key, e.target.value)}
                  placeholder={`Descreva as ações específicas para ${item.label.toLowerCase()}...`}
                  rows={3}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
