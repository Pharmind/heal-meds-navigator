
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Home } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface DischargePlanningSectionProps {
  formData: RoundFormData;
  updateFormData: (field: string, value: any) => void;
}

export const DischargePlanningSection: React.FC<DischargePlanningSectionProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <Card>
      <CardHeader className="bg-indigo-50">
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <Home size={20} />
          Seção 7 - Planejamento de Alta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="discharge_estimate"
              checked={formData.discharge_estimate}
              onCheckedChange={(checked) => updateFormData('discharge_estimate', checked)}
            />
            <Label htmlFor="discharge_estimate" className="text-sm font-medium cursor-pointer">
              Há estimativa de alta
            </Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="discharge_criteria_met"
              checked={formData.discharge_criteria_met}
              onCheckedChange={(checked) => updateFormData('discharge_criteria_met', checked)}
            />
            <Label htmlFor="discharge_criteria_met" className="text-sm font-medium cursor-pointer">
              Critérios de alta atingidos
            </Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discharge_pending_issues" className="text-sm font-medium">
            Pendências para alta:
          </Label>
          <Textarea
            id="discharge_pending_issues"
            value={formData.discharge_pending_issues}
            onChange={(e) => updateFormData('discharge_pending_issues', e.target.value)}
            placeholder="Descreva as pendências ou ações necessárias para a alta..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};
