
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Baby } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PediatricCalculatorProps {
  onBack: () => void;
}

const PediatricCalculator = ({ onBack }: PediatricCalculatorProps) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<{
    surfaceArea: number;
    idealWeight: number;
    classification: string;
  } | null>(null);

  const calculatePediatric = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);

    if (weightNum > 0 && heightNum > 0 && ageNum > 0) {
      // Superfície corporal (fórmula de Mosteller)
      const surfaceArea = Math.sqrt((heightNum * weightNum) / 3600);
      
      // Peso ideal pediátrico (aproximação)
      let idealWeight = 0;
      if (ageNum <= 1) {
        idealWeight = (ageNum * 2) + 4; // Para bebês
      } else if (ageNum <= 10) {
        idealWeight = (ageNum * 2) + 8; // Para crianças
      } else {
        idealWeight = (ageNum * 3) + 3; // Para adolescentes
      }

      // Classificação do estado nutricional
      const ratio = (weightNum / idealWeight) * 100;
      let classification = '';
      
      if (ratio < 75) classification = 'Desnutrição grave';
      else if (ratio < 90) classification = 'Desnutrição moderada';
      else if (ratio <= 110) classification = 'Eutrófico';
      else if (ratio <= 120) classification = 'Sobrepeso';
      else classification = 'Obesidade';

      setResult({
        surfaceArea: Math.round(surfaceArea * 100) / 100,
        idealWeight: Math.round(idealWeight * 10) / 10,
        classification
      });
    }
  };

  const clearForm = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-500 text-white">
            <Baby size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calculadora Pediátrica</h1>
            <p className="text-gray-600">Superfície corporal e peso ideal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Criança</CardTitle>
            <CardDescription>
              Insira os dados antropométricos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Idade (anos)</Label>
              <Input
                id="age"
                type="number"
                step="0.1"
                placeholder="Ex: 5.5"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Ex: 18.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Ex: 110"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={calculatePediatric} className="flex-1">
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
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Parâmetros pediátricos calculados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="text-sm text-pink-600 mb-1">Superfície Corporal:</div>
                    <div className="text-xl font-bold text-pink-800">
                      {result.surfaceArea} m²
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Peso Ideal:</div>
                    <div className="text-xl font-bold text-blue-800">
                      {result.idealWeight} kg
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-sm">
                      {result.classification}
                    </Badge>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Uso:</strong> A superfície corporal é utilizada para 
                    cálculo de doses quimioterápicas e outros medicamentos específicos.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Preencha os dados para ver os resultados
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PediatricCalculator;
