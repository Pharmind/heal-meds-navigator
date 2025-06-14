
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Pill, Calendar, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SimplifiedFormProps {
  antimicrobialName: string;
  setAntimicrobialName: (value: string) => void;
  dosePerPatient: number;
  setDosePerPatient: (value: number) => void;
  activePatients: number;
  setActivePatients: (value: number) => void;
  estimatedDays: number;
  setEstimatedDays: (value: number) => void;
  currentStock: number;
  setCurrentStock: (value: number) => void;
  stockUnit: string;
  setStockUnit: (value: string) => void;
  commonAntimicrobials: string[];
  stockUnits: string[];
  clearForm: () => void;
  isPending: boolean;
  dailyTotalConsumption: number;
  daysRemaining: number;
  alertLevel: string;
}

const SimplifiedForm = ({
  antimicrobialName,
  setAntimicrobialName,
  dosePerPatient,
  setDosePerPatient,
  activePatients,
  setActivePatients,
  estimatedDays,
  setEstimatedDays,
  currentStock,
  setCurrentStock,
  stockUnit,
  setStockUnit,
  commonAntimicrobials,
  stockUnits,
  clearForm,
  isPending,
  dailyTotalConsumption,
  daysRemaining,
  alertLevel
}: SimplifiedFormProps) => {
  const isFormValid = antimicrobialName && activePatients > 0 && dosePerPatient > 0;

  // Função para converter para gramas para exibir equivalência
  const convertToGrams = (value: number, unit: string): number => {
    switch (unit.toLowerCase()) {
      case 'mg': return value / 1000;
      case 'g': return value;
      case 'ui': return value / 1000000;
      case 'frascos': return value * 1; // aproximação
      case 'ampolas': return value * 0.5; // aproximação
      case 'comprimidos': return value * 0.25; // aproximação
      case 'ml': return value / 1000;
      case 'l': return value * 1000;
      default: return value;
    }
  };

  const doseInGrams = convertToGrams(dosePerPatient, stockUnit);
  const stockInGrams = convertToGrams(currentStock, stockUnit);

  const getAlertColor = () => {
    switch (alertLevel) {
      case 'crítico': return 'bg-red-500 text-white';
      case 'baixo': return 'bg-orange-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="text-blue-600" size={20} />
            Estimativa Diária de Antimicrobianos
            <Badge variant="outline" className="ml-2 text-xs">
              Cálculos em gramas
            </Badge>
          </div>
          {isFormValid && (
            <Badge className={getAlertColor()}>
              {daysRemaining.toFixed(1)} dias restantes
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isPending ? (
            <span className="text-blue-600">💾 Salvando automaticamente...</span>
          ) : (
            "Sistema com cálculos convertidos automaticamente para gramas"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Linha 1: Antimicrobiano e Pacientes */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Pill size={16} />
              Antimicrobiano *
            </Label>
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
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Users size={16} />
              Pacientes em Tratamento *
            </Label>
            <Input
              type="number"
              min="0"
              max="50"
              value={activePatients || ''}
              onChange={(e) => setActivePatients(Number(e.target.value))}
              placeholder="Ex: 8"
              className={`${activePatients <= 0 ? 'border-orange-300' : 'border-green-300'}`}
            />
            <p className="text-xs text-gray-500">Pacientes ativos na unidade</p>
          </div>
        </div>

        {/* Linha 2: Dose Total e Tempo */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Dose Total Diária da Unidade *</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                step="0.1"
                value={dosePerPatient || ''}
                onChange={(e) => setDosePerPatient(Number(e.target.value))}
                placeholder="Ex: 16000"
                className={`${dosePerPatient <= 0 ? 'border-orange-300' : 'border-green-300'}`}
              />
              <span className="absolute right-3 top-2.5 text-xs text-gray-500">{stockUnit}</span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Total consumido por todos os pacientes/dia</p>
              {dosePerPatient > 0 && (
                <p className="text-blue-600 font-medium">
                  ≈ {doseInGrams.toFixed(3)} gramas/dia
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Calendar size={16} />
              Tempo Estimado (dias)
            </Label>
            <Input
              type="number"
              min="1"
              max="21"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(Number(e.target.value))}
              placeholder="7"
            />
            <p className="text-xs text-gray-500">Duração prevista do tratamento</p>
          </div>
        </div>

        {/* Linha 3: Estoque */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
            <Package size={16} />
            Estoque Atual
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Quantidade Total</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={currentStock || ''}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                placeholder="Ex: 50000"
                className="bg-white"
              />
              <div className="text-xs text-gray-500 space-y-1">
                <p>Estoque disponível total</p>
                {currentStock > 0 && (
                  <p className="text-blue-600 font-medium">
                    ≈ {stockInGrams.toFixed(3)} gramas total
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Unidade</Label>
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

        {/* Preview dos Cálculos em Gramas */}
        {isFormValid && (
          <Alert className={`border-2 ${alertLevel === 'crítico' ? 'border-red-300 bg-red-50' : 
                                       alertLevel === 'baixo' ? 'border-orange-300 bg-orange-50' : 
                                       'border-green-300 bg-green-50'}`}>
            <Package className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Consumo Diário:</strong><br />
                    {dosePerPatient.toLocaleString('pt-BR')} {stockUnit}<br />
                    <span className="text-blue-600 text-xs">
                      ({doseInGrams.toFixed(3)}g)
                    </span>
                  </div>
                  <div>
                    <strong>Dias Restantes:</strong><br />
                    <span className={alertLevel === 'crítico' ? 'text-red-700 font-bold' : 
                                    alertLevel === 'baixo' ? 'text-orange-700 font-bold' : 
                                    'text-green-700'}>
                      {daysRemaining.toFixed(1)} dias
                    </span>
                  </div>
                  <div>
                    <strong>Status:</strong><br />
                    <span className={alertLevel === 'crítico' ? 'text-red-700 font-bold' : 
                                    alertLevel === 'baixo' ? 'text-orange-700 font-bold' : 
                                    'text-green-700'}>
                      {alertLevel === 'crítico' ? '🚨 CRÍTICO' : 
                       alertLevel === 'baixo' ? '⚠️ BAIXO' : 
                       '✅ NORMAL'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t text-xs text-gray-600 space-y-1">
                  {activePatients > 0 && (
                    <div>
                      Dose média por paciente: {(dosePerPatient / activePatients).toFixed(1)} {stockUnit}/dia 
                      ({(doseInGrams / activePatients).toFixed(3)}g/dia)
                    </div>
                  )}
                  <div className="text-blue-600 font-medium">
                    📊 Todos os cálculos são feitos internamente em gramas para maior precisão
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Botão de Limpar */}
        <div className="flex justify-end">
          <Button 
            onClick={clearForm} 
            variant="outline" 
            disabled={isPending}
            className="px-6"
          >
            Limpar Formulário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedForm;
