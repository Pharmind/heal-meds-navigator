
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Save, AlertTriangle, CheckCircle, Hospital, Calendar, Clock } from 'lucide-react';
import { useTreatmentEstimations, useSaveTreatmentEstimation } from '@/hooks/useTreatmentEstimations';
import { useToast } from '@/hooks/use-toast';

const TreatmentEstimation = () => {
  const { toast } = useToast();
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospitalUnit, setHospitalUnit] = useState('');
  const [antimicrobialName, setAntimicrobialName] = useState('');
  const [dailyDosePerPatient, setDailyDosePerPatient] = useState<number>(0);
  const [averageTreatmentDays, setAverageTreatmentDays] = useState<number>(7);
  const [frequencyPerDay, setFrequencyPerDay] = useState<number>(1);
  const [totalPatientsUsing, setTotalPatientsUsing] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [stockUnit, setStockUnit] = useState('mg');

  const { data: savedEstimations } = useTreatmentEstimations(currentDate, hospitalUnit);
  const saveMutation = useSaveTreatmentEstimation();

  const hospitalUnits = [
    'UTI Adulto',
    'UTI Pediátrica',
    'UTI Neonatal',
    'Clínica Médica',
    'Clínica Cirúrgica',
    'Outras'
  ];

  const stockUnits = ['mg', 'UI', 'frascos', 'ampolas', 'comprimidos'];

  const commonAntimicrobials = [
    'Ceftriaxona',
    'Vancomicina',
    'Meropenem',
    'Piperacilina + Tazobactam',
    'Cefepime',
    'Amicacina',
    'Ciprofloxacino',
    'Clindamicina',
    'Metronidazol',
    'Ampicilina',
    'Oxacilina',
    'Azitromicina'
  ];

  // Cálculos automáticos
  const dailyConsumption = dailyDosePerPatient * totalPatientsUsing;
  const treatmentConsumption = dailyConsumption * averageTreatmentDays;
  const stockCoverageDays = currentStock > 0 ? Math.round((currentStock / dailyConsumption) * 10) / 10 : 0;
  const isStockSufficient = stockCoverageDays >= averageTreatmentDays;

  // Auto-save quando os dados mudam
  useEffect(() => {
    if (hospitalUnit && antimicrobialName && dailyDosePerPatient > 0 && totalPatientsUsing > 0) {
      const timeoutId = setTimeout(() => {
        saveMutation.mutate({
          estimationDate: currentDate,
          hospitalUnit,
          antimicrobialName,
          dailyDosePerPatient,
          averageTreatmentDays,
          frequencyPerDay,
          totalPatientsUsing,
          currentStock,
          stockUnit,
          dailyConsumption,
          treatmentConsumption,
          stockCoverageDays,
          isStockSufficient,
        });
      }, 2000); // Salva 2 segundos após parar de digitar

      return () => clearTimeout(timeoutId);
    }
  }, [hospitalUnit, antimicrobialName, dailyDosePerPatient, averageTreatmentDays, frequencyPerDay, totalPatientsUsing, currentStock, stockUnit]);

  const clearForm = () => {
    setAntimicrobialName('');
    setDailyDosePerPatient(0);
    setAverageTreatmentDays(7);
    setFrequencyPerDay(1);
    setTotalPatientsUsing(0);
    setCurrentStock(0);
    setStockUnit('mg');
  };

  const getStockStatus = () => {
    if (currentStock === 0) return { color: 'bg-gray-100 text-gray-800', text: 'Sem dados de estoque' };
    if (stockCoverageDays < 1) return { color: 'bg-red-100 text-red-800', text: 'Estoque crítico' };
    if (stockCoverageDays < 3) return { color: 'bg-orange-100 text-orange-800', text: 'Estoque baixo' };
    if (isStockSufficient) return { color: 'bg-green-100 text-green-800', text: 'Estoque suficiente' };
    return { color: 'bg-yellow-100 text-yellow-800', text: 'Atenção necessária' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Estimativa Simplificada de Tratamento</h2>
        <p className="text-gray-600">Cálculo rápido de consumo e verificação de estoque</p>
      </div>

      {/* Informações Básicas */}
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

      {/* Formulário Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Antimicrobiano</CardTitle>
          <CardDescription>
            {saveMutation.isPending && (
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

      {/* Resultados dos Cálculos */}
      {hospitalUnit && antimicrobialName && dailyDosePerPatient > 0 && totalPatientsUsing > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resultados Automáticos</span>
              <Badge className={stockStatus.color}>
                {isStockSufficient ? <CheckCircle size={14} className="mr-1" /> : <AlertTriangle size={14} className="mr-1" />}
                {stockStatus.text}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Consumo Diário Total</p>
                <p className="text-xl font-bold text-blue-600">{dailyConsumption} {stockUnit}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Consumo Total do Tratamento</p>
                <p className="text-xl font-bold text-purple-600">{treatmentConsumption} {stockUnit}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Cobertura do Estoque</p>
                <p className={`text-xl font-bold ${isStockSufficient ? 'text-green-600' : 'text-red-600'}`}>
                  {stockCoverageDays} dias
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Pacientes × Dose</p>
                <p className="text-lg font-semibold text-gray-700">
                  {totalPatientsUsing} × {dailyDosePerPatient} {stockUnit}
                </p>
              </div>
            </div>

            {!isStockSufficient && currentStock > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle size={16} />
                  <strong>Atenção: Estoque Insuficiente!</strong>
                </div>
                <p className="text-red-700 mt-1">
                  O estoque atual durará apenas {stockCoverageDays} dias, mas o tratamento requer {averageTreatmentDays} dias.
                  É necessário repor {Math.ceil(treatmentConsumption - currentStock)} {stockUnit} adicionais.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estimativas Salvas do Dia */}
      {savedEstimations && savedEstimations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estimativas Salvas Hoje - {hospitalUnit}</CardTitle>
            <CardDescription>{savedEstimations.length} antimicrobiano(s) registrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedEstimations.map((estimation) => (
                <div key={estimation.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{estimation.antimicrobialName}</h4>
                    <Badge className={estimation.isStockSufficient ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {estimation.isStockSufficient ? 'Suficiente' : 'Insuficiente'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                    <span>Pacientes: {estimation.totalPatientsUsing}</span>
                    <span>Consumo diário: {estimation.dailyConsumption} {estimation.stockUnit}</span>
                    <span>Cobertura: {estimation.stockCoverageDays} dias</span>
                    <span>Estoque: {estimation.currentStock} {estimation.stockUnit}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Como Usar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-green-700">
            <p>• <strong>Preenchimento obrigatório:</strong> Unidade, antimicrobiano, dose diária e número de pacientes</p>
            <p>• <strong>Salvamento automático:</strong> Os dados são salvos automaticamente 2 segundos após parar de digitar</p>
            <p>• <strong>Cálculos automáticos:</strong> Consumo e cobertura são calculados em tempo real</p>
            <p>• <strong>Alertas:</strong> Sistema indica quando o estoque é insuficiente para o tratamento completo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentEstimation;
