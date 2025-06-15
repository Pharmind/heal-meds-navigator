
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreatinineCalculatorProps {
  onBack: () => void;
}

type Race = 'white' | 'black' | '';

interface FormulaResult {
  name: string;
  clearance: number;
  category: string;
  color: string;
  applicable: boolean;
  reason?: string;
}

const CreatinineCalculator = ({ onBack }: CreatinineCalculatorProps) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [race, setRace] = useState<Race>('');
  const [results, setResults] = useState<FormulaResult[] | null>(null);

  const getCategoryAndColor = (clearance: number) => {
    if (clearance >= 90) {
      return { category: 'Normal ou elevada (G1)', color: 'bg-green-100 text-green-800' };
    } else if (clearance >= 60) {
      return { category: 'Diminuição leve (G2)', color: 'bg-yellow-100 text-yellow-800' };
    } else if (clearance >= 45) {
      return { category: 'Diminuição leve a moderada (G3a)', color: 'bg-orange-100 text-orange-800' };
    } else if (clearance >= 30) {
      return { category: 'Diminuição moderada a grave (G3b)', color: 'bg-red-100 text-red-800' };
    } else if (clearance >= 15) {
      return { category: 'Diminuição grave (G4)', color: 'bg-red-200 text-red-900' };
    } else {
      return { category: 'Falência renal (G5)', color: 'bg-red-300 text-red-900' };
    }
  };

  const calculateAllFormulas = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const creatinineNum = parseFloat(creatinine);

    if (ageNum <= 0 || creatinineNum <= 0 || !gender) {
      return;
    }

    const formulaResults: FormulaResult[] = [];

    // Cockcroft-Gault
    if (weightNum > 0) {
      let clearance = ((140 - ageNum) * weightNum) / (72 * creatinineNum);
      if (gender === 'female') {
        clearance *= 0.85;
      }
      const { category, color } = getCategoryAndColor(clearance);
      formulaResults.push({
        name: 'Cockcroft-Gault',
        clearance: Math.round(clearance * 100) / 100,
        category,
        color,
        applicable: true
      });
    } else {
      formulaResults.push({
        name: 'Cockcroft-Gault',
        clearance: 0,
        category: '',
        color: '',
        applicable: false,
        reason: 'Peso necessário'
      });
    }

    // MDRD
    let clearanceMDRD = 175 * Math.pow(creatinineNum, -1.154) * Math.pow(ageNum, -0.203);
    if (gender === 'female') {
      clearanceMDRD *= 0.742;
    }
    if (race === 'black') {
      clearanceMDRD *= 1.212;
    }
    const mdrdResult = getCategoryAndColor(clearanceMDRD);
    formulaResults.push({
      name: 'MDRD',
      clearance: Math.round(clearanceMDRD * 100) / 100,
      category: mdrdResult.category,
      color: mdrdResult.color,
      applicable: true
    });

    // CKD-EPI
    let kappa = gender === 'female' ? 0.7 : 0.9;
    let alpha = gender === 'female' ? -0.329 : -0.411;
    let minValue = Math.min(creatinineNum / kappa, 1);
    let maxValue = Math.max(creatinineNum / kappa, 1);
    
    let clearanceCKD = 141 * Math.pow(minValue, alpha) * Math.pow(maxValue, -1.209) * Math.pow(0.993, ageNum);
    if (gender === 'female') {
      clearanceCKD *= 1.018;
    }
    if (race === 'black') {
      clearanceCKD *= 1.159;
    }
    const ckdResult = getCategoryAndColor(clearanceCKD);
    formulaResults.push({
      name: 'CKD-EPI',
      clearance: Math.round(clearanceCKD * 100) / 100,
      category: ckdResult.category,
      color: ckdResult.color,
      applicable: true
    });

    setResults(formulaResults);
  };

  const clearForm = () => {
    setAge('');
    setWeight('');
    setCreatinine('');
    setGender('');
    setRace('');
    setResults(null);
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
            <p className="text-gray-600">Comparação entre múltiplas fórmulas para cálculo da função renal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Paciente</CardTitle>
            <CardDescription>
              Insira os dados para calcular com todas as fórmulas
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
              <p className="text-xs text-gray-500">Necessário apenas para Cockcroft-Gault</p>
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
              <p className="text-xs text-gray-500">Necessário para MDRD e CKD-EPI</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateAllFormulas} className="flex-1">
                Calcular Todas
              </Button>
              <Button onClick={clearForm} variant="outline">
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Comparativos</CardTitle>
              <CardDescription>
                Clearance de creatinina calculado por diferentes fórmulas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fórmula</TableHead>
                        <TableHead>Clearance</TableHead>
                        <TableHead>Categoria</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{result.name}</TableCell>
                          <TableCell>
                            {result.applicable ? (
                              <span className="text-lg font-semibold text-green-600">
                                {result.clearance} <span className="text-sm font-normal">mL/min/1,73m²</span>
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">{result.reason}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.applicable && (
                              <Badge className={result.color}>
                                {result.category}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Sobre as Fórmulas:</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Cockcroft-Gault:</strong> Estima clearance, necessita peso</p>
                        <p><strong>MDRD:</strong> Mais precisa, não necessita peso</p>
                        <p><strong>CKD-EPI:</strong> Mais precisa em TFG normal/elevada</p>
                      </div>
                    </div>
                  </div>

                  {race === '' && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Atenção:</strong> Para cálculos mais precisos com MDRD e CKD-EPI, 
                        recomenda-se informar a raça/etnia do paciente.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Preencha os dados para ver os resultados de todas as fórmulas
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatinineCalculator;
