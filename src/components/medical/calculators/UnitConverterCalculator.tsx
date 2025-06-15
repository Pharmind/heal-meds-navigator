
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Scale, ArrowRight } from 'lucide-react';

interface UnitConverterCalculatorProps {
  onBack: () => void;
}

const UnitConverterCalculator = ({ onBack }: UnitConverterCalculatorProps) => {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [conversionType, setConversionType] = useState('weight');

  const conversions = {
    weight: {
      kg: 1000000,
      g: 1000,
      mg: 1,
      mcg: 0.001,
      ng: 0.000001
    },
    volume: {
      L: 1000,
      mL: 1,
      mcL: 0.001
    },
    concentration: {
      'mg/mL': 1000,
      'mcg/mL': 1,
      'ng/mL': 0.001,
      'g/L': 1000000,
      'mg/L': 1000,
      '%': 10000 // mg/mL
    },
    time: {
      dias: 1440,
      horas: 60,
      minutos: 1,
      segundos: 1/60
    }
  };

  const unitOptions = {
    weight: ['kg', 'g', 'mg', 'mcg', 'ng'],
    volume: ['L', 'mL', 'mcL'],
    concentration: ['mg/mL', 'mcg/mL', 'ng/mL', 'g/L', 'mg/L', '%'],
    time: ['dias', 'horas', 'minutos', 'segundos']
  };

  const handleConvert = () => {
    if (!value || !fromUnit || !toUnit) return;

    const inputValue = parseFloat(value);
    if (isNaN(inputValue)) return;

    const conversionTable = conversions[conversionType as keyof typeof conversions];
    const fromFactor = conversionTable[fromUnit as keyof typeof conversionTable];
    const toFactor = conversionTable[toUnit as keyof typeof conversionTable];

    if (fromFactor && toFactor) {
      const convertedValue = (inputValue * fromFactor) / toFactor;
      setResult(convertedValue);
    }
  };

  const clearForm = () => {
    setValue('');
    setFromUnit('');
    setToUnit('');
    setResult(null);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result !== null && value) {
      setValue(result.toString());
      setResult(parseFloat(value));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500 text-white">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conversor de Unidades</h1>
            <p className="text-gray-600">Converta entre diferentes unidades farmacêuticas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversor</CardTitle>
            <CardDescription>
              Selecione o tipo de conversão e as unidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="conversion-type">Tipo de Conversão</Label>
              <Select value={conversionType} onValueChange={setConversionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight">Peso/Massa</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="concentration">Concentração</SelectItem>
                  <SelectItem value="time">Tempo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="value">Valor a Converter</Label>
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Digite o valor"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>De</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unidade origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions[conversionType as keyof typeof unitOptions].map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Para</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unidade destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions[conversionType as keyof typeof unitOptions].map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleConvert} className="flex-1">
                Converter
              </Button>
              <Button variant="outline" onClick={swapUnits} size="icon">
                <ArrowRight size={16} />
              </Button>
              <Button variant="outline" onClick={clearForm}>
                Limpar
              </Button>
            </div>

            {result !== null && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Resultado:</h3>
                <p className="text-lg text-green-800">
                  {value} {fromUnit} = <span className="font-bold">{result.toFixed(6)}</span> {toUnit}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversões Rápidas</CardTitle>
            <CardDescription>
              Referências úteis para conversões comuns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2">Peso/Massa:</h4>
                <div className="text-sm space-y-1">
                  <div>1 kg = 1.000 g = 1.000.000 mg</div>
                  <div>1 g = 1.000 mg = 1.000.000 mcg</div>
                  <div>1 mg = 1.000 mcg = 1.000.000 ng</div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2">Volume:</h4>
                <div className="text-sm space-y-1">
                  <div>1 L = 1.000 mL</div>
                  <div>1 mL = 1.000 mcL</div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2">Concentração:</h4>
                <div className="text-sm space-y-1">
                  <div>1% = 10 mg/mL</div>
                  <div>1 g/L = 1 mg/mL</div>
                  <div>1 mg/mL = 1.000 mcg/mL</div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Dica:</h4>
                <p className="text-sm text-blue-800">
                  Use o botão de troca para inverter rapidamente as unidades de origem e destino.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitConverterCalculator;
