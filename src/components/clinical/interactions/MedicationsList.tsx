
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface MedicationsListProps {
  medications: string[];
  onUpdate: (medications: string[]) => void;
}

const MedicationsList = ({ medications, onUpdate }: MedicationsListProps) => {
  const addMedicationField = () => {
    if (medications.length < 20) {
      onUpdate([...medications, '']);
    }
  };

  const removeMedicationField = (index: number) => {
    if (medications.length > 2) {
      onUpdate(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, value: string) => {
    const updated = [...medications];
    updated[index] = value;
    onUpdate(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Medicamentos em Uso
          <Button onClick={addMedicationField} disabled={medications.length >= 20} size="sm">
            <Plus size={16} className="mr-1" />
            Adicionar
          </Button>
        </CardTitle>
        <CardDescription>
          Adicione de 2 a 20 medicamentos para verificar interações (máximo: {medications.length}/20)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {medications.map((medication, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1">
                <Label htmlFor={`med-${index}`}>Medicamento {index + 1}</Label>
                <Input
                  id={`med-${index}`}
                  value={medication}
                  onChange={(e) => updateMedication(index, e.target.value)}
                  placeholder="Nome do medicamento ou princípio ativo"
                />
              </div>
              {medications.length > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeMedicationField(index)}
                  className="mt-6"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationsList;
