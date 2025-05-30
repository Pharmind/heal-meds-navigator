
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '../components/AppSidebar';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import CategoryTable from '../components/CategoryTable';
import { useAllData } from '../hooks/useSupabaseData';
import { Medication } from '../types/heal';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'medications' | 'materials' | 'diets'>('all');
  
  const { medications, materials, diets, isLoading, error } = useAllData();

  // Filtrar dados baseado na pesquisa e categoria
  const filteredData = useMemo(() => {
    // Se há uma categoria específica selecionada (não 'all') e não há pesquisa, mostrar todos os itens da categoria
    if (selectedCategory !== 'all' && !searchQuery.trim()) {
      return {
        medications: selectedCategory === 'medications' ? medications : [],
        materials: selectedCategory === 'materials' ? materials : [],
        diets: selectedCategory === 'diets' ? diets : []
      };
    }

    // Se não há pesquisa e categoria é 'all', não mostrar nenhum resultado
    if (!searchQuery.trim()) {
      return {
        medications: [],
        materials: [],
        diets: []
      };
    }

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

    return {
      medications: filteredMeds,
      materials: filteredMats,
      diets: filteredDiets
    };
  }, [medications, materials, diets, searchQuery, selectedCategory]);

  const handleMedicationClick = (medication: Medication) => {
    navigate(`/medicamento/${medication.id}`);
  };

  // Determinar se deve mostrar tabela ou resultados de pesquisa
  const showTable = selectedCategory !== 'all' && !searchQuery.trim();
  const showSearchResults = searchQuery.trim();
  const showWelcome = selectedCategory === 'all' && !searchQuery.trim();

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
        
        <main className="flex-1 flex flex-col">
          <div className="flex-1">
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <SidebarTrigger className="h-8 w-8" />
                <div className="text-center flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-heal-green-800 mb-2">
                    Padronização HEAL
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

              {/* Welcome Message - shown when category is 'all' and no search */}
              {!isLoading && showWelcome && (
                <div className="text-center py-16">
                  <div className="bg-heal-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-heal-green-600 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-heal-green-800 mb-2">
                    Bem-vindo ao Sistema de Padronização HEAL
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Use o menu lateral para navegar pelas categorias ou digite na barra de pesquisa para encontrar itens específicos.
                  </p>
                </div>
              )}

              {/* Category Table - shown when a specific category is selected and no search */}
              {!isLoading && showTable && (
                <CategoryTable
                  category={selectedCategory}
                  medications={filteredData.medications}
                  materials={filteredData.materials}
                  diets={filteredData.diets}
                  onMedicationClick={handleMedicationClick}
                />
              )}

              {/* Search Results - shown when there's a search query */}
              {!isLoading && showSearchResults && (
                <SearchResults
                  medications={filteredData.medications}
                  materials={filteredData.materials}
                  diets={filteredData.diets}
                  onMedicationClick={handleMedicationClick}
                  searchQuery={searchQuery}
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-heal-green-800 text-white py-6 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm">
                Sistema desenvolvido pelo Farmacêutico Clínico <span className="font-semibold">Fernando Carneiro</span>
              </p>
              <p className="text-xs text-heal-green-200 mt-1">
                Hospital Estadual de Águas Lindas de Goiás - HEAL
              </p>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
