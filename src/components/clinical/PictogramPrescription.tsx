
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Download, Printer, FileText, Sun, Moon, Pill, Clock } from 'lucide-react';
import jsPDF from 'jspdf';

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

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const medicationTypes = ['Comprimido', 'Cápsula', 'Xarope', 'Gotas', 'Injetável', 'Pomada', 'Spray', 'Supositório'];
  const scheduleOptions = [
    { value: '06:00', label: '06:00 ☀️', icon: '☀️' },
    { value: '08:00', label: '08:00 ☀️', icon: '☀️' },
    { value: '10:00', label: '10:00 ☀️', icon: '☀️' },
    { value: '12:00', label: '12:00 ☀️', icon: '☀️' },
    { value: '14:00', label: '14:00 ☀️', icon: '☀️' },
    { value: '16:00', label: '16:00 ☀️', icon: '☀️' },
    { value: '18:00', label: '18:00 🌙', icon: '🌙' },
    { value: '20:00', label: '20:00 🌙', icon: '🌙' },
    { value: '22:00', label: '22:00 🌙', icon: '🌙' },
    { value: '00:00', label: '00:00 🌙', icon: '🌙' },
    { value: '02:00', label: '02:00 🌙', icon: '🌙' },
    { value: '04:00', label: '04:00 🌙', icon: '🌙' },
    { value: 'custom', label: 'Horário personalizado', icon: '🕐' }
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

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEITA EM PICTOGRAMA', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Hospital Estadual de Águas Lindas de Goiás - HEAL', 105, 30, { align: 'center' });
    
    // Patient data section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO PACIENTE', 20, 50);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let yPos = 60;
    
    doc.text(`Nome: ${patientData.name}`, 20, yPos);
    yPos += 8;
    doc.text(`Idade: ${patientData.age}`, 20, yPos);
    yPos += 8;
    doc.text(`Alergia: ${patientData.allergy || 'Nenhuma'}`, 20, yPos);
    yPos += 8;
    doc.text(`Tipo Sanguíneo: ${patientData.bloodType}`, 20, yPos);
    yPos += 8;
    doc.text(`Contato de Emergência: ${patientData.emergencyContact}`, 20, yPos);
    yPos += 15;
    
    // Medications section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAMENTOS DE USO CONTÍNUO', 20, yPos);
    yPos += 10;
    
    medications.forEach((med, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${med.name}`, 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Concentração: ${med.concentration}`, 25, yPos);
      yPos += 6;
      doc.text(`Tipo: ${med.type}`, 25, yPos);
      yPos += 6;
      
      const displayTime = med.schedule === 'custom' ? med.customTime : med.schedule;
      doc.text(`Horário: ${displayTime}`, 25, yPos);
      yPos += 6;
      
      if (med.observation) {
        doc.text(`Observação: ${med.observation}`, 25, yPos);
        yPos += 6;
      }
      yPos += 8;
    });
    
    // Footer
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, yPos + 20);
    doc.text('_'.repeat(40), 120, yPos + 40);
    doc.text('Assinatura do Farmacêutico', 120, yPos + 45);
    
    return doc;
  };

  const generatePrescription = () => {
    const doc = generatePDF();
    const prescriptionContent = doc.output('datauristring');
    
    // Open PDF in new window for preview
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<iframe width='100%' height='100%' src='${prescriptionContent}'></iframe>`);
    }
  };

  const downloadPrescription = () => {
    const doc = generatePDF();
    doc.save(`receita_pictograma_${patientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const printPrescription = () => {
    const doc = generatePDF();
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
            <Button onClick={generatePrescription} className="bg-heal-green-600 hover:bg-heal-green-700">
              <FileText size={16} className="mr-2" />
              Gerar Receita PDF
            </Button>
            <Button onClick={downloadPrescription} variant="outline">
              <Download size={16} className="mr-2" />
              Baixar PDF
            </Button>
            <Button onClick={printPrescription} variant="outline">
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
