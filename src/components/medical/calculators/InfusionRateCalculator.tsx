
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Droplets, Clock } from 'lucide-react';

interface InfusionRateCalculatorProps {
  onBack: () => void;
}

interface InfusionResult {
  dropsPerMinute: number;
  microdropsPerMinute: number;
  infusionTime: number;
  mlPerHour: number;
}

const InfusionRateCalculator = ({ onBack }: InfusionRateCalculatorProps) => {
  const [volume, setVolume] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState('hours');
  const [dropFactor, setDropFactor] = useState('20');
  const [result, setResult] = useState<InfusionResult | null>(null);

  const calculateInfusion = () => {
    const volumeNum = parseFloat(volume);
    const timeNum = parseFloat(time);
    const dropFactorNum = parseFloat(dropFactor);

    if (!volumeNum || !timeNum || !dropFactorNum) return;

    // Converter tempo para minutos
    let timeInMinutes = timeNum;
    if (timeUnit === 'hours') {
      timeInMinutes = timeNum * 60;
    } else if (timeUnit === 'days') {
      timeInMinutes = timeNum * 24 * 60;
    }

    // Calcular gotejamento (gotas/min)
    const dropsPerMinute = (volumeNum * dropFactorNum) / timeInMinutes;

    // Microgotas sempre são 60 microgotas/mL
    const microdropsPerMinute = (volumeNum * 60) / timeInMinutes;

    // mL/hora
    const mlPerHour = volumeNum / (timeInMinutes / 60);

    // Tempo de infusão em horas (para referência)
    const infusionTime = timeInMinutes / 60;

    setResult({
      dropsPerMinute: Math.round(dropsPerMinute * 100) / 100,
      microdropsPerMinute: Math.round(microdropsPerMinute * 100) / 100,
      infusionTime: Math.round(infusionTime * 100) / 100,
      mlPerHour: Math.round(mlPerHour * 100) / 100
    });
  };

  const clearForm = () => {
    setVolume('');
    setTime('');
    setTimeUnit('hours');
    setDropFactor('20');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500 text-white">
            <Droplets size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Taxa de Infusão</h1>
            <p className="text-gray-600">Calcule velocidade de gotejamento e tempo de infusão</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Infusão</CardTitle>
            <CardDescription>
              Informe os parâmetros para calcular a taxa de infusão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="volume">Volume Total (mL)</Label>
              <Input
                id="volume"
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="Ex: 500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time">Tempo de Infusão</Label>
                <Input
                  id="time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Ex: 8"
                />
              </div>
              <div>
                <Label>Unidade de Tempo</Label>
                <Select value={timeUnit} onValueChange={setTimeUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutos</SelectItem>
                    <SelectItem value="hours">Horas</SelectItem>
                    <SelectItem value="days">Dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Fator de Gota do Equipo</Label>
              <Select value={dropFactor} onValueChange={setDropFactor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 gotas/mL (Macrogotas)</SelectItem>
                  <SelectItem value="15">15 gotas/mL (Macrogotas)</SelectItem>
                  <SelectItem value="20">20 gotas/mL (Macrogotas)</SelectItem>
                  <SelectItem value="60">60 microgotas/mL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateInfusion} className="flex-1">
                Calcular
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
              Taxa de gotejamento e informações da infusão
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="text-blue-600" size={20} />
                      <h3 className="font-semibold text-blue-900">Taxa de Gotejamento</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-blue-800">
                        <span className="font-bold text-lg">{result.dropsPerMinute}</span> gotas/min
                      </p>
                      <p className="text-blue-800">
                        <span className="font-bold text-lg">{result.microdropsPerMinute}</span> microgotas/min
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-green-600" size={20} />
                      <h3 className="font-semibold text-green-900">Velocidade de Infusão</h3>
                    </div>
                    <p className="text-green-800">
                      <span className="font-bold text-lg">{result.mlPerHour}</span> mL/hora
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Tempo Total de Infusão</h3>
                    <p className="text-gray-800">
                      <span className="font-bold">{result.infusionTime}</span> horas
                    </p>
                  </div>
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

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Droplets className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Fatores de Gota Comuns</h3>
              <div className="text-sm text-yellow-800 space-y-1">
                <p><strong>Macrogotas:</strong> 10, 15 ou 20 gotas/mL (mais comum: 20 gotas/mL)</p>
                <p><strong>Microgotas:</strong> 60 microgotas/mL (padrão universal)</p>
                <p><strong>Importante:</strong> Sempre verificar o fator de gota impresso no equipo antes de iniciar a infusão</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfusionRateCalculator;
