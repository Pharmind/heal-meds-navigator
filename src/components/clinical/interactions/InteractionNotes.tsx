
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface InteractionNotesProps {
  notes: string;
  onUpdate: (notes: string) => void;
}

const InteractionNotes = ({ notes, onUpdate }: InteractionNotesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observações</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="Observações adicionais sobre o paciente ou as interações encontradas..."
          rows={4}
        />
      </CardContent>
    </Card>
  );
};

export default InteractionNotes;
