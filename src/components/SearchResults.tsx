
import { Pill, Package, UtensilsCrossed, ChevronRight, Calendar } from 'lucide-react';
import { Medication, Material, Diet } from '../types/heal';
import { cn } from '@/lib/utils';

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
  const hasResults = medications.length > 0 || materials.length > 0 || diets.length > 0;

  if (!hasResults && searchQuery) {
    return (
      <div className="text-center py-12">
        <div className="bg-heal-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Pill className="text-heal-green-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum resultado encontrado</h3>
        <p className="text-gray-500">Tente ajustar sua pesquisa ou use termos diferentes</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Medicamentos */}
      {medications.length > 0 && (
        <section>
          <h2 className="flex items-center text-xl font-semibold text-heal-green-800 mb-4">
            <Pill className="mr-2" size={24} />
            Medicamentos ({medications.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {medications.map((medication) => (
              <div
                key={medication.id}
                onClick={() => onMedicationClick(medication)}
                className="bg-white rounded-lg shadow-md border border-heal-green-200 p-4 cursor-pointer hover:shadow-lg hover:border-heal-green-400 transition-all duration-200 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-heal-green-100 text-heal-green-800 text-xs font-medium px-2 py-1 rounded">
                    {medication.mvCode}
                  </span>
                  <ChevronRight 
                    className="text-heal-green-400 group-hover:text-heal-green-600 transition-colors" 
                    size={16} 
                  />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {medication.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                  {medication.presentation}
                </p>
                <p className="text-xs text-heal-green-600 font-medium">
                  {medication.therapeuticClass}
                </p>
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  {medication.lastUpdate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Materiais */}
      {materials.length > 0 && (
        <section>
          <h2 className="flex items-center text-xl font-semibold text-heal-green-800 mb-4">
            <Package className="mr-2" size={24} />
            Materiais ({materials.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-lg shadow-md border border-heal-green-200 p-4 hover:shadow-lg hover:border-heal-green-400 transition-all duration-200"
              >
                <div className="mb-3">
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                    {material.mvCode}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {material.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {material.observation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dietas */}
      {diets.length > 0 && (
        <section>
          <h2 className="flex items-center text-xl font-semibold text-heal-green-800 mb-4">
            <UtensilsCrossed className="mr-2" size={24} />
            Dietas ({diets.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {diets.map((diet) => (
              <div
                key={diet.id}
                className="bg-white rounded-lg shadow-md border border-heal-green-200 p-4 hover:shadow-lg hover:border-heal-green-400 transition-all duration-200"
              >
                <div className="mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {diet.mvCode}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {diet.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {diet.observation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
