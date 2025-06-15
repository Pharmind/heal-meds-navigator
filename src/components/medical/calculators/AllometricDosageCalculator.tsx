
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Syringe, Calculator } from 'lucide-react';

interface AllometricDosageCalculatorProps {
  onBack: () => void;
}

interface DosageResult {
  bsa: number;
  dose: number;
  dailyDose?: number;
  dosesPerDay?: number;
}

const AllometricDosageCalculator = ({ onBack }: AllometricDosageCalculatorProps) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dosePerM2, setDosePerM2] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [result, setResult] = useState<DosageResult | null>(null);

  // Fórmula de Mosteller para BSA: √((altura × peso) / 3600)
  const calculateBSA = (heightCm: number, weightKg: number): number => {
    return Math.sqrt((heightCm * weightKg) / 3600);
  };

  // Fórmula de Du Bois para BSA (alternativa): 0.007184 × altura^0.725 × peso^0.425
  const calculateBSADuBois = (heightCm: number, weightKg: number): number => {
    return 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425);
  };

  const handleCalculate = () => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const doseNum = parseFloat(dosePerM2);
    const freqNum = parseInt(frequency);

    if (!heightNum || !weightNum || !doseNum || !freqNum) return;

    // Calcular BSA (usando fórmula de Mosteller)
    const bsa = calculateBSA(heightNum, weightNum);
    
    // Calcular dose baseada na BSA
    const dose = doseNum * bsa;
    
    // Dose por administração se dividido em múltiplas doses
    const dosePerAdministration = dose / freqNum;

    setResult({
      bsa: Math.round(bsa * 100) / 100,
      dose: Math.round(dose * 100) / 100,
      dailyDose: Math.round(dosePerAdministration * 100) / 100,
      dosesPerDay: freqNum
    });
  };

  const clearForm = () => {
    setHeight('');
    setWeight('');
    setDosePerM2('');
    setFrequency('1');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500 text-white">
            <Syringe size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dosagem Alométrica</h1>
            <p className="text-gray-600">Cálculo de doses baseado em superfície corporal (BSA)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Paciente</CardTitle>
            <CardDescription>
              Informe os dados antropométricos e a dose prescrita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 170"
              />
            </div>

            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 70"
              />
            </div>

            <div>
              <Label htmlFor="dose-per-m2">Dose Prescrita (mg/m²)</Label>
              <Input
                id="dose-per-m2"
                type="number"
                value={dosePerM2}
                onChange={(e) => setDosePerM2(e.target.value)}
                placeholder="Ex: 100"
              />
            </div>

            <div>
              <Label>Frequência de Administração (vezes/dia)</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x ao dia</SelectItem>
                  <SelectItem value="2">2x ao dia</SelectItem>
                  <SelectItem value="3">3x ao dia</SelectItem>
                  <SelectItem value="4">4x ao dia</SelectItem>
                  <SelectItem value="6">6x ao dia</SelectItem>
                  <SelectItem value="8">8x ao dia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCalculate} className="flex-1">
                Calcular Dosagem
              </Button>
              <Button variant="outline" onClick={clearForm}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Superfície corporal e dosagem calculada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="text-blue-600" size={20} />
                    <h3 className="font-semibold text-blue-900">Superfície Corporal (BSA)</h3>
                  </div>
                  <p className="text-blue-800">
                    <span className="font-bold text-lg">{result.bsa}</span> m²
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Dosagem Total Diária</h3>
                  <p className="text-green-800">
                    <span className="font-bold text-lg">{result.dose}</span> mg/dia
                  </p>
                </div>

                {result.dosesPerDay && result.dosesPerDay > 1 && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2">Dose por Administração</h3>
                    <p className="text-purple-800">
                      <span className="font-bold text-lg">{result.dailyDose}</span> mg
                    </p>
                    <p className="text-sm text-purple-700 mt-1">
                      {result.dosesPerDay}x ao dia
                    </p>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Resumo da Prescrição</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>BSA: {result.bsa} m²</p>
                    <p>Dose prescrita: {dosePerM2} mg/m²</p>
                    <p>Dose total: {result.dose} mg/dia</p>
                    {result.dosesPerDay && result.dosesPerDay > 1 && (
                      <p>Administrar: {result.dailyDose} mg, {result.dosesPerDay}x ao dia</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Preencha os dados para calcular a dosagem
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Fórmula de Mosteller</h3>
                <p className="text-sm text-blue-800">
                  BSA (m²) = √((altura em cm × peso em kg) / 3600)
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Fórmula mais utilizada clinicamente para cálculo de superfície corporal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Syringe className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Indicações Clínicas</h3>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p>• Quimioterapia antineoplásica</p>
                  <p>• Medicamentos com janela terapêutica estreita</p>
                  <p>• Doses pediátricas específicas</p>
                  <p>• Alguns antibióticos e antivirais</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllometricDosageCalculator;
