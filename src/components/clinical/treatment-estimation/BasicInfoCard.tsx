
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Calendar, Hospital } from 'lucide-react';

interface BasicInfoCardProps {
  currentDate: string;
  hospitalUnit: string;
  setHospitalUnit: (value: string) => void;
  hospitalUnits: string[];
}

const BasicInfoCard = ({ currentDate, hospitalUnit, setHospitalUnit, hospitalUnits }: BasicInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="text-rose-600" size={24} />
          Dados da Estimativa
        </CardTitle>
        <CardDescription>
          Preencha os dados básicos para calcular automaticamente o consumo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2">
              <Calendar size={16} />
              Data da Estimativa
            </Label>
            <Input value={new Date(currentDate).toLocaleDateString('pt-BR')} disabled className="bg-gray-50" />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              <Hospital size={16} />
              Unidade Hospitalar *
            </Label>
            <Select value={hospitalUnit} onValueChange={setHospitalUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                {hospitalUnits.map(unit => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
