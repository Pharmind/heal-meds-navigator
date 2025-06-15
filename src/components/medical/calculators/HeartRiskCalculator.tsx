
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeartRiskCalculatorProps {
  onBack: () => void;
}

const HeartRiskCalculator = ({ onBack }: HeartRiskCalculatorProps) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [totalCholesterol, setTotalCholesterol] = useState('');
  const [hdl, setHdl] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [smoker, setSmoker] = useState(false);
  const [diabetic, setDiabetic] = useState(false);
  const [result, setResult] = useState<{
    risk: number;
    category: string;
    color: string;
  } | null>(null);

  const calculateRisk = () => {
    const ageNum = parseFloat(age);
    const totalCholNum = parseFloat(totalCholesterol);
    const hdlNum = parseFloat(hdl);
    const bpNum = parseFloat(systolicBP);

    if (ageNum > 0 && totalCholNum > 0 && hdlNum > 0 && bpNum > 0 && gender) {
      // Framingham Risk Score simplificado
      let points = 0;

      // Pontos por idade
      if (gender === 'male') {
        if (ageNum >= 20 && ageNum <= 34) points += -9;
        else if (ageNum >= 35 && ageNum <= 39) points += -4;
        else if (ageNum >= 40 && ageNum <= 44) points += 0;
        else if (ageNum >= 45 && ageNum <= 49) points += 3;
        else if (ageNum >= 50 && ageNum <= 54) points += 6;
        else if (ageNum >= 55 && ageNum <= 59) points += 8;
        else if (ageNum >= 60 && ageNum <= 64) points += 10;
        else if (ageNum >= 65 && ageNum <= 69) points += 11;
        else if (ageNum >= 70 && ageNum <= 74) points += 12;
        else if (ageNum >= 75) points += 13;
      } else {
        if (ageNum >= 20 && ageNum <= 34) points += -7;
        else if (ageNum >= 35 && ageNum <= 39) points += -3;
        else if (ageNum >= 40 && ageNum <= 44) points += 0;
        else if (ageNum >= 45 && ageNum <= 49) points += 3;
        else if (ageNum >= 50 && ageNum <= 54) points += 6;
        else if (ageNum >= 55 && ageNum <= 59) points += 8;
        else if (ageNum >= 60 && ageNum <= 64) points += 10;
        else if (ageNum >= 65 && ageNum <= 69) points += 12;
        else if (ageNum >= 70 && ageNum <= 74) points += 14;
        else if (ageNum >= 75) points += 16;
      }

      // Pontos por colesterol total
      if (totalCholNum < 160) points += 0;
      else if (totalCholNum <= 199) points += 4;
      else if (totalCholNum <= 239) points += 7;
      else if (totalCholNum <= 279) points += 9;
      else points += 11;

      // Pontos por HDL
      if (hdlNum >= 60) points += -1;
      else if (hdlNum >= 50) points += 0;
      else if (hdlNum >= 40) points += 1;
      else points += 2;

      // Pontos por pressão arterial
      if (bpNum < 120) points += 0;
      else if (bpNum <= 129) points += 0;
      else if (bpNum <= 139) points += 1;
      else if (bpNum <= 159) points += 1;
      else points += 2;

      // Pontos por tabagismo
      if (smoker) points += 8;

      // Pontos por diabetes
      if (diabetic) points += 6;

      // Conversão para percentual de risco
      let riskPercent = 0;
      if (points < 0) riskPercent = 1;
      else if (points <= 4) riskPercent = 1;
      else if (points <= 6) riskPercent = 2;
      else if (points <= 7) riskPercent = 3;
      else if (points <= 8) riskPercent = 4;
      else if (points <= 9) riskPercent = 5;
      else if (points <= 10) riskPercent = 6;
      else if (points <= 11) riskPercent = 8;
      else if (points <= 12) riskPercent = 10;
      else if (points <= 13) riskPercent = 12;
      else if (points <= 14) riskPercent = 16;
      else if (points <= 15) riskPercent = 20;
      else if (points <= 16) riskPercent = 25;
      else riskPercent = 30;

      let category = '';
      let color = '';

      if (riskPercent < 10) {
        category = 'Baixo risco';
        color = 'bg-green-100 text-green-800';
      } else if (riskPercent < 20) {
        category = 'Risco moderado';
        color = 'bg-yellow-100 text-yellow-800';
      } else {
        category = 'Alto risco';
        color = 'bg-red-100 text-red-800';
      }

      setResult({ risk: riskPercent, category, color });
    }
  };

  const clearForm = () => {
    setAge('');
    setGender('');
    setTotalCholesterol('');
    setHdl('');
    setSystolicBP('');
    setSmoker(false);
    setDiabetic(false);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500 text-white">
            <Heart size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Risco Cardiovascular</h1>
            <p className="text-gray-600">Escore de Framingham - Risco em 10 anos</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Paciente</CardTitle>
            <CardDescription>
              Preencha os dados para calcular o risco cardiovascular
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade (anos)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 55"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Sexo</Label>
                <Select value={gender} onValueChange={(value: 'male' | 'female') => setGender(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalCholesterol">Colesterol Total (mg/dL)</Label>
                <Input
                  id="totalCholesterol"
                  type="number"
                  placeholder="Ex: 220"
                  value={totalCholesterol}
                  onChange={(e) => setTotalCholesterol(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hdl">HDL (mg/dL)</Label>
                <Input
                  id="hdl"
                  type="number"
                  placeholder="Ex: 45"
                  value={hdl}
                  onChange={(e) => setHdl(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systolicBP">Pressão Arterial Sistólica (mmHg)</Label>
              <Input
                id="systolicBP"
                type="number"
                placeholder="Ex: 140"
                value={systolicBP}
                onChange={(e) => setSystolicBP(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="smoker" 
                  checked={smoker}
                  onCheckedChange={(checked) => setSmoker(checked as boolean)}
                />
                <Label htmlFor="smoker">Tabagista</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="diabetic" 
                  checked={diabetic}
                  onCheckedChange={(checked) => setDiabetic(checked as boolean)}
                />
                <Label htmlFor="diabetic">Diabético</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateRisk} className="flex-1">
                Calcular Risco
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
              Risco de evento cardiovascular em 10 anos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {result.risk}%
                  </div>
                  <Badge className={result.color}>
                    {result.category}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Interpretação:</h4>
                  <div className="text-sm space-y-1">
                    <div>&lt; 10%: Baixo risco</div>
                    <div>10-20%: Risco moderado</div>
                    <div>&gt; 20%: Alto risco</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Este é um cálculo baseado no Escore de Framingham. 
                    A avaliação clínica completa é fundamental para o manejo adequado.
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

export default HeartRiskCalculator;
