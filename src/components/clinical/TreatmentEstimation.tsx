
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Trash2, Download, Calendar, AlertTriangle, CheckCircle, Hospital } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AntimicrobialData {
  id: string;
  name: string;
  dailyDose: number;
  frequency: number;
  treatmentDays: number;
  patientsCount: number;
  currentStock: number;
  stockUnit: string;
}

const TreatmentEstimation = () => {
  const { toast } = useToast();
  const [currentDate] = useState(new Date().toLocaleDateString('pt-BR'));
  const [hospitalUnit, setHospitalUnit] = useState('');
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [antimicrobials, setAntimicrobials] = useState<AntimicrobialData[]>([]);
  const [newAntimicrobial, setNewAntimicrobial] = useState<Partial<AntimicrobialData>>({
    name: '',
    dailyDose: 0,
    frequency: 1,
    treatmentDays: 7,
    patientsCount: 1,
    currentStock: 0,
    stockUnit: 'mg'
  });

  const hospitalUnits = [
    'UTI Adulto',
    'UTI Pediátrica',
    'UTI Neonatal',
    'Clínica Médica',
    'Clínica Cirúrgica',
    'Outras'
  ];

  const stockUnits = ['mg', 'UI', 'frascos', 'ampolas', 'comprimidos'];

  const calculateEstimation = (antimicrobial: AntimicrobialData) => {
    const totalDailyConsumption = antimicrobial.dailyDose * antimicrobial.patientsCount;
    const totalTreatmentConsumption = totalDailyConsumption * antimicrobial.treatmentDays;
    const stockCoverage = antimicrobial.currentStock / totalDailyConsumption;
    const isStockSufficient = stockCoverage >= antimicrobial.treatmentDays;

    return {
      totalDailyConsumption,
      totalTreatmentConsumption,
      stockCoverage: Math.round(stockCoverage * 10) / 10,
      isStockSufficient
    };
  };

  const addAntimicrobial = () => {
    if (!newAntimicrobial.name || !newAntimicrobial.dailyDose) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos o nome e a dose diária do antimicrobiano.",
        variant: "destructive"
      });
      return;
    }

    const antimicrobial: AntimicrobialData = {
      id: Date.now().toString(),
      name: newAntimicrobial.name || '',
      dailyDose: newAntimicrobial.dailyDose || 0,
      frequency: newAntimicrobial.frequency || 1,
      treatmentDays: newAntimicrobial.treatmentDays || 7,
      patientsCount: newAntimicrobial.patientsCount || 1,
      currentStock: newAntimicrobial.currentStock || 0,
      stockUnit: newAntimicrobial.stockUnit || 'mg'
    };

    setAntimicrobials([...antimicrobials, antimicrobial]);
    setNewAntimicrobial({
      name: '',
      dailyDose: 0,
      frequency: 1,
      treatmentDays: 7,
      patientsCount: 1,
      currentStock: 0,
      stockUnit: 'mg'
    });

    toast({
      title: "Sucesso",
      description: "Antimicrobiano adicionado com sucesso!",
    });
  };

  const removeAntimicrobial = (id: string) => {
    setAntimicrobials(antimicrobials.filter(item => item.id !== id));
  };

  const exportToExcel = () => {
    const csvContent = [
      'Nome,Dose Diária (mg/UI),Frequência,Dias de Tratamento,Pacientes,Estoque Atual,Unidade,Consumo Diário Total,Consumo Total Tratamento,Cobertura (dias),Estoque Suficiente'
    ];

    antimicrobials.forEach(antimicrobial => {
      const estimation = calculateEstimation(antimicrobial);
      csvContent.push([
        antimicrobial.name,
        antimicrobial.dailyDose,
        antimicrobial.frequency,
        antimicrobial.treatmentDays,
        antimicrobial.patientsCount,
        antimicrobial.currentStock,
        antimicrobial.stockUnit,
        estimation.totalDailyConsumption,
        estimation.totalTreatmentConsumption,
        estimation.stockCoverage,
        estimation.isStockSufficient ? 'Sim' : 'Não'
      ].join(','));
    });

    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estimativa_antimicrobianos_${currentDate.replace(/\//g, '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Estimativa de Tratamento</h2>
        <p className="text-gray-600">Estimativa diária e verificação de estoque de antimicrobianos</p>
      </div>

      {/* Header Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="text-rose-600" size={24} />
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <Calendar size={16} />
                Data da Estimativa
              </Label>
              <Input value={currentDate} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Hospital size={16} />
                Unidade Hospitalar
              </Label>
              <Select value={hospitalUnit} onValueChange={setHospitalUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {hospitalUnits.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Total de Pacientes em Uso de Antimicrobianos</Label>
              <Input
                type="number"
                value={totalPatients}
                onChange={(e) => setTotalPatients(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Antimicrobial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="text-green-600" size={24} />
            Adicionar Antimicrobiano
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Nome do Antimicrobiano</Label>
              <Input
                value={newAntimicrobial.name || ''}
                onChange={(e) => setNewAntimicrobial({...newAntimicrobial, name: e.target.value})}
                placeholder="Ex: Ceftriaxona"
              />
            </div>
            <div>
              <Label>Dose Diária Total por Paciente</Label>
              <Input
                type="number"
                value={newAntimicrobial.dailyDose || ''}
                onChange={(e) => setNewAntimicrobial({...newAntimicrobial, dailyDose: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Frequência Diária</Label>
              <Input
                type="number"
                value={newAntimicrobial.frequency || ''}
                onChange={(e) => setNewAntimicrobial({...newAntimicrobial, frequency: Number(e.target.value)})}
                placeholder="1"
              />
            </div>
            <div>
              <Label>Tempo de Tratamento (dias)</Label>
              <Input
                type="number"
                value={newAntimicrobial.treatmentDays || ''}
                onChange={(e) => setNewAntimicrobial({...newAntimicrobial, treatmentDays: Number(e.target.value)})}
                placeholder="7"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Número de Pacientes em Uso</Label>
              <Input
                type="number"
                value={newAntimicrobial.patientsCount || ''}
                onChange={(e) => setNewAntimicrobial({...newAntimicrobial, patientsCount: Number(e.target.value)})}
                placeholder="1"
              />
            </div>
            <div>
              <Label>Quantidade Total em Estoque</Label>
              <Input
                type="number"
                value={newAntimicrobial.currentStock || ''}
                onChange={(e) => setNewAntimicrobial({...newAntimicrobial, currentStock: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Unidade</Label>
              <Select 
                value={newAntimicrobial.stockUnit || 'mg'} 
                onValueChange={(value) => setNewAntimicrobial({...newAntimicrobial, stockUnit: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stockUnits.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addAntimicrobial} className="w-full">
            <Plus size={16} className="mr-2" />
            Adicionar Antimicrobiano
          </Button>
        </CardContent>
      </Card>

      {/* Antimicrobials List */}
      {antimicrobials.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Estimativas de Consumo</CardTitle>
              <CardDescription>{antimicrobials.length} antimicrobiano(s) cadastrado(s)</CardDescription>
            </div>
            <Button onClick={exportToExcel} variant="outline">
              <Download size={16} className="mr-2" />
              Exportar Excel
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {antimicrobials.map(antimicrobial => {
                const estimation = calculateEstimation(antimicrobial);
                return (
                  <div key={antimicrobial.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">{antimicrobial.name}</h4>
                      <div className="flex items-center gap-2">
                        {estimation.isStockSufficient ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" />
                            Estoque Suficiente
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle size={14} className="mr-1" />
                            Estoque Insuficiente
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAntimicrobial(antimicrobial.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Dose Diária/Paciente:</p>
                        <p className="font-medium">{antimicrobial.dailyDose} {antimicrobial.stockUnit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Pacientes em Uso:</p>
                        <p className="font-medium">{antimicrobial.patientsCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Consumo Diário Total:</p>
                        <p className="font-medium text-blue-600">{estimation.totalDailyConsumption} {antimicrobial.stockUnit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cobertura do Estoque:</p>
                        <p className={`font-medium ${estimation.isStockSufficient ? 'text-green-600' : 'text-red-600'}`}>
                          {estimation.stockCoverage} dias
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm text-gray-600 mb-1">Consumo Total do Tratamento:</p>
                      <p className="font-semibold text-purple-600">
                        {estimation.totalTreatmentConsumption} {antimicrobial.stockUnit} 
                        ({antimicrobial.treatmentDays} dias)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Como Funciona o Cálculo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            <p><strong>Consumo Diário Total:</strong> Dose diária × Número de pacientes</p>
            <p><strong>Consumo Total do Tratamento:</strong> Consumo diário × Dias de tratamento</p>
            <p><strong>Cobertura do Estoque:</strong> Estoque atual ÷ Consumo diário total</p>
            <p><strong>Estoque Suficiente:</strong> ✅ Se cobertura ≥ tempo de tratamento | ❌ Se cobertura &lt; tempo de tratamento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentEstimation;
