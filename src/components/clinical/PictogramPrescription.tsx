
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Trash2, Plus, Download, Printer, FileText, Type } from 'lucide-react';
import { generatePictogramPDF } from '@/utils/pdfGenerator';

interface PatientData {
  name: string;
  age: string;
  allergy: string;
  bloodType: string;
  emergencyContact: string;
}

interface Medication {
  id: string;
  name: string;
  concentration: string;
  type: string;
  schedule: string;
  customTime: string;
  observation: string;
}

const PictogramPrescription = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    allergy: '',
    bloodType: '',
    emergencyContact: ''
  });

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: '',
      concentration: '',
      type: '',
      schedule: '',
      customTime: '',
      observation: ''
    }
  ]);

  const [fontSize, setFontSize] = useState(0);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const medicationTypes = ['Comprimido', 'Cápsula', 'Xarope', 'Gotas', 'Injetável', 'Pomada', 'Spray', 'Supositório'];
  
  const scheduleOptions = [
    { value: '06:00', label: '06:00 ☀️' },
    { value: '07:00', label: '07:00 ☀️' },
    { value: '08:00', label: '08:00 ☀️' },
    { value: '09:00', label: '09:00 ☀️' },
    { value: '10:00', label: '10:00 ☀️' },
    { value: '11:00', label: '11:00 ☀️' },
    { value: '12:00', label: '12:00 ☀️' },
    { value: '13:00', label: '13:00 ☀️' },
    { value: '14:00', label: '14:00 ☀️' },
    { value: '15:00', label: '15:00 ☀️' },
    { value: '16:00', label: '16:00 ☀️' },
    { value: '17:00', label: '17:00 ☀️' },
    { value: '18:00', label: '18:00 🌙' },
    { value: '19:00', label: '19:00 🌙' },
    { value: '20:00', label: '20:00 🌙' },
    { value: '21:00', label: '21:00 🌙' },
    { value: '22:00', label: '22:00 🌙' },
    { value: '23:00', label: '23:00 🌙' },
    { value: '00:00', label: '00:00 🌙' },
    { value: '01:00', label: '01:00 🌙' },
    { value: '02:00', label: '02:00 🌙' },
    { value: '03:00', label: '03:00 🌙' },
    { value: '04:00', label: '04:00 🌙' },
    { value: '05:00', label: '05:00 🌙' },
    { value: 'custom', label: '🕐 Horário personalizado' }
  ];

  const handlePatientDataChange = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMedicationChange = (id: string, field: keyof Medication, value: string) => {
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      concentration: '',
      type: '',
      schedule: '',
      customTime: '',
      observation: ''
    };
    setMedications(prev => [...prev, newMedication]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(prev => prev.filter(med => med.id !== id));
    }
  };

  const generatePrescription = () => {
    const pdfData = {
      patientData,
      medications: medications.filter(med => med.name.trim() !== ''),
      fontSize
    };

    const doc = generatePictogramPDF(pdfData);
    
    // Open PDF in new window
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const downloadPrescription = () => {
    const pdfData = {
      patientData,
      medications: medications.filter(med => med.name.trim() !== ''),
      fontSize
    };

    const doc = generatePictogramPDF(pdfData);
    doc.save(`receita_pictograma_${patientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const printPrescription = () => {
    const pdfData = {
      patientData,
      medications: medications.filter(med => med.name.trim() !== ''),
      fontSize
    };

    const doc = generatePictogramPDF(pdfData);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Receita em Pictograma</h2>
        <p className="text-gray-600">Prescrição visual para facilitar a compreensão do paciente</p>
      </div>

      {/* Dados do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="text-heal-green-600" size={24} />
            Dados do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={patientData.name}
                onChange={(e) => handlePatientDataChange('name', e.target.value)}
                placeholder="Nome do paciente"
              />
            </div>
            <div>
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                value={patientData.age}
                onChange={(e) => handlePatientDataChange('age', e.target.value)}
                placeholder="Idade"
              />
            </div>
            <div>
              <Label htmlFor="allergy">Alergia</Label>
              <Input
                id="allergy"
                value={patientData.allergy}
                onChange={(e) => handlePatientDataChange('allergy', e.target.value)}
                placeholder="Alergias conhecidas"
              />
            </div>
            <div>
              <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
              <Select value={patientData.bloodType} onValueChange={(value) => handlePatientDataChange('bloodType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo sanguíneo" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="emergencyContact">Contato de Emergência</Label>
              <Input
                id="emergencyContact"
                value={patientData.emergencyContact}
                onChange={(e) => handlePatientDataChange('emergencyContact', e.target.value)}
                placeholder="Nome e telefone do contato de emergência"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Fonte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="text-purple-600" size={24} />
            Tamanho da Fonte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Ajustar tamanho da fonte: {fontSize > 0 ? `+${fontSize}` : fontSize}</Label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={-2}
              max={4}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Menor</span>
              <span>Normal</span>
              <span>Maior</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="text-blue-600" size={24} />
            Medicamentos de Uso Contínuo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {medications.map((medication, index) => (
              <div key={medication.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-lg">Medicamento {index + 1}</h4>
                  {medications.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMedication(medication.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Nome do Medicamento</Label>
                    <Input
                      value={medication.name}
                      onChange={(e) => handleMedicationChange(medication.id, 'name', e.target.value)}
                      placeholder="Nome do medicamento"
                    />
                  </div>
                  <div>
                    <Label>Concentração</Label>
                    <Input
                      value={medication.concentration}
                      onChange={(e) => handleMedicationChange(medication.id, 'concentration', e.target.value)}
                      placeholder="ex: 500mg, 5ml"
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select 
                      value={medication.type} 
                      onValueChange={(value) => handleMedicationChange(medication.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicationTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Horário</Label>
                    <Select 
                      value={medication.schedule} 
                      onValueChange={(value) => handleMedicationChange(medication.id, 'schedule', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {medication.schedule === 'custom' && (
                    <div>
                      <Label>Horário Personalizado</Label>
                      <Input
                        type="time"
                        value={medication.customTime}
                        onChange={(e) => handleMedicationChange(medication.id, 'customTime', e.target.value)}
                        placeholder="HH:MM"
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <Label>Observação</Label>
                    <Textarea
                      value={medication.observation}
                      onChange={(e) => handleMedicationChange(medication.id, 'observation', e.target.value)}
                      placeholder="Observações especiais (ex: tomar com alimento, jejum)"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button onClick={addMedication} variant="outline" className="w-full">
              <Plus size={16} className="mr-2" />
              Adicionar Medicamento
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={generatePrescription} 
              className="bg-heal-green-600 hover:bg-heal-green-700"
              disabled={!patientData.name || medications.filter(med => med.name.trim() !== '').length === 0}
            >
              <FileText size={16} className="mr-2" />
              Gerar Receita PDF
            </Button>
            <Button 
              onClick={downloadPrescription} 
              variant="outline"
              disabled={!patientData.name || medications.filter(med => med.name.trim() !== '').length === 0}
            >
              <Download size={16} className="mr-2" />
              Baixar PDF
            </Button>
            <Button 
              onClick={printPrescription} 
              variant="outline"
              disabled={!patientData.name || medications.filter(med => med.name.trim() !== '').length === 0}
            >
              <Printer size={16} className="mr-2" />
              Imprimir PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PictogramPrescription;
