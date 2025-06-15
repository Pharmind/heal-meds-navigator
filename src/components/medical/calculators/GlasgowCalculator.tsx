
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GlasgowCalculatorProps {
  onBack: () => void;
}

const GlasgowCalculator = ({ onBack }: GlasgowCalculatorProps) => {
  const [eyeOpening, setEyeOpening] = useState('');
  const [verbalResponse, setVerbalResponse] = useState('');
  const [motorResponse, setMotorResponse] = useState('');

  const calculateGlasgow = () => {
    const scores = [eyeOpening, verbalResponse, motorResponse];
    if (scores.every(score => score !== '')) {
      return scores.reduce((sum, score) => sum + parseInt(score), 0);
    }
    return null;
  };

  const score = calculateGlasgow();
  
  const getScoreCategory = (score: number) => {
    if (score >= 13) return { category: 'Leve', color: 'bg-green-100 text-green-800' };
    if (score >= 9) return { category: 'Moderado', color: 'bg-yellow-100 text-yellow-800' };
    return { category: 'Grave', color: 'bg-red-100 text-red-800' };
  };

  const clearForm = () => {
    setEyeOpening('');
    setVerbalResponse('');
    setMotorResponse('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500 text-white">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Escala de Glasgow</h1>
            <p className="text-gray-600">Avaliação do nível de consciência</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Avaliação Neurológica</CardTitle>
            <CardDescription>
              Avalie os três parâmetros da escala
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Abertura Ocular</Label>
              <Select value={eyeOpening} onValueChange={setEyeOpening}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Não abre</SelectItem>
                  <SelectItem value="2">2 - Abre à dor</SelectItem>
                  <SelectItem value="3">3 - Abre ao comando verbal</SelectItem>
                  <SelectItem value="4">4 - Abre espontaneamente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resposta Verbal</Label>
              <Select value={verbalResponse} onValueChange={setVerbalResponse}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Sem resposta</SelectItem>
                  <SelectItem value="2">2 - Sons incompreensíveis</SelectItem>
                  <SelectItem value="3">3 - Palavras inapropriadas</SelectItem>
                  <SelectItem value="4">4 - Confuso/desorientado</SelectItem>
                  <SelectItem value="5">5 - Orientado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resposta Motora</Label>
              <Select value={motorResponse} onValueChange={setMotorResponse}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Sem resposta</SelectItem>
                  <SelectItem value="2">2 - Extensão anormal</SelectItem>
                  <SelectItem value="3">3 - Flexão anormal</SelectItem>
                  <SelectItem value="4">4 - Retirada à dor</SelectItem>
                  <SelectItem value="5">5 - Localiza a dor</SelectItem>
                  <SelectItem value="6">6 - Obedece comandos</SelectItem>
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
              Pontuação da Escala de Glasgow
            </CardDescription>
          </CardHeader>
          <CardContent>
            {score !== null ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-3">
                    {score} <span className="text-lg">pontos</span>
                  </div>
                  <Badge className={getScoreCategory(score).color}>
                    TCE {getScoreCategory(score).category}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Classificação do TCE:</h4>
                  <div className="text-sm space-y-1">
                    <div>13-15: Leve</div>
                    <div>9-12: Moderado</div>
                    <div>3-8: Grave</div>
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Atenção:</strong> Glasgow ≤ 8 indica necessidade de 
                    intubação orotraqueal para proteção de via aérea.
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

export default GlasgowCalculator;
