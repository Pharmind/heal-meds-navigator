
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, MapPin, Bed } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface PatientIdentificationSectionProps {
  formData: RoundFormData;
  updateFormData: (field: string, value: any) => void;
}

export const PatientIdentificationSection: React.FC<PatientIdentificationSectionProps> = ({
  formData,
  updateFormData
}) => {
  const showMotherName = formData.round_type === 'Neonatal' || formData.round_type === 'Pediátrica';

  return (
    <Card>
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <User size={20} />
          Seção 1 - Identificação do Paciente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient_name" className="text-sm font-medium">
              Nome do Paciente *
            </Label>
            <Input
              id="patient_name"
              type="text"
              value={formData.patient_name}
              onChange={(e) => updateFormData('patient_name', e.target.value)}
              placeholder="Nome completo do paciente"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date" className="text-sm font-medium">
              Data de Nascimento
            </Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => updateFormData('birth_date', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector" className="text-sm font-medium">
              Setor
            </Label>
            <Select
              value={formData.sector}
              onValueChange={(value) => updateFormData('sector', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTI Adulto">UTI Adulto</SelectItem>
                <SelectItem value="UTI Neonatal">UTI Neonatal</SelectItem>
                <SelectItem value="UTI Pediátrica">UTI Pediátrica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bed" className="text-sm font-medium flex items-center gap-1">
              <Bed size={14} />
              Leito *
            </Label>
            <Input
              id="bed"
              type="text"
              value={formData.bed}
              onChange={(e) => updateFormData('bed', e.target.value)}
              placeholder="Número do leito"
              className="w-full"
              required
            />
          </div>

          {showMotherName && (
            <div className="space-y-2">
              <Label htmlFor="mother_name" className="text-sm font-medium">
                Nome da Mãe
              </Label>
              <Input
                id="mother_name"
                type="text"
                value={formData.mother_name}
                onChange={(e) => updateFormData('mother_name', e.target.value)}
                placeholder="Nome da mãe"
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="hospitalization_days" className="text-sm font-medium flex items-center gap-1">
              <Calendar size={14} />
              Dias de Internação
            </Label>
            <Input
              id="hospitalization_days"
              type="number"
              value={formData.hospitalization_days}
              onChange={(e) => updateFormData('hospitalization_days', e.target.value)}
              placeholder="Número de dias"
              className="w-full"
              min="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
