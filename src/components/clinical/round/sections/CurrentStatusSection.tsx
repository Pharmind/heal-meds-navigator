
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Activity, AlertTriangle } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface CurrentStatusSectionProps {
  formData: RoundFormData;
  updateFormData: (field: string, value: any) => void;
}

export const CurrentStatusSection: React.FC<CurrentStatusSectionProps> = ({
  formData,
  updateFormData
}) => {
  const statusItems = [
    { key: 'dvas_usage', label: 'DVAs em uso', obsKey: 'dvas_usage_obs' },
    { key: 'sedation_analgesia', label: 'Sedoanalgesia', obsKey: 'sedation_analgesia_obs' },
    { key: 'antibiotic_therapy', label: 'Antibioticoterapia', obsKey: 'antibiotic_therapy_obs' },
    { key: 'tev_prophylaxis', label: 'Profilaxia TEV', obsKey: 'tev_prophylaxis_obs' },
    { key: 'lamg_prophylaxis', label: 'Profilaxia LAMG', obsKey: 'lamg_prophylaxis_obs' },
  ];

  return (
    <Card>
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Activity size={20} />
          Seção 2 - Status Atual
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {statusItems.map((item) => (
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
                <div className="flex gap-2 ml-auto">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Sim</span>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">Não</span>
                </div>
              </div>
              
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
