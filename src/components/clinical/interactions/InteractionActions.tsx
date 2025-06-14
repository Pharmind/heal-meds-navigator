
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface InteractionActionsProps {
  onSave: () => void;
  onGenerateReport: () => void;
  isSaving: boolean;
}

const InteractionActions = ({ onSave, onGenerateReport, isSaving }: InteractionActionsProps) => {
  return (
    <div className="flex gap-4 justify-center">
      <Button onClick={onSave} disabled={isSaving}>
        <FileText size={16} className="mr-2" />
        Salvar Verificação
      </Button>
      
      <Button onClick={onGenerateReport} variant="outline">
        <Download size={16} className="mr-2" />
        Gerar Relatório PDF
      </Button>
    </div>
  );
};

export default InteractionActions;
