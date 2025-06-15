
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Pill } from 'lucide-react';

interface DosageCalculatorProps {
  onBack: () => void;
}

const DosageCalculator = ({ onBack }: DosageCalculatorProps) => {
  const [weight, setWeight] = useState('');
  const [dosePerKg, setDosePerKg] = useState('');
  const [frequency, setFrequency] = useState('');
  const [result, setResult] = useState<{
    totalDose: number;
    dailyDose: number;
  } | null>(null);

  const calculateDose = () => {
    const weightNum = parseFloat(weight);
    const doseNum = parseFloat(dosePerKg);
    const freqNum = parseFloat(frequency);

    if (weightNum > 0 && doseNum > 0 && freqNum > 0) {
      const totalDose = weightNum * doseNum;
      const dailyDose = totalDose * freqNum;
      setResult({ totalDose, dailyDose });
    }
  };

  const clearForm = () => {
    setWeight('');
    setDosePerKg('');
    setFrequency('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500 text-white">
            <Pill size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cálculo de Dosagem</h1>
            <p className="text-gray-600">Dosagem medicamentosa por peso</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Prescrição</CardTitle>
            <CardDescription>
              Calcule a dosagem baseada no peso do paciente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso do paciente (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Ex: 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dose">Dose por kg (mg/kg)</Label>
              <Input
                id="dose"
                type="number"
                step="0.1"
                placeholder="Ex: 10"
                value={dosePerKg}
                onChange={(e) => setDosePerKg(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência por dia</Label>
              <Input
                id="frequency"
                type="number"
                placeholder="Ex: 3"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={calculateDose} className="flex-1">
                Calcular
              </Button>
              <Button onClick={clearForm} variant="outline">
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>
              Dosagem calculada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 mb-1">Dose por administração:</div>
                    <div className="text-2xl font-bold text-purple-800">
                      {result.totalDose} mg
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Dose total diária:</div>
                    <div className="text-2xl font-bold text-blue-800">
                      {result.dailyDose} mg/dia
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> Sempre verifique as doses máximas recomendadas 
                    e contraindicações antes da administração.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Preencha os dados para ver o resultado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DosageCalculator;
