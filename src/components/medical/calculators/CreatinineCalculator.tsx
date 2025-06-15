
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

type Formula = 'cockcroft-gault' | 'mdrd' | 'ckd-epi';
type Race = 'white' | 'black' | '';

const CreatinineCalculator = ({ onBack }: CreatinineCalculatorProps) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [race, setRace] = useState<Race>('');
  const [formula, setFormula] = useState<Formula>('cockcroft-gault');
  const [result, setResult] = useState<{
    clearance: number;
    category: string;
    color: string;
    formula: string;
  } | null>(null);

  const calculateClearance = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const creatinineNum = parseFloat(creatinine);

    if (ageNum > 0 && creatinineNum > 0 && gender) {
      let clearance = 0;
      let formulaName = '';

      if (formula === 'cockcroft-gault') {
        if (weightNum <= 0) return;
        clearance = ((140 - ageNum) * weightNum) / (72 * creatinineNum);
        if (gender === 'female') {
          clearance *= 0.85;
        }
        formulaName = 'Cockcroft-Gault';
      } else if (formula === 'mdrd') {
        // MDRD: 175 × (SCr)^-1.154 × (Age)^-0.203 × (0.742 if female) × (1.212 if African American)
        clearance = 175 * Math.pow(creatinineNum, -1.154) * Math.pow(ageNum, -0.203);
        if (gender === 'female') {
          clearance *= 0.742;
        }
        if (race === 'black') {
          clearance *= 1.212;
        }
        formulaName = 'MDRD';
      } else if (formula === 'ckd-epi') {
        // CKD-EPI
        let kappa = gender === 'female' ? 0.7 : 0.9;
        let alpha = gender === 'female' ? -0.329 : -0.411;
        let minValue = Math.min(creatinineNum / kappa, 1);
        let maxValue = Math.max(creatinineNum / kappa, 1);
        
        clearance = 141 * Math.pow(minValue, alpha) * Math.pow(maxValue, -1.209) * Math.pow(0.993, ageNum);
        if (gender === 'female') {
          clearance *= 1.018;
        }
        if (race === 'black') {
          clearance *= 1.159;
        }
        formulaName = 'CKD-EPI';
      }

      let category = '';
      let color = '';

      if (clearance >= 90) {
        category = 'Normal ou elevada (G1)';
        color = 'bg-green-100 text-green-800';
      } else if (clearance >= 60) {
        category = 'Diminuição leve (G2)';
        color = 'bg-yellow-100 text-yellow-800';
      } else if (clearance >= 45) {
        category = 'Diminuição leve a moderada (G3a)';
        color = 'bg-orange-100 text-orange-800';
      } else if (clearance >= 30) {
        category = 'Diminuição moderada a grave (G3b)';
        color = 'bg-red-100 text-red-800';
      } else if (clearance >= 15) {
        category = 'Diminuição grave (G4)';
        color = 'bg-red-200 text-red-900';
      } else {
        category = 'Falência renal (G5)';
        color = 'bg-red-300 text-red-900';
      }

      setResult({ 
        clearance: Math.round(clearance * 100) / 100, 
        category, 
        color,
        formula: formulaName
      });
    }
  };

  const clearForm = () => {
    setAge('');
    setWeight('');
    setCreatinine('');
    setGender('');
    setRace('');
    setResult(null);
  };

  const requiresWeight = formula === 'cockcroft-gault';
  const requiresRace = formula === 'mdrd' || formula === 'ckd-epi';

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
            <p className="text-gray-600">Múltiplas fórmulas para cálculo da função renal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Paciente</CardTitle>
            <CardDescription>
              Selecione a fórmula e insira os dados necessários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fórmula de Cálculo</Label>
              <Select value={formula} onValueChange={(value: Formula) => setFormula(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fórmula" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cockcroft-gault">Cockcroft-Gault</SelectItem>
                  <SelectItem value="mdrd">MDRD</SelectItem>
                  <SelectItem value="ckd-epi">CKD-EPI</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            {requiresWeight && (
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
            )}

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

            {requiresRace && (
              <div className="space-y-2">
                <Label>Raça/Etnia</Label>
                <Select value={race} onValueChange={(value: Race) => setRace(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a raça" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">Branca/Outras</SelectItem>
                    <SelectItem value="black">Negra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

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
                  <div className="text-sm text-gray-600 mb-1">Fórmula: {result.formula}</div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {result.clearance} <span className="text-lg">mL/min/1,73m²</span>
                  </div>
                  <Badge className={result.color}>
                    {result.category}
                  </Badge>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Classificação KDIGO:</h4>
                  <div className="text-sm space-y-1">
                    <div>≥ 90 mL/min/1,73m²: Normal ou elevada (G1)</div>
                    <div>60-89 mL/min/1,73m²: Diminuição leve (G2)</div>
                    <div>45-59 mL/min/1,73m²: Diminuição leve a moderada (G3a)</div>
                    <div>30-44 mL/min/1,73m²: Diminuição moderada a grave (G3b)</div>
                    <div>15-29 mL/min/1,73m²: Diminuição grave (G4)</div>
                    <div>&lt; 15 mL/min/1,73m²: Falência renal (G5)</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Sobre as Fórmulas:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Cockcroft-Gault:</strong> Estima clearance, necessita peso</p>
                    <p><strong>MDRD:</strong> Mais precisa, não necessita peso</p>
                    <p><strong>CKD-EPI:</strong> Mais precisa em TFG normal/elevada</p>
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

export default CreatinineCalculator;
