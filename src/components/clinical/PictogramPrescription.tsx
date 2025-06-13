
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Download, Plus, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { generatePictogramPDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';
import DrugInteractions from './DrugInteractions';

interface Medication {
  name: string;
  concentration: string;
  type: string;
  schedule: string;
  customTime: string;
  observation: string;
}

const PictogramPrescription = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    allergy: '',
    bloodType: '',
    emergencyContact: ''
  });

  const [medications, setMedications] = useState<Medication[]>([
    {
      name: '',
      concentration: '',
      type: 'comprimido',
      schedule: '8-8h',
      customTime: '',
      observation: ''
    }
  ]);

  const [fontSize, setFontSize] = useState(0);
  const [showInteractions, setShowInteractions] = useState(false);

  const addMedication = () => {
    setMedications([...medications, {
      name: '',
      concentration: '',
      type: 'comprimido',
      schedule: '8-8h',
      customTime: '',
      observation: ''
    }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const generatePDF = () => {
    const hasRequiredData = patientData.name && medications.some(med => med.name);
    
    if (!hasRequiredData) {
      toast.error('Preencha pelo menos o nome do paciente e um medicamento');
      return;
    }

    const data = {
      patientData,
      medications: medications.filter(med => med.name.trim() !== ''),
      fontSize
    };

    const pdf = generatePictogramPDF(data);
    pdf.save(`receita-pictograma-${patientData.name || 'paciente'}-${Date.now()}.pdf`);
    
    toast.success('Receita em pictograma gerada com sucesso!');
  };

  const exportToInteractions = () => {
    const medicationNames = medications
      .filter(med => med.name.trim() !== '')
      .map(med => med.name);
    
    if (medicationNames.length < 2) {
      toast.error('Adicione pelo menos 2 medicamentos para verificar interações');
      return;
    }

    setShowInteractions(true);
    toast.success('Medicamentos exportados para verificação de interações!');
  };

  if (showInteractions) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Verificação de Interações - Medicamentos Importados</h3>
          <Button 
            variant="outline" 
            onClick={() => setShowInteractions(false)}
          >
            Voltar ao Pictograma
          </Button>
        </div>
        <DrugInteractions 
          importedMedications={medications.filter(med => med.name.trim() !== '').map(med => med.name)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Receita em Pictograma</h2>
        <p className="text-gray-600">Prescrição visual para melhor compreensão do tratamento</p>
      </div>

      {/* Dados do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Paciente</CardTitle>
          <CardDescription>Informações básicas para a receita</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={patientData.name}
                onChange={(e) => setPatientData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo do paciente"
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                value={patientData.age}
                onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Idade do paciente"
              />
            </div>
            <div>
              <Label htmlFor="allergy">Alergias</Label>
              <Input
                id="allergy"
                value={patientData.allergy}
                onChange={(e) => setPatientData(prev => ({ ...prev, allergy: e.target.value }))}
                placeholder="Alergias conhecidas"
              />
            </div>
            <div>
              <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
              <Input
                id="bloodType"
                value={patientData.bloodType}
                onChange={(e) => setPatientData(prev => ({ ...prev, bloodType: e.target.value }))}
                placeholder="Ex: O+, A-, AB+"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="emergencyContact">Contato de Emergência</Label>
              <Input
                id="emergencyContact"
                value={patientData.emergencyContact}
                onChange={(e) => setPatientData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Nome e telefone do contato de emergência"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Medicamentos de Uso Contínuo
            <Button onClick={addMedication} size="sm">
              <Plus size={16} className="mr-1" />
              Adicionar Medicamento
            </Button>
          </CardTitle>
          <CardDescription>
            Configure os medicamentos e seus horários de administração
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {medications.map((medication, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Medicamento {index + 1}</h4>
                  {medications.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMedication(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do Medicamento *</Label>
                    <Input
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      placeholder="Nome comercial ou genérico"
                      required
                    />
                  </div>
                  <div>
                    <Label>Concentração</Label>
                    <Input
                      value={medication.concentration}
                      onChange={(e) => updateMedication(index, 'concentration', e.target.value)}
                      placeholder="Ex: 500mg, 10mg/ml"
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={medication.type}
                      onValueChange={(value) => updateMedication(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprimido">Comprimido</SelectItem>
                        <SelectItem value="capsula">Cápsula</SelectItem>
                        <SelectItem value="liquido">Líquido</SelectItem>
                        <SelectItem value="injetavel">Injetável</SelectItem>
                        <SelectItem value="pomada">Pomada/Creme</SelectItem>
                        <SelectItem value="spray">Spray</SelectItem>
                        <SelectItem value="gotas">Gotas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Horário de Administração</Label>
                    <Select
                      value={medication.schedule}
                      onValueChange={(value) => updateMedication(index, 'schedule', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x/dia">1x ao dia</SelectItem>
                        <SelectItem value="12-12h">12 em 12 horas</SelectItem>
                        <SelectItem value="8-8h">8 em 8 horas</SelectItem>
                        <SelectItem value="6-6h">6 em 6 horas</SelectItem>
                        <SelectItem value="4-4h">4 em 4 horas</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {medication.schedule === 'custom' && (
                  <div>
                    <Label>Horário Personalizado</Label>
                    <Input
                      value={medication.customTime}
                      onChange={(e) => updateMedication(index, 'customTime', e.target.value)}
                      placeholder="Ex: 8h, 14h, 20h"
                    />
                  </div>
                )}
                
                <div>
                  <Label>Observações</Label>
                  <Textarea
                    value={medication.observation}
                    onChange={(e) => updateMedication(index, 'observation', e.target.value)}
                    placeholder="Instruções especiais (tomar com alimentos, em jejum, etc.)"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Formato */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Formato</CardTitle>
          <CardDescription>Ajuste o tamanho da fonte para melhor legibilidade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Ajuste de Fonte ({fontSize > 0 ? '+' : ''}{fontSize})</Label>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={-3}
                max={5}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Menor</span>
                <span>Normal</span>
                <span>Maior</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Button onClick={generatePDF} className="flex items-center gap-2">
          <Download size={16} />
          Gerar Receita PDF
        </Button>
        
        <Button 
          onClick={exportToInteractions} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <AlertTriangle size={16} />
          Verificar Interações
        </Button>
      </div>

      {/* Aviso importante */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-orange-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-orange-800 mb-1">Importante</h4>
              <p className="text-sm text-orange-700">
                A receita em pictograma é uma ferramenta auxiliar de comunicação. 
                Sempre mantenha a prescrição médica original e oriente sobre a importância 
                do acompanhamento médico regular.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PictogramPrescription;
