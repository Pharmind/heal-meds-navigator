
import { Medication, Material, Diet } from '../types/heal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, Package, UtensilsCrossed, Search, TrendingUp, ImageIcon } from 'lucide-react';
import DietImageDialog from './DietImageDialog';

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
      <div className="text-center py-16">
        <div className="max-w-lg mx-auto">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-heal-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
            <div className="relative text-8xl mb-6">🔍</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Pesquisar Item Padronizado
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Use a barra de pesquisa acima para encontrar medicamentos, materiais e dietas
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex items-center text-sm text-heal-green-600 bg-heal-green-50 px-3 py-1 rounded-full">
              <Pill size={16} className="mr-1" />
              Medicamentos
            </div>
            <div className="flex items-center text-sm text-heal-green-600 bg-heal-green-50 px-3 py-1 rounded-full">
              <Package size={16} className="mr-1" />
              Materiais
            </div>
            <div className="flex items-center text-sm text-heal-green-600 bg-heal-green-50 px-3 py-1 rounded-full">
              <UtensilsCrossed size={16} className="mr-1" />
              Dietas
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalResults = medications.length + materials.length + diets.length;

  if (totalResults === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-lg mx-auto">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
            <div className="relative text-8xl mb-6">😔</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            ITEM NÃO PADRONIZADO
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Tente pesquisar com outros termos ou verifique a ortografia
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Results Summary */}
      <div className="text-center">
        <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-heal-green-100">
          <TrendingUp className="text-heal-green-600 mr-2" size={20} />
          <p className="text-gray-700 font-medium">
            Encontrados <span className="font-bold text-heal-green-600">{totalResults}</span> resultados para 
            <span className="font-semibold text-gray-800"> "{searchQuery}"</span>
          </p>
        </div>
      </div>

      {/* Medications */}
      {medications.length > 0 && (
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <Pill size={24} />
              </div>
              Medicamentos ({medications.length})
            </CardTitle>
            <CardDescription className="text-blue-100">
              Medicamentos padronizados encontrados na pesquisa
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {medications.map((medication) => (
                <div key={medication.id} className="group border border-blue-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-white hover:border-blue-300 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">{medication.name}</h4>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">{medication.mvCode}</Badge>
                  </div>
                  <p className="text-sm text-blue-600 font-medium mb-2">{medication.therapeuticClass}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{medication.presentation}</p>
                  <Button 
                    onClick={() => onMedicationClick(medication)}
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
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
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package size={24} />
              </div>
              Materiais ({materials.length})
            </CardTitle>
            <CardDescription className="text-green-100">
              Materiais médicos padronizados encontrados na pesquisa
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <div key={material.id} className="group border border-green-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-white hover:border-green-300 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg text-gray-800 group-hover:text-green-600 transition-colors">{material.name}</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">{material.mvCode}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{material.observation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diets */}
      {diets.length > 0 && (
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <UtensilsCrossed size={24} />
              </div>
              Dietas ({diets.length})
            </CardTitle>
            <CardDescription className="text-orange-100">
              Dietas padronizadas encontradas na pesquisa
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {diets.map((diet) => (
                <div key={diet.id} className="group border border-orange-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-white hover:border-orange-300 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg text-gray-800 group-hover:text-orange-600 transition-colors">{diet.name}</h4>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">{diet.mvCode}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{diet.observation}</p>
                  
                  {/* Image Section */}
                  {diet.imageUrl ? (
                    <div className="mb-4">
                      <DietImageDialog imageUrl={diet.imageUrl} dietName={diet.name}>
                        <div className="cursor-pointer group/image">
                          <img 
                            src={diet.imageUrl} 
                            alt={diet.name}
                            className="w-full h-32 object-cover rounded-md group-hover/image:opacity-80 transition-opacity"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="hidden w-full h-32 bg-gray-100 rounded-md items-center justify-center"
                          >
                            <ImageIcon className="text-gray-400" size={24} />
                          </div>
                          <p className="text-xs text-orange-600 mt-2 text-center">Clique para ampliar</p>
                        </div>
                      </DietImageDialog>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                        <ImageIcon className="text-gray-400" size={24} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">Imagem não disponível</p>
                    </div>
                  )}
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
