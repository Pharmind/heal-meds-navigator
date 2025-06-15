
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, Calendar } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface RoundFooterSectionProps {
  formData: RoundFormData;
  updateFormData: (field: string, value: any) => void;
}

export const RoundFooterSection: React.FC<RoundFooterSectionProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <Card>
      <CardHeader className="bg-slate-50">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Users size={20} />
          Rodapé - Informações do Round
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="present_professionals" className="text-sm font-medium flex items-center gap-2">
              <Users size={14} />
              Profissionais Presentes:
            </Label>
            <Textarea
              id="present_professionals"
              value={formData.present_professionals}
              onChange={(e) => updateFormData('present_professionals', e.target.value)}
              placeholder="Ex: Dr. João Silva (Médico), Ana Santos (Enfermeira), Carlos Lima (Farmacêutico)..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="next_evaluation" className="text-sm font-medium flex items-center gap-2">
              <Calendar size={14} />
              Próxima Avaliação:
            </Label>
            <Input
              id="next_evaluation"
              type="date"
              value={formData.next_evaluation}
              onChange={(e) => updateFormData('next_evaluation', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
