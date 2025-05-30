
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import CategoryTable from '../components/CategoryTable';
import IntoxicationSection from '../components/clinical/IntoxicationSection';
import HighAlertSection from '../components/clinical/HighAlertSection';
import ElderlySection from '../components/clinical/ElderlySection';
import ClinicalPharmacy from '../components/ClinicalPharmacy';
import AppSidebar from '../components/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useAllData } from '../hooks/useSupabaseData';
import { Medication } from '../types/heal';
import { Menu, Pill } from 'lucide-react';

type SectionType = 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'pharmacovigilance' | 'cft' | 'protocols';

const Index = () => {
  const navigate = useNavigate();
  const { medications, materials, diets } = useAllData();
  const [searchResults, setSearchResults] = useState<{
    medications: Medication[];
    materials: any[];
    diets: any[];
  }>({ medications: [], materials: [], diets: [] });
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<SectionType>('search');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults({ medications: [], materials: [], diets: [] });
      setHasSearched(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    
    const filteredMedications = medications.filter(med => 
      med.name.toLowerCase().includes(searchTerm) ||
      med.mvCode.toLowerCase().includes(searchTerm) ||
      med.therapeuticClass.toLowerCase().includes(searchTerm)
    );

    const filteredMaterials = materials.filter(mat => 
      mat.name.toLowerCase().includes(searchTerm) ||
      mat.mvCode.toLowerCase().includes(searchTerm)
    );

    const filteredDiets = diets.filter(diet => 
      diet.name.toLowerCase().includes(searchTerm) ||
      diet.mvCode.toLowerCase().includes(searchTerm)
    );

    setSearchResults({
      medications: filteredMedications,
      materials: filteredMaterials,
      diets: filteredDiets
    });
    setHasSearched(true);
  };

  const handleSectionChange = (section: SectionType) => {
    setSelectedSection(section);
    // Reset search when changing sections
    setHasSearched(false);
    setSearchResults({ medications: [], materials: [], diets: [] });
    setSearchQuery('');
  };

  const handleMedicationClick = (medication: Medication) => {
    navigate(`/medication/${medication.id}`);
  };

  const renderMainContent = () => {
    switch (selectedSection) {
      case 'search':
        return (
          <>
            <div className="w-full max-w-2xl mx-auto mb-6">
              <SearchBox onSearch={handleSearch} />
            </div>
            <div className="w-full">
              {hasSearched ? (
                <SearchResults
                  medications={searchResults.medications}
                  materials={searchResults.materials}
                  diets={searchResults.diets}
                  onMedicationClick={handleMedicationClick}
                  searchQuery={searchQuery}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="bg-heal-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Menu className="text-heal-green-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-heal-green-800 mb-4">
                    Bem-vindo ao Guia Farmacêutico HEAL
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Use a barra de pesquisa acima para encontrar medicamentos, materiais e dietas, 
                    ou navegue pelas seções no menu lateral.
                  </p>
                </div>
              )}
            </div>
          </>
        );
      
      case 'medications':
        return (
          <CategoryTable
            category="medications"
            medications={medications}
            materials={materials}
            diets={diets}
            onMedicationClick={handleMedicationClick}
          />
        );
      
      case 'materials':
        return (
          <CategoryTable
            category="materials"
            medications={medications}
            materials={materials}
            diets={diets}
            onMedicationClick={handleMedicationClick}
          />
        );
      
      case 'diets':
        return (
          <CategoryTable
            category="diets"
            medications={medications}
            materials={materials}
            diets={diets}
            onMedicationClick={handleMedicationClick}
          />
        );
      
      case 'intoxication':
        return <IntoxicationSection />;
      
      case 'high-alert':
        return <HighAlertSection />;
      
      case 'elderly':
        return <ElderlySection />;
      
      case 'pharmacovigilance':
      case 'cft':
      case 'protocols':
        return <ClinicalPharmacy activeTab={selectedSection} />;
      
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar 
          onSectionChange={handleSectionChange}
          selectedSection={selectedSection}
        />
        
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-heal-green-200 bg-white px-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <SidebarTrigger className="h-10 w-10 bg-heal-green-600 text-white hover:bg-heal-green-700 rounded-lg shadow-md">
                  <Menu size={20} />
                </SidebarTrigger>
              </div>
              
              <div className="hidden md:block">
                <SidebarTrigger className="h-8 w-8 text-heal-green-600 hover:bg-heal-green-100 rounded-md" />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-heal-green-600 p-2 rounded-lg">
                  <Pill className="text-white" size={24} />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-heal-green-800 md:text-xl">
                    Guia Farmacêutico - HEAL
                  </h1>
                  <p className="text-xs text-heal-green-600 md:text-sm">
                    Hospital Estadual de Águas Lindas
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Conteúdo principal */}
          <main className="flex-1 p-4 md:p-6">
            {renderMainContent()}
          </main>

          {/* Rodapé */}
          <footer className="border-t border-heal-green-200 bg-white px-4 py-6 md:px-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sistema desenvolvido pelo <span className="font-semibold text-heal-green-700">Farmacêutico Clínico Fernando Carneiro</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Hospital Estadual de Águas Lindas - GO
              </p>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
