
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Save, Printer, RefreshCw } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface RoundFormHeaderProps {
  formData: RoundFormData;
  isLoading: boolean;
  onRoundTypeChange: (type: 'Adulto' | 'Neonatal' | 'Pediátrica') => void;
  onDateChange: (date: string) => void;
  onClearForm: () => void;
  onPrint: () => void;
  onSubmit: () => void;
}

export const RoundFormHeader: React.FC<RoundFormHeaderProps> = ({
  formData,
  isLoading,
  onRoundTypeChange,
  onDateChange,
  onClearForm,
  onPrint,
  onSubmit
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-blue-50 rounded-lg">
      <div>
        <h2 className="text-xl font-semibold text-blue-900">Checklist Round Multiprofissional UTI</h2>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex gap-2">
            {(['Adulto', 'Neonatal', 'Pediátrica'] as const).map((type) => (
              <Badge
                key={type}
                variant={formData.round_type === type ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onRoundTypeChange(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Data:</label>
            <input
              type="date"
              value={formData.round_date}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onClearForm} variant="outline" size="sm">
          <RefreshCw size={16} className="mr-1" />
          Limpar
        </Button>
        <Button onClick={onPrint} variant="outline" size="sm">
          <Printer size={16} className="mr-1" />
          Imprimir
        </Button>
        <Button onClick={onSubmit} disabled={isLoading} size="sm">
          <Save size={16} className="mr-1" />
          {isLoading ? 'Salvando...' : 'Salvar Round'}
        </Button>
      </div>
    </div>
  );
};
