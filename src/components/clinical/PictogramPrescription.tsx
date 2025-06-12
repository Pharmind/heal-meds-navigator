
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Download, Printer, FileText, Sun, Moon, Pill } from 'lucide-react';

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
      observation: ''
    }
  ]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const medicationTypes = ['Comprimido', 'Cápsula', 'Xarope', 'Gotas', 'Injetável', 'Pomada', 'Spray', 'Supositório'];
  const scheduleOptions = [
    { value: '08:00', label: '08:00 ☀️', icon: '☀️' },
    { value: '12:00', label: '12:00 ☀️', icon: '☀️' },
    { value: '18:00', label: '18:00 🌙', icon: '🌙' },
    { value: '22:00', label: '22:00 🌙', icon: '🌙' },
    { value: '06:00', label: '06:00 ☀️', icon: '☀️' },
    { value: '14:00', label: '14:00 ☀️', icon: '☀️' },
    { value: '20:00', label: '20:00 🌙', icon: '🌙' }
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
    const prescriptionContent = `
      RECEITA EM PICTOGRAMA
      
      DADOS DO PACIENTE:
      Nome: ${patientData.name}
      Idade: ${patientData.age}
      Alergia: ${patientData.allergy || 'Nenhuma'}
      Tipo Sanguíneo: ${patientData.bloodType}
      Contato de Emergência: ${patientData.emergencyContact}
      
      MEDICAMENTOS DE USO CONTÍNUO:
      ${medications.map((med, index) => `
        ${index + 1}. ${med.name}
           Concentração: ${med.concentration}
           Tipo: ${med.type}
           Horário: ${med.schedule}
           Observação: ${med.observation}
      `).join('\n')}
      
      Data: ${new Date().toLocaleDateString('pt-BR')}
    `;
    
    console.log('Receita gerada:', prescriptionContent);
    alert('Receita gerada! Verifique o console para ver o conteúdo.');
  };

  const downloadPrescription = () => {
    const prescriptionContent = `RECEITA EM PICTOGRAMA\n\nDADOS DO PACIENTE:\nNome: ${patientData.name}\nIdade: ${patientData.age}\nAlergia: ${patientData.allergy || 'Nenhuma'}\nTipo Sanguíneo: ${patientData.bloodType}\nContato de Emergência: ${patientData.emergencyContact}\n\nMEDICAMENTOS DE USO CONTÍNUO:\n${medications.map((med, index) => `${index + 1}. ${med.name}\n   Concentração: ${med.concentration}\n   Tipo: ${med.type}\n   Horário: ${med.schedule}\n   Observação: ${med.observation}`).join('\n\n')}\n\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    
    const blob = new Blob([prescriptionContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receita_pictograma_${patientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printPrescription = () => {
    window.print();
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

      {/* Medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="text-blue-600" size={24} />
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
            <Button onClick={generatePrescription} className="bg-heal-green-600 hover:bg-heal-green-700">
              <FileText size={16} className="mr-2" />
              Gerar Receita
            </Button>
            <Button onClick={downloadPrescription} variant="outline">
              <Download size={16} className="mr-2" />
              Baixar
            </Button>
            <Button onClick={printPrescription} variant="outline">
              <Printer size={16} className="mr-2" />
              Imprimir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PictogramPrescription;
