
import { Medication, Material, Diet } from '../types/heal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, Package, UtensilsCrossed } from 'lucide-react';

interface SearchResultsProps {
  medications: Medication[];
  materials: Material[];
  diets: Diet[];
  onMedicationClick: (medication: Medication) => void;
  searchQuery: string;
}

const SearchResults = ({ 
  medications, 
  materials, 
  diets, 
  onMedicationClick, 
  searchQuery 
}: SearchResultsProps) => {
  // Only show results if there's an active search query
  if (!searchQuery.trim()) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Pesquisar item Padronizado
          </h3>
          <p className="text-gray-500">
            Use a barra de pesquisa acima para encontrar medicamentos, materiais e dietas
          </p>
        </div>
      </div>
    );
  }

  const totalResults = medications.length + materials.length + diets.length;

  if (totalResults === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            ITEM NÃO PADRONIZADO
          </h3>
          <p className="text-gray-500">
            Tente pesquisar com outros termos ou verifique a ortografia
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600">
          Encontrados <span className="font-semibold">{totalResults}</span> resultados para "{searchQuery}"
        </p>
      </div>

      {/* Medications */}
      {medications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="text-blue-600" size={24} />
              Medicamentos ({medications.length})
            </CardTitle>
            <CardDescription>
              Medicamentos encontrados na pesquisa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {medications.map((medication) => (
                <div key={medication.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-lg">{medication.name}</h4>
                    <Badge variant="secondary">{medication.mvCode}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{medication.therapeuticClass}</p>
                  <p className="text-sm text-gray-500 mb-3">{medication.presentation}</p>
                  <Button 
                    onClick={() => onMedicationClick(medication)}
                    size="sm"
                    className="w-full"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials */}
      {materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="text-green-600" size={24} />
              Materiais ({materials.length})
            </CardTitle>
            <CardDescription>
              Materiais médicos encontrados na pesquisa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <div key={material.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-lg">{material.name}</h4>
                    <Badge variant="secondary">{material.mvCode}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{material.observation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diets */}
      {diets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="text-orange-600" size={24} />
              Dietas ({diets.length})
            </CardTitle>
            <CardDescription>
              Dietas encontradas na pesquisa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {diets.map((diet) => (
                <div key={diet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-lg">{diet.name}</h4>
                    <Badge variant="secondary">{diet.mvCode}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{diet.observation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchResults;
