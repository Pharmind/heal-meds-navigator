
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '../components/AppSidebar';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import { useAllData } from '../hooks/useSupabaseData';
import { Medication } from '../types/heal';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'medications' | 'materials' | 'diets'>('all');
  
  const { medications, materials, diets, isLoading, error } = useAllData();

  // Filtrar dados baseado na pesquisa e categoria
  const filteredData = useMemo(() => {
    let filteredMeds = medications;
    let filteredMats = materials;
    let filteredDiets = diets;

    // Filtrar por categoria
    if (selectedCategory === 'medications') {
      filteredMats = [];
      filteredDiets = [];
    } else if (selectedCategory === 'materials') {
      filteredMeds = [];
      filteredDiets = [];
    } else if (selectedCategory === 'diets') {
      filteredMeds = [];
      filteredMats = [];
    }

    // Filtrar por pesquisa
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      filteredMeds = filteredMeds.filter(med => 
        med.name.toLowerCase().includes(query) ||
        med.mvCode.toLowerCase().includes(query) ||
        med.therapeuticClass.toLowerCase().includes(query) ||
        med.indication.toLowerCase().includes(query)
      );

      filteredMats = filteredMats.filter(mat => 
        mat.name.toLowerCase().includes(query) ||
        mat.mvCode.toLowerCase().includes(query) ||
        mat.observation.toLowerCase().includes(query)
      );

      filteredDiets = filteredDiets.filter(diet => 
        diet.name.toLowerCase().includes(query) ||
        diet.mvCode.toLowerCase().includes(query) ||
        diet.observation.toLowerCase().includes(query)
      );
    }

    return {
      medications: filteredMeds,
      materials: filteredMats,
      diets: filteredDiets
    };
  }, [medications, materials, diets, searchQuery, selectedCategory]);

  const handleMedicationClick = (medication: Medication) => {
    navigate(`/medicamento/${medication.id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-heal-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar dados</h2>
          <p className="text-gray-600">Verifique a conexão com o banco de dados</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-heal-green-50">
        <AppSidebar 
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger className="lg:hidden" />
              <div className="text-center flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-heal-green-800 mb-2">
                  Sistema HEAL
                </h1>
                <p className="text-lg text-heal-green-600">
                  Hospital Estadual de Águas Lindas de Goiás
                </p>
                <p className="text-sm text-heal-green-500 mt-1">
                  Sistema de Pesquisa de Medicamentos, Materiais e Dietas
                </p>
              </div>
            </div>

            {/* Search Box */}
            <div className="mb-8 max-w-2xl mx-auto">
              <SearchBox onSearch={setSearchQuery} />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="bg-heal-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <div className="w-6 h-6 bg-heal-green-400 rounded-full"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-700">Carregando dados...</h3>
              </div>
            )}

            {/* Results */}
            {!isLoading && (
              <SearchResults
                medications={filteredData.medications}
                materials={filteredData.materials}
                diets={filteredData.diets}
                onMedicationClick={handleMedicationClick}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
