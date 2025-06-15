
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, Activity, Pill, Lungs, Droplets } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface FunctionalAssessmentSectionProps {
  formData: RoundFormData;
  updateFormData: (field: string, value: any) => void;
}

export const FunctionalAssessmentSection: React.FC<FunctionalAssessmentSectionProps> = ({
  formData,
  updateFormData
}) => {
  const functionalItems = [
    { key: 'renal_function', label: 'Função renal', obsKey: 'renal_function_obs', icon: Droplets },
    { key: 'hepatic_function', label: 'Função hepática', obsKey: 'hepatic_function_obs', icon: Pill },
    { key: 'pulmonary_function', label: 'Função pulmonar', obsKey: 'pulmonary_function_obs', icon: Lungs },
    { key: 'evacuation', label: 'Evacuação', obsKey: 'evacuation_obs', icon: Activity },
    { key: 'diuresis', label: 'Diurese', obsKey: 'diuresis_obs', icon: Heart },
  ];

  return (
    <Card>
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Heart size={20} />
          Seção 3 - Avaliação Funcional
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {functionalItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.key} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <IconComponent size={18} className="text-purple-600" />
                  <Label className="text-sm font-medium">{item.label}</Label>
                </div>
                
                <RadioGroup
                  value={formData[item.key] as string || ''}
                  onValueChange={(value) => updateFormData(item.key, value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Preservada" id={`${item.key}_preservada`} />
                    <Label htmlFor={`${item.key}_preservada`} className="text-sm">Preservada</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Alterada" id={`${item.key}_alterada`} />
                    <Label htmlFor={`${item.key}_alterada`} className="text-sm">Alterada</Label>
                  </div>
                </RadioGroup>
                
                <div className="space-y-2">
                  <Label htmlFor={`${item.key}_obs`} className="text-sm text-gray-600">
                    Observações:
                  </Label>
                  <Textarea
                    id={`${item.key}_obs`}
                    value={formData[item.obsKey] as string}
                    onChange={(e) => updateFormData(item.obsKey, e.target.value)}
                    placeholder={`Observações sobre ${item.label.toLowerCase()}`}
                    className="w-full"
                    rows={2}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
