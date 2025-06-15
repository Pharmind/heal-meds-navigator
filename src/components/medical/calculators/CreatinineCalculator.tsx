
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreatinineCalculatorProps {
  onBack: () => void;
}

const CreatinineCalculator = ({ onBack }: CreatinineCalculatorProps) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [result, setResult] = useState<{
    clearance: number;
    category: string;
    color: string;
  } | null>(null);

  const calculateClearance = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const creatinineNum = parseFloat(creatinine);

    if (ageNum > 0 && weightNum > 0 && creatinineNum > 0 && gender) {
      // Fórmula de Cockcroft-Gault
      let clearance = ((140 - ageNum) * weightNum) / (72 * creatinineNum);
      
      if (gender === 'female') {
        clearance *= 0.85;
      }

      let category = '';
      let color = '';

      if (clearance >= 90) {
        category = 'Normal ou elevada';
        color = 'bg-green-100 text-green-800';
      } else if (clearance >= 60) {
        category = 'Diminuição leve';
        color = 'bg-yellow-100 text-yellow-800';
      } else if (clearance >= 45) {
        category = 'Diminuição leve a moderada';
        color = 'bg-orange-100 text-orange-800';
      } else if (clearance >= 30) {
        category = 'Diminuição moderada a grave';
        color = 'bg-red-100 text-red-800';
      } else if (clearance >= 15) {
        category = 'Diminuição grave';
        color = 'bg-red-200 text-red-900';
      } else {
        category = 'Falência renal';
        color = 'bg-red-300 text-red-900';
      }

      setResult({ 
        clearance: Math.round(clearance * 100) / 100, 
        category, 
        color 
      });
    }
  };

  const clearForm = () => {
    setAge('');
    setWeight('');
    setCreatinine('');
    setGender('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500 text-white">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clearance de Creatinina</h1>
            <p className="text-gray-600">Fórmula de Cockcroft-Gault</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Paciente</CardTitle>
            <CardDescription>
              Insira os dados para calcular o clearance de creatinina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Idade (anos)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Ex: 65"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
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
              <Label htmlFor="creatinine">Creatinina sérica (mg/dL)</Label>
              <Input
                id="creatinine"
                type="number"
                step="0.1"
                placeholder="Ex: 1.2"
                value={creatinine}
                onChange={(e) => setCreatinine(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select value={gender} onValueChange={(value: 'male' | 'female') => setGender(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={calculateClearance} className="flex-1">
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
              Interpretação da função renal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {result.clearance} <span className="text-lg">mL/min</span>
                  </div>
                  <Badge className={result.color}>
                    {result.category}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Classificação da Função Renal:</h4>
                  <div className="text-sm space-y-1">
                    <div>≥ 90 mL/min: Normal ou elevada</div>
                    <div>60-89 mL/min: Diminuição leve</div>
                    <div>45-59 mL/min: Diminuição leve a moderada</div>
                    <div>30-44 mL/min: Diminuição moderada a grave</div>
                    <div>15-29 mL/min: Diminuição grave</div>
                    <div>&lt; 15 mL/min: Falência renal</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Este cálculo utiliza a fórmula de Cockcroft-Gault. 
                    Para maior precisão, considere também a fórmula MDRD ou CKD-EPI.
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

export default CreatinineCalculator;
