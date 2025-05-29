
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import { medications, materials, diets } from '../data/healData';
import { Medication, Material, Diet } from '../types/heal';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'medications' | 'materials' | 'diets'>('all');
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    const filterMedications = (meds: Medication[]) =>
      meds.filter(med => 
        med.name.toLowerCase().includes(query) ||
        med.mvCode.toLowerCase().includes(query) ||
        med.therapeuticClass.toLowerCase().includes(query) ||
        med.indication.toLowerCase().includes(query)
      );

    const filterMaterials = (mats: Material[]) =>
      mats.filter(mat => 
        mat.name.toLowerCase().includes(query) ||
        mat.mvCode.toLowerCase().includes(query) ||
        mat.observation.toLowerCase().includes(query)
      );

    const filterDiets = (diets: Diet[]) =>
      diets.filter(diet => 
        diet.name.toLowerCase().includes(query) ||
        diet.mvCode.toLowerCase().includes(query) ||
        diet.observation.toLowerCase().includes(query)
      );

    switch (selectedCategory) {
      case 'medications':
        return {
          medications: filterMedications(medications),
          materials: [],
          diets: []
        };
      case 'materials':
        return {
          medications: [],
          materials: filterMaterials(materials),
          diets: []
        };
      case 'diets':
        return {
          medications: [],
          materials: [],
          diets: filterDiets(diets)
        };
      default:
        return {
          medications: filterMedications(medications),
          materials: filterMaterials(materials),
          diets: filterDiets(diets)
        };
    }
  }, [searchQuery, selectedCategory]);

  const handleMedicationClick = (medication: Medication) => {
    navigate(`/medicamento/${medication.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-heal-green-50 via-heal-green-100 to-heal-green-200">
      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar 
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* Header */}
            <div className="text-center mb-12 mt-16 lg:mt-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-heal-green-800 mb-4">
                Sistema HEAL
              </h1>
              <p className="text-xl text-heal-green-600 mb-2">
                Hospital Estadual de Águas Lindas de Goiás
              </p>
              <p className="text-heal-green-500 mb-8">
                Pesquisa de Medicamentos, Materiais e Dietas
              </p>
              
              {/* Search Box */}
              <SearchBox 
                onSearch={setSearchQuery}
                placeholder="Pesquisar por nome, código MV ou classe terapêutica..."
              />
            </div>

            {/* Results */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-heal-green-200 p-6 lg:p-8">
              {searchQuery || selectedCategory !== 'all' ? (
                <SearchResults
                  medications={filteredData.medications}
                  materials={filteredData.materials}
                  diets={filteredData.diets}
                  onMedicationClick={handleMedicationClick}
                  searchQuery={searchQuery}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="bg-heal-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <div className="text-heal-green-600 text-2xl font-bold">HEAL</div>
                  </div>
                  <h2 className="text-2xl font-semibold text-heal-green-800 mb-4">
                    Bem-vindo ao Sistema de Pesquisa HEAL
                  </h2>
                  <p className="text-heal-green-600 mb-6 max-w-2xl mx-auto">
                    Utilize a barra de pesquisa acima ou selecione uma categoria no menu lateral 
                    para encontrar informações sobre medicamentos, materiais e dietas padronizados 
                    pelo hospital.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
                    <button
                      onClick={() => setSelectedCategory('medications')}
                      className="p-6 bg-white rounded-lg shadow-md border border-heal-green-200 hover:border-heal-green-400 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="text-heal-green-600 text-xl font-semibold mb-2">Medicamentos</div>
                      <div className="text-sm text-gray-600">Informações detalhadas sobre medicamentos</div>
                    </button>
                    <button
                      onClick={() => setSelectedCategory('materials')}
                      className="p-6 bg-white rounded-lg shadow-md border border-heal-green-200 hover:border-heal-green-400 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="text-heal-green-600 text-xl font-semibold mb-2">Materiais</div>
                      <div className="text-sm text-gray-600">Catálogo de materiais hospitalares</div>
                    </button>
                    <button
                      onClick={() => setSelectedCategory('diets')}
                      className="p-6 bg-white rounded-lg shadow-md border border-heal-green-200 hover:border-heal-green-400 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="text-heal-green-600 text-xl font-semibold mb-2">Dietas</div>
                      <div className="text-sm text-gray-600">Dietas padronizadas pelo hospital</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
