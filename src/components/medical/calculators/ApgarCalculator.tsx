
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Baby } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ApgarCalculatorProps {
  onBack: () => void;
}

const ApgarCalculator = ({ onBack }: ApgarCalculatorProps) => {
  const [heartRate, setHeartRate] = useState('');
  const [breathing, setBreathing] = useState('');
  const [muscleReflexes, setMuscleReflexes] = useState('');
  const [color, setColor] = useState('');
  const [muscle, setMuscle] = useState('');

  const calculateApgar = () => {
    const scores = [heartRate, breathing, muscleReflexes, color, muscle];
    if (scores.every(score => score !== '')) {
      return scores.reduce((sum, score) => sum + parseInt(score), 0);
    }
    return null;
  };

  const score = calculateApgar();
  
  const getScoreCategory = (score: number) => {
    if (score >= 7) return { category: 'Normal', color: 'bg-green-100 text-green-800' };
    if (score >= 4) return { category: 'Moderadamente deprimido', color: 'bg-yellow-100 text-yellow-800' };
    return { category: 'Gravemente deprimido', color: 'bg-red-100 text-red-800' };
  };

  const clearForm = () => {
    setHeartRate('');
    setBreathing('');
    setMuscleReflexes('');
    setColor('');
    setMuscle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500 text-white">
            <Baby size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Escala de Apgar</h1>
            <p className="text-gray-600">Avaliação de recém-nascidos</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Avaliação do RN</CardTitle>
            <CardDescription>
              Avalie cada parâmetro de 0 a 2 pontos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Frequência Cardíaca</Label>
              <Select value={heartRate} onValueChange={setHeartRate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Ausente</SelectItem>
                  <SelectItem value="1">1 - &lt; 100 bpm</SelectItem>
                  <SelectItem value="2">2 - &gt; 100 bpm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Respiração</Label>
              <Select value={breathing} onValueChange={setBreathing}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Ausente</SelectItem>
                  <SelectItem value="1">1 - Irregular/fraca</SelectItem>
                  <SelectItem value="2">2 - Choro forte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reflexos/Irritabilidade</Label>
              <Select value={muscleReflexes} onValueChange={setMuscleReflexes}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Ausente</SelectItem>
                  <SelectItem value="1">1 - Pouca resposta</SelectItem>
                  <SelectItem value="2">2 - Boa resposta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cor da Pele</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Cianótico/pálido</SelectItem>
                  <SelectItem value="1">1 - Corpo rosado, extremidades azuis</SelectItem>
                  <SelectItem value="2">2 - Completamente rosado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tônus Muscular</Label>
              <Select value={muscle} onValueChange={setMuscle}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Flácido</SelectItem>
                  <SelectItem value="1">1 - Alguma flexão</SelectItem>
                  <SelectItem value="2">2 - Flexão ativa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={clearForm} variant="outline" className="w-full">
              Limpar Formulário
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>
              Pontuação da Escala de Apgar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {score !== null ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-3">
                    {score} <span className="text-lg">pontos</span>
                  </div>
                  <Badge className={getScoreCategory(score).color}>
                    {getScoreCategory(score).category}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Interpretação:</h4>
                  <div className="text-sm space-y-1">
                    <div>7-10: Normal</div>
                    <div>4-6: Moderadamente deprimido</div>
                    <div>0-3: Gravemente deprimido</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> A avaliação deve ser feita no 1º e 5º minutos 
                    de vida. Em casos de escore baixo, reavaliar a cada 5 minutos.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Preencha todos os critérios para ver o resultado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApgarCalculator;
