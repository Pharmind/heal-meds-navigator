
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FlaskConical, Beaker } from 'lucide-react';

interface ConcentrationCalculatorProps {
  onBack: () => void;
}

interface ConcentrationResult {
  finalConcentration?: number;
  volumeToAdd?: number;
  diluentVolume?: number;
  finalVolume?: number;
  amountOfDrug?: number;
}

const ConcentrationCalculator = ({ onBack }: ConcentrationCalculatorProps) => {
  // Estados para cálculo de concentração
  const [drugAmount, setDrugAmount] = useState('');
  const [totalVolume, setTotalVolume] = useState('');
  const [concentrationResult, setConcentrationResult] = useState<number | null>(null);

  // Estados para diluição
  const [initialConcentration, setInitialConcentration] = useState('');
  const [initialVolume, setInitialVolume] = useState('');
  const [finalConcentration, setFinalConcentration] = useState('');
  const [dilutionResult, setDilutionResult] = useState<ConcentrationResult | null>(null);

  // Estados para quantidade de droga
  const [desiredConcentration, setDesiredConcentration] = useState('');
  const [desiredVolume, setDesiredVolume] = useState('');
  const [drugAmountResult, setDrugAmountResult] = useState<number | null>(null);

  const calculateConcentration = () => {
    const drug = parseFloat(drugAmount);
    const volume = parseFloat(totalVolume);

    if (!drug || !volume) return;

    const concentration = drug / volume;
    setConcentrationResult(concentration);
  };

  const calculateDilution = () => {
    const c1 = parseFloat(initialConcentration);
    const v1 = parseFloat(initialVolume);
    const c2 = parseFloat(finalConcentration);

    if (!c1 || !v1 || !c2) return;

    // C1 × V1 = C2 × V2
    const v2 = (c1 * v1) / c2;
    const diluentVolume = v2 - v1;

    setDilutionResult({
      finalVolume: Math.round(v2 * 100) / 100,
      diluentVolume: Math.round(diluentVolume * 100) / 100,
      volumeToAdd: Math.round(diluentVolume * 100) / 100
    });
  };

  const calculateDrugAmount = () => {
    const concentration = parseFloat(desiredConcentration);
    const volume = parseFloat(desiredVolume);

    if (!concentration || !volume) return;

    const amount = concentration * volume;
    setDrugAmountResult(amount);
  };

  const clearAll = () => {
    setDrugAmount('');
    setTotalVolume('');
    setConcentrationResult(null);
    setInitialConcentration('');
    setInitialVolume('');
    setFinalConcentration('');
    setDilutionResult(null);
    setDesiredConcentration('');
    setDesiredVolume('');
    setDrugAmountResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500 text-white">
            <FlaskConical size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Concentração e Diluição</h1>
            <p className="text-gray-600">Calcule concentrações e prepare diluições de medicamentos</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="concentration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="concentration">Concentração</TabsTrigger>
          <TabsTrigger value="dilution">Diluição</TabsTrigger>
          <TabsTrigger value="drug-amount">Quantidade de Droga</TabsTrigger>
        </TabsList>

        <TabsContent value="concentration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calcular Concentração</CardTitle>
                <CardDescription>
                  Determine a concentração final baseada na quantidade de droga e volume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="drug-amount">Quantidade de Droga (mg)</Label>
                  <Input
                    id="drug-amount"
                    type="number"
                    value={drugAmount}
                    onChange={(e) => setDrugAmount(e.target.value)}
                    placeholder="Ex: 250"
                  />
                </div>

                <div>
                  <Label htmlFor="total-volume">Volume Total (mL)</Label>
                  <Input
                    id="total-volume"
                    type="number"
                    value={totalVolume}
                    onChange={(e) => setTotalVolume(e.target.value)}
                    placeholder="Ex: 100"
                  />
                </div>

                <Button onClick={calculateConcentration} className="w-full">
                  Calcular Concentração
                </Button>

                {concentrationResult && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Concentração Final:</h3>
                    <p className="text-lg text-blue-800">
                      <span className="font-bold">{concentrationResult.toFixed(2)}</span> mg/mL
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fórmula</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Concentração = Quantidade ÷ Volume</h4>
                    <p className="text-sm text-gray-600">
                      C (mg/mL) = Quantidade de droga (mg) ÷ Volume total (mL)
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Exemplo:</h4>
                    <p className="text-sm text-yellow-800">
                      250 mg de medicamento em 100 mL = 2,5 mg/mL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dilution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calcular Diluição</CardTitle>
                <CardDescription>
                  Determine o volume de diluente necessário para obter a concentração desejada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="initial-concentration">Concentração Inicial (mg/mL)</Label>
                  <Input
                    id="initial-concentration"
                    type="number"
                    value={initialConcentration}
                    onChange={(e) => setInitialConcentration(e.target.value)}
                    placeholder="Ex: 10"
                  />
                </div>

                <div>
                  <Label htmlFor="initial-volume">Volume Inicial (mL)</Label>
                  <Input
                    id="initial-volume"
                    type="number"
                    value={initialVolume}
                    onChange={(e) => setInitialVolume(e.target.value)}
                    placeholder="Ex: 5"
                  />
                </div>

                <div>
                  <Label htmlFor="final-concentration">Concentração Desejada (mg/mL)</Label>
                  <Input
                    id="final-concentration"
                    type="number"
                    value={finalConcentration}
                    onChange={(e) => setFinalConcentration(e.target.value)}
                    placeholder="Ex: 2"
                  />
                </div>

                <Button onClick={calculateDilution} className="w-full">
                  Calcular Diluição
                </Button>

                {dilutionResult && (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-2">Resultado:</h3>
                      <div className="space-y-1 text-green-800">
                        <p>Volume final: <span className="font-bold">{dilutionResult.finalVolume} mL</span></p>
                        <p>Volume de diluente a adicionar: <span className="font-bold">{dilutionResult.volumeToAdd} mL</span></p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fórmula da Diluição</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">C₁ × V₁ = C₂ × V₂</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>C₁ = Concentração inicial</p>
                      <p>V₁ = Volume inicial</p>
                      <p>C₂ = Concentração final</p>
                      <p>V₂ = Volume final</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Passos:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>1. Calcule V₂ = (C₁ × V₁) ÷ C₂</p>
                      <p>2. Volume a adicionar = V₂ - V₁</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drug-amount" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calcular Quantidade de Droga</CardTitle>
                <CardDescription>
                  Determine a quantidade de droga necessária para uma concentração e volume específicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="desired-concentration">Concentração Desejada (mg/mL)</Label>
                  <Input
                    id="desired-concentration"
                    type="number"
                    value={desiredConcentration}
                    onChange={(e) => setDesiredConcentration(e.target.value)}
                    placeholder="Ex: 5"
                  />
                </div>

                <div>
                  <Label htmlFor="desired-volume">Volume Desejado (mL)</Label>
                  <Input
                    id="desired-volume"
                    type="number"
                    value={desiredVolume}
                    onChange={(e) => setDesiredVolume(e.target.value)}
                    placeholder="Ex: 50"
                  />
                </div>

                <Button onClick={calculateDrugAmount} className="w-full">
                  Calcular Quantidade
                </Button>

                {drugAmountResult && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2">Quantidade Necessária:</h3>
                    <p className="text-lg text-purple-800">
                      <span className="font-bold">{drugAmountResult.toFixed(2)}</span> mg
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversões Úteis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Concentrações Comuns:</h4>
                    <div className="text-sm space-y-1">
                      <div>1% = 10 mg/mL</div>
                      <div>0,9% (SF) = 9 mg/mL</div>
                      <div>5% = 50 mg/mL</div>
                      <div>10% = 100 mg/mL</div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Importante:</h4>
                    <p className="text-sm text-orange-800">
                      Sempre verificar a compatibilidade do medicamento com o diluente 
                      e respeitar as concentrações máximas recomendadas pelo fabricante.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" onClick={clearAll}>
          Limpar Todos os Campos
        </Button>
      </div>
    </div>
  );
};

export default ConcentrationCalculator;
