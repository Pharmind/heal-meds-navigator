
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, AlertCircle, Calculator } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const isFormValid = antimicrobialName && totalPatientsUsing > 0 && dailyDosePerPatient > 0;
  const dailyConsumption = dailyDosePerPatient * totalPatientsUsing;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="text-blue-600" size={20} />
          Dados do Antimicrobiano
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          {isPending && (
            <>
              <Clock size={14} className="text-blue-600" />
              <span className="text-blue-600">Salvando automaticamente...</span>
            </>
          )}
          {!isPending && isFormValid && (
            <span className="text-green-600">✓ Dados válidos - Pronto para cálculo</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Antimicrobial Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Nome do Antimicrobiano *</Label>
            <Select value={antimicrobialName} onValueChange={setAntimicrobialName}>
              <SelectTrigger className={`${!antimicrobialName ? 'border-orange-300' : 'border-green-300'}`}>
                <SelectValue placeholder="Selecione o antimicrobiano" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {commonAntimicrobials.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Total de Pacientes no Setor *</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={totalPatientsUsing || ''}
              onChange={(e) => setTotalPatientsUsing(Number(e.target.value))}
              placeholder="Ex: 5"
              className={`${totalPatientsUsing <= 0 ? 'border-orange-300' : 'border-green-300'}`}
            />
            <p className="text-xs text-gray-500">Pacientes atualmente em uso</p>
          </div>
        </div>

        {/* Dosage Information */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Dose Diária por Paciente *</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                step="0.1"
                value={dailyDosePerPatient || ''}
                onChange={(e) => setDailyDosePerPatient(Number(e.target.value))}
                placeholder="Ex: 2000"
                className={`${dailyDosePerPatient <= 0 ? 'border-orange-300' : 'border-green-300'}`}
              />
              <span className="absolute right-3 top-2.5 text-xs text-gray-500">{stockUnit}</span>
            </div>
            <p className="text-xs text-gray-500">Dose total diária</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Tempo Médio de Tratamento</Label>
            <Input
              type="number"
              min="1"
              max="30"
              value={averageTreatmentDays}
              onChange={(e) => setAverageTreatmentDays(Number(e.target.value))}
              placeholder="7"
            />
            <p className="text-xs text-gray-500">Dias de tratamento</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Administrações/Dia</Label>
            <Select value={frequencyPerDay.toString()} onValueChange={(value) => setFrequencyPerDay(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x ao dia</SelectItem>
                <SelectItem value="2">2x ao dia</SelectItem>
                <SelectItem value="3">3x ao dia</SelectItem>
                <SelectItem value="4">4x ao dia</SelectItem>
                <SelectItem value="6">6x ao dia</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Frequência de administração</p>
          </div>
        </div>

        {/* Stock Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-700">Informações de Estoque</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Estoque Atual Total</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={currentStock || ''}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                placeholder="Ex: 50000"
                className="bg-white"
              />
              <p className="text-xs text-gray-500">Quantidade disponível no estoque</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Unidade de Medida</Label>
              <Select value={stockUnit} onValueChange={setStockUnit}>
                <SelectTrigger className="bg-white">
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
        </div>

        {/* Quick Calculation Preview */}
        {isFormValid && (
          <Alert className="border-blue-200 bg-blue-50">
            <Calculator className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  <strong>Consumo diário previsto:</strong> {dailyConsumption.toLocaleString('pt-BR')} {stockUnit}
                </span>
                <span className="text-xs text-blue-600">
                  {totalPatientsUsing} pacientes × {dailyDosePerPatient} {stockUnit}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Form Actions */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={clearForm} 
            variant="outline" 
            className="flex-1"
            disabled={isPending}
          >
            Limpar Formulário
          </Button>
          {!isFormValid && (
            <Alert className="flex-1 border-orange-200 bg-orange-50 py-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-sm">
                Preencha os campos obrigatórios (*) para ver os resultados
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AntimicrobialForm;
