
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AntibioticSelectionProps {
  selectedAntibiotic: string;
  setSelectedAntibiotic: (antibiotic: string) => void;
  antibiotics: string[];
  disabled: boolean;
}

const AntibioticSelection: React.FC<AntibioticSelectionProps> = ({
  selectedAntibiotic,
  setSelectedAntibiotic,
  antibiotics,
  disabled
}) => {
  return (
    <Select 
      value={selectedAntibiotic} 
      onValueChange={setSelectedAntibiotic}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione o antibiótico" />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        {antibiotics.map((antibiotic) => (
          <SelectItem key={antibiotic} value={antibiotic}>{antibiotic}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AntibioticSelection;
