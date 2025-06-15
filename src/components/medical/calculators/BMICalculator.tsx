
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BMICalculatorProps {
  onBack: () => void;
}

const BMICalculator = ({ onBack }: BMICalculatorProps) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    color: string;
  } | null>(null);

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // converter cm para metros

    if (weightNum > 0 && heightNum > 0) {
      const bmi = weightNum / (heightNum * heightNum);
      let category = '';
      let color = '';

      if (bmi < 18.5) {
        category = 'Abaixo do peso';
        color = 'bg-blue-100 text-blue-800';
      } else if (bmi < 25) {
        category = 'Peso normal';
        color = 'bg-green-100 text-green-800';
      } else if (bmi < 30) {
        category = 'Sobrepeso';
        color = 'bg-yellow-100 text-yellow-800';
      } else if (bmi < 35) {
        category = 'Obesidade Grau I';
        color = 'bg-orange-100 text-orange-800';
      } else if (bmi < 40) {
        category = 'Obesidade Grau II';
        color = 'bg-red-100 text-red-800';
      } else {
        category = 'Obesidade Grau III';
        color = 'bg-red-200 text-red-900';
      }

      setResult({ bmi: Math.round(bmi * 100) / 100, category, color });
    }
  };

  const clearForm = () => {
    setWeight('');
    setHeight('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500 text-white">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calculadora de IMC</h1>
            <p className="text-gray-600">Índice de Massa Corporal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Paciente</CardTitle>
            <CardDescription>
              Insira o peso e altura para calcular o IMC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Ex: 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Ex: 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={calculateBMI} className="flex-1">
                Calcular IMC
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
              Interpretação do Índice de Massa Corporal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {result.bmi}
                  </div>
                  <Badge className={result.color}>
                    {result.category}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Classificação IMC (OMS):</h4>
                  <div className="text-sm space-y-1">
                    <div>Abaixo do peso: &lt; 18,5</div>
                    <div>Peso normal: 18,5 - 24,9</div>
                    <div>Sobrepeso: 25,0 - 29,9</div>
                    <div>Obesidade Grau I: 30,0 - 34,9</div>
                    <div>Obesidade Grau II: 35,0 - 39,9</div>
                    <div>Obesidade Grau III: ≥ 40,0</div>
                  </div>
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

export default BMICalculator;
