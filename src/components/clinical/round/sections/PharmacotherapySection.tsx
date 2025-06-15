
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pill, Shield, AlertTriangle } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface PharmacotherapySectionProps {
  formData: RoundFormData;
  updateFormData: (field: string, value: any) => void;
}

export const PharmacotherapySection: React.FC<PharmacotherapySectionProps> = ({
  formData,
  updateFormData
}) => {
  const pharmacoItems = [
    { key: 'severe_drug_interaction', label: 'Interação medicamentosa grave', obsKey: 'severe_drug_interaction_obs' },
    { key: 'adequate_administration_route', label: 'Via de administração adequada', obsKey: 'adequate_administration_route_obs' },
    { key: 'drug_allergy', label: 'Alergia medicamentosa', obsKey: 'drug_allergy_obs' },
    { key: 'updated_lab_data', label: 'Dados laboratoriais atualizados', obsKey: 'updated_lab_data_obs' },
  ];

  const antibioticItems = [
    { key: 'indication_compliance', label: 'Indicação em conformidade' },
    { key: 'adequate_spectrum', label: 'Espectro adequado' },
    { key: 'correct_dosage', label: 'Posologia correta' },
    { key: 'treatment_time_defined', label: 'Tempo de tratamento definido' },
  ];

  return (
    <Card>
      <CardHeader className="bg-orange-50">
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <Pill size={20} />
          Seção 4 - Farmacoterapia
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Farmacoterapia Geral */}
        <div className="space-y-4">
          {pharmacoItems.map((item) => (
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

        {/* Antibioticoterapia Expandida */}
        {formData.antibiotic_therapy && (
          <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-25">
            <h4 className="flex items-center gap-2 font-semibold text-orange-900 mb-4">
              <Shield size={18} />
              Subseção - Antibioticoterapia Detalhada
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {antibioticItems.map((item) => (
                <div key={item.key} className="flex items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    checked={formData[item.key] as boolean}
                    onCheckedChange={(checked) => updateFormData(item.key, checked)}
                  />
                  <Label htmlFor={item.key} className="text-sm cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ação necessária:</Label>
              <RadioGroup
                value={formData.antibiotic_action as string || ''}
                onValueChange={(value) => updateFormData('antibiotic_action', value)}
                className="flex flex-wrap gap-4"
              >
                {['Iniciar', 'Ajustar', 'Suspender', 'Nenhuma'].map((action) => (
                  <div key={action} className="flex items-center space-x-2">
                    <RadioGroupItem value={action} id={`action_${action}`} />
                    <Label htmlFor={`action_${action}`} className="text-sm">{action}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
