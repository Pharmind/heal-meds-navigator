
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, X } from 'lucide-react';
import { useMedications } from '@/hooks/useSupabaseData';

interface MedicationSearchProps {
  selectedMedications: string[];
  onMedicationAdd: (medication: string) => void;
  onMedicationRemove: (medication: string) => void;
}

const MedicationSearch = ({ selectedMedications, onMedicationAdd, onMedicationRemove }: MedicationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: medications = [], isLoading } = useMedications();

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedMedications.includes(med.name)
  ).slice(0, 10);

  const handleMedicationSelect = (medicationName: string) => {
    onMedicationAdd(medicationName);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-purple-800">
          Busca de Medicamentos
        </CardTitle>
        <p className="text-sm text-gray-600">
          Digite o nome do medicamento (de marca ou genérico) no campo de pesquisa. 
          Selecione o medicamento e clique no botão Adicionar.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Inserir termo de pesquisa..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                className="pl-10"
              />
            </div>
          </div>

          {showSuggestions && searchTerm.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-gray-500">Carregando...</div>
              ) : filteredMedications.length > 0 ? (
                filteredMedications.map((medication) => (
                  <div
                    key={medication.id}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleMedicationSelect(medication.name)}
                  >
                    <div className="font-medium">{medication.name}</div>
                    <div className="text-sm text-gray-600">{medication.presentation}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  Nenhum medicamento encontrado
                </div>
              )}
            </div>
          )}
        </div>

        {selectedMedications.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Medicamentos Selecionados ({selectedMedications.length}):</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedMedications.map((medication, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                  <span className="font-medium text-blue-800">{medication}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMedicationRemove(medication)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-100"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationSearch;
