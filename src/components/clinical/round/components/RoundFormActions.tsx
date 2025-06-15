
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Printer, RefreshCw } from 'lucide-react';

interface RoundFormActionsProps {
  isLoading: boolean;
  onClearForm: () => void;
  onPrint: () => void;
  onSubmit: () => void;
}

export const RoundFormActions: React.FC<RoundFormActionsProps> = ({
  isLoading,
  onClearForm,
  onPrint,
  onSubmit
}) => {
  return (
    <div className="flex justify-center gap-4 p-6 bg-gray-50 rounded-lg">
      <Button onClick={onClearForm} variant="outline">
        <RefreshCw size={18} className="mr-2" />
        Limpar Formulário
      </Button>
      <Button onClick={onPrint} variant="outline">
        <Printer size={18} className="mr-2" />
        Imprimir Checklist
      </Button>
      <Button onClick={onSubmit} disabled={isLoading} className="px-8">
        <Save size={18} className="mr-2" />
        {isLoading ? 'Salvando...' : 'Salvar Round Completo'}
      </Button>
    </div>
  );
};
