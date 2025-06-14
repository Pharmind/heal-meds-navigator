
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';

interface AntimicrobialFormProps {
  antimicrobialName: string;
  setAntimicrobialName: (value: string) => void;
  totalPatientsUsing: number;
  setTotalPatientsUsing: (value: number) => void;
  dailyDosePerPatient: number;
  setDailyDosePerPatient: (value: number) => void;
  averageTreatmentDays: number;
  setAverageTreatmentDays: (value: number) => void;
  frequencyPerDay: number;
  setFrequencyPerDay: (value: number) => void;
  currentStock: number;
  setCurrentStock: (value: number) => void;
  stockUnit: string;
  setStockUnit: (value: string) => void;
  commonAntimicrobials: string[];
  stockUnits: string[];
  clearForm: () => void;
  isPending: boolean;
}

const AntimicrobialForm = ({
  antimicrobialName,
  setAntimicrobialName,
  totalPatientsUsing,
  setTotalPatientsUsing,
  dailyDosePerPatient,
  setDailyDosePerPatient,
  averageTreatmentDays,
  setAverageTreatmentDays,
  frequencyPerDay,
  setFrequencyPerDay,
  currentStock,
  setCurrentStock,
  stockUnit,
  setStockUnit,
  commonAntimicrobials,
  stockUnits,
  clearForm,
  isPending
}: AntimicrobialFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Antimicrobiano</CardTitle>
        <CardDescription>
          {isPending && (
            <span className="text-blue-600 flex items-center gap-1">
              <Clock size={14} />
              Salvando automaticamente...
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Nome do Antimicrobiano *</Label>
            <Select value={antimicrobialName} onValueChange={setAntimicrobialName}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione ou digite" />
              </SelectTrigger>
              <SelectContent>
                {commonAntimicrobials.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Total de Pacientes Usando *</Label>
            <Input
              type="number"
              value={totalPatientsUsing || ''}
              onChange={(e) => setTotalPatientsUsing(Number(e.target.value))}
              placeholder="Ex: 5"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Dose Diária por Paciente *</Label>
            <Input
              type="number"
              value={dailyDosePerPatient || ''}
              onChange={(e) => setDailyDosePerPatient(Number(e.target.value))}
              placeholder="Ex: 2000"
            />
          </div>
          <div>
            <Label>Tempo Médio de Tratamento (dias)</Label>
            <Input
              type="number"
              value={averageTreatmentDays}
              onChange={(e) => setAverageTreatmentDays(Number(e.target.value))}
              placeholder="7"
            />
          </div>
          <div>
            <Label>Frequência por Dia</Label>
            <Input
              type="number"
              value={frequencyPerDay}
              onChange={(e) => setFrequencyPerDay(Number(e.target.value))}
              placeholder="1"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Estoque Atual Total</Label>
            <Input
              type="number"
              value={currentStock || ''}
              onChange={(e) => setCurrentStock(Number(e.target.value))}
              placeholder="Ex: 50000"
            />
          </div>
          <div>
            <Label>Unidade</Label>
            <Select value={stockUnit} onValueChange={setStockUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stockUnits.map(unit => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={clearForm} variant="outline" className="flex-1">
            Limpar Formulário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AntimicrobialForm;
