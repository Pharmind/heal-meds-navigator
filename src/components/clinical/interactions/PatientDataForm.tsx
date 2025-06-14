
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PatientData {
  name: string;
  age: string;
  pharmacist: string;
  notes: string;
}

interface PatientDataFormProps {
  patientData: PatientData;
  onUpdate: (data: PatientData) => void;
}

const PatientDataForm = ({ patientData, onUpdate }: PatientDataFormProps) => {
  const updateField = (field: keyof PatientData, value: string) => {
    onUpdate({ ...patientData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Paciente e Farmacêutico</CardTitle>
        <CardDescription>Informações opcionais para o relatório</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patient-name">Nome do Paciente</Label>
            <Input
              id="patient-name"
              value={patientData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Nome completo do paciente"
            />
          </div>
          <div>
            <Label htmlFor="patient-age">Idade</Label>
            <Input
              id="patient-age"
              value={patientData.age}
              onChange={(e) => updateField('age', e.target.value)}
              placeholder="Idade do paciente"
            />
          </div>
          <div>
            <Label htmlFor="pharmacist">Farmacêutico Responsável</Label>
            <Input
              id="pharmacist"
              value={patientData.pharmacist}
              onChange={(e) => updateField('pharmacist', e.target.value)}
              placeholder="Nome do farmacêutico"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDataForm;
