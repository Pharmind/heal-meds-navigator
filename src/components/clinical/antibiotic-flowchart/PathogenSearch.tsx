
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface PathogenSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPathogen: string;
  setSelectedPathogen: (pathogen: string) => void;
  filteredPathogens: string[];
}

const PathogenSearch: React.FC<PathogenSearchProps> = ({
  searchTerm,
  setSearchTerm,
  selectedPathogen,
  setSelectedPathogen,
  filteredPathogens
}) => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Buscar patógeno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedPathogen} onValueChange={setSelectedPathogen}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o patógeno" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {filteredPathogens.map((pathogen) => (
            <SelectItem key={pathogen} value={pathogen}>{pathogen}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PathogenSearch;
