
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Download, Printer, Sun, Moon, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Medication {
  id: string;
  name: string;
  concentration: string;
  type: string;
  schedule: string[];
  observation: string;
}

interface PatientData {
  name: string;
  age: string;
  allergies: string;
  bloodType: string;
  emergencyContact: string;
}

const PictogramPrescription = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    allergies: '',
    bloodType: '',
    emergencyContact: ''
  });

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: '',
      concentration: '',
      type: '',
      schedule: [],
      observation: ''
    }
  ]);

  const medicationTypes = [
    'Comprimido', 'Cápsula', 'Xarope', 'Gotas', 'Injetável', 
    'Pomada', 'Creme', 'Gel', 'Adesivo', 'Spray'
  ];

  const timeSlots = [
    { time: '06:00', icon: Sun, label: 'Manhã' },
    { time: '08:00', icon: Sun, label: 'Manhã' },
    { time: '12:00', icon: Sun, label: 'Almoço' },
    { time: '14:00', icon: Sun, label: 'Tarde' },
    { time: '18:00', icon: Sun, label: 'Jantar' },
    { time: '20:00', icon: Moon, label: 'Noite' },
    { time: '22:00', icon: Moon, label: 'Noite' }
  ];

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      concentration: '',
      type: '',
      schedule: [],
      observation: ''
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const updateMedication = (id: string, field: keyof Medication, value: any) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const toggleTimeSlot = (medicationId: string, time: string) => {
    const medication = medications.find(med => med.id === medicationId);
    if (medication) {
      const newSchedule = medication.schedule.includes(time)
        ? medication.schedule.filter(t => t !== time)
        : [...medication.schedule, time].sort();
      updateMedication(medicationId, 'schedule', newSchedule);
    }
  };

  const generatePrescription = () => {
    // Lógica para gerar a receita (implementar posteriormente)
    console.log('Gerando receita:', { patientData, medications });
  };

  const downloadPrescription = () => {
    // Lógica para download (implementar posteriormente)
    console.log('Download da receita');
  };

  const printPrescription = () => {
    // Lógica para impressão (implementar posteriormente)
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Receita em Pictograma</h2>
        <p className="text-gray-600">Crie receitas visuais para facilitar o entendimento do paciente</p>
      </div>

      {/* Dados do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="text-blue-600" size={24} />
            Dados do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="patientName">Nome Completo</Label>
              <Input
                id="patientName"
                value={patientData.name}
                onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                placeholder="Nome do paciente"
              />
            </div>
            <div>
              <Label htmlFor="patientAge">Idade</Label>
              <Input
                id="patientAge"
                value={patientData.age}
                onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                placeholder="Idade"
              />
            </div>
            <div>
              <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
              <Select onValueChange={(value) => setPatientData({...patientData, bloodType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="allergies">Alergias</Label>
              <Input
                id="allergies"
                value={patientData.allergies}
                onChange={(e) => setPatientData({...patientData, allergies: e.target.value})}
                placeholder="Alergias conhecidas"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="emergencyContact">Contato de Emergência</Label>
              <Input
                id="emergencyContact"
                value={patientData.emergencyContact}
                onChange={(e) => setPatientData({...patientData, emergencyContact: e.target.value})}
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
            <span className="flex items-center gap-2">
              <Pill className="text-green-600" size={24} />
              Medicamentos de Uso Contínuo
            </span>
            <Button onClick={addMedication} size="sm" className="bg-heal-green-600 hover:bg-heal-green-700">
              <Plus size={16} className="mr-2" />
              Adicionar Medicamento
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {medications.map((medication, index) => (
              <div key={medication.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Medicamento {index + 1}</h4>
                  {medications.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMedication(medication.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Nome do Medicamento</Label>
                    <Input
                      value={medication.name}
                      onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                      placeholder="Nome do medicamento"
                    />
                  </div>
                  <div>
                    <Label>Concentração</Label>
                    <Input
                      value={medication.concentration}
                      onChange={(e) => updateMedication(medication.id, 'concentration', e.target.value)}
                      placeholder="Ex: 500mg, 10ml"
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select onValueChange={(value) => updateMedication(medication.id, 'type', value)}>
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
                </div>

                <div className="mb-4">
                  <Label className="block mb-3">Horários de Administração</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {timeSlots.map(({ time, icon: Icon, label }) => {
                      const isSelected = medication.schedule.includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => toggleTimeSlot(medication.id, time)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            isSelected 
                              ? 'bg-heal-green-100 border-heal-green-400 text-heal-green-800' 
                              : 'bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={20} className="mx-auto mb-1" />
                          <div className="text-xs font-medium">{time}</div>
                          <div className="text-xs text-gray-500">{label}</div>
                        </button>
                      );
                    })}
                  </div>
                  {medication.schedule.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {medication.schedule.map(time => (
                        <Badge key={time} variant="secondary">{time}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Observações</Label>
                  <Textarea
                    value={medication.observation}
                    onChange={(e) => updateMedication(medication.id, 'observation', e.target.value)}
                    placeholder="Observações especiais (ex: tomar com água, após refeição)"
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={generatePrescription}
          className="bg-heal-green-600 hover:bg-heal-green-700"
          size="lg"
        >
          <Image size={20} className="mr-2" />
          Gerar Receita
        </Button>
        <Button 
          onClick={downloadPrescription}
          variant="outline"
          size="lg"
          className="border-heal-green-600 text-heal-green-600 hover:bg-heal-green-50"
        >
          <Download size={20} className="mr-2" />
          Baixar PDF
        </Button>
        <Button 
          onClick={printPrescription}
          variant="outline"
          size="lg"
          className="border-heal-green-600 text-heal-green-600 hover:bg-heal-green-50"
        >
          <Printer size={20} className="mr-2" />
          Imprimir
        </Button>
      </div>
    </div>
  );
};

export default PictogramPrescription;
