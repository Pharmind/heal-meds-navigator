
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import AppSidebar from '@/components/AppSidebar';
import SearchBox from '@/components/SearchBox';
import SearchResults from '@/components/SearchResults';
import CategoryTable from '@/components/CategoryTable';
import ClinicalPharmacy from '@/components/ClinicalPharmacy';
import IntoxicationSection from '@/components/clinical/IntoxicationSection';
import HighAlertSection from '@/components/clinical/HighAlertSection';
import ElderlySection from '@/components/clinical/ElderlySection';
import SequentialTherapySection from '@/components/clinical/SequentialTherapySection';
import UserMenu from '@/components/UserMenu';
import UserManagement from '@/components/UserManagement';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useNavigate } from 'react-router-dom';
import { Medication } from '@/types/heal';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type Section = 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation' | 'user-management';

const Index = () => {
  const { hasPermission, isFarmaceutico } = useAuth();
  const isMobile = useIsMobile();
  const [selectedSection, setSelectedSection] = useState<Section>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { medications, materials, diets } = useSupabaseData(searchQuery);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSectionChange = (section: Section) => {
    // Verificar se o usuário tem permissão para acessar a seção
    if (section === 'user-management') {
      if (isFarmaceutico) {
        setSelectedSection(section);
      }
    } else if (hasPermission(section)) {
      setSelectedSection(section);
    }
    
    // Fechar sidebar no mobile após seleção
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleUserManagementClick = () => {
    setSelectedSection('user-management');
  };

  const handleMedicationClick = (medication: Medication) => {
    navigate(`/medication/${medication.id}`);
  };

  const renderContent = () => {
    const sectionComponents = {
      'search': (
        <>
          <SearchBox onSearch={handleSearch} />
          <SearchResults
            medications={medications}
            materials={materials}
            diets={diets}
            onMedicationClick={handleMedicationClick}
            searchQuery={searchQuery}
          />
        </>
      ),
      'medications': (
        <CategoryTable 
          category="medications" 
          medications={medications}
          materials={materials}
          diets={diets}
          onMedicationClick={handleMedicationClick} 
        />
      ),
      'materials': (
        <CategoryTable 
          category="materials" 
          medications={medications}
          materials={materials}
          diets={diets}
          onMedicationClick={handleMedicationClick}
        />
      ),
      'diets': (
        <CategoryTable 
          category="diets" 
          medications={medications}
          materials={materials}
          diets={diets}
          onMedicationClick={handleMedicationClick}
        />
      ),
      'intoxication': <IntoxicationSection />,
      'high-alert': <HighAlertSection />,
      'elderly': <ElderlySection />,
      'sequential-therapy': <SequentialTherapySection />,
      'pharmacovigilance': <ClinicalPharmacy activeTab="pharmacovigilance" />,
      'cft': <ClinicalPharmacy activeTab="cft" />,
      'protocols': <ClinicalPharmacy activeTab="protocols" />,
      'pictogram': <ClinicalPharmacy activeTab="pictogram" />,
      'discharge-guidelines': <ClinicalPharmacy activeTab="discharge-guidelines" />,
      'drug-interactions': <ClinicalPharmacy activeTab="drug-interactions" />,
      'treatment-estimation': <ClinicalPharmacy activeTab="treatment-estimation" />,
      'user-management': <UserManagement />
    };

    const component = sectionComponents[selectedSection];
    
    if (!component) {
      return <div>Seção não implementada ainda.</div>;
    }

    // Se a seção é gerenciamento de usuários, só farmacêuticos podem acessar
    if (selectedSection === 'user-management') {
      if (!isFarmaceutico) {
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600">Apenas farmacêuticos podem gerenciar usuários.</p>
          </div>
        );
      }
      return component;
    }

    // Se a seção requer permissão específica, envolver com ProtectedRoute
    if (selectedSection !== 'search') {
      return (
        <ProtectedRoute requiredModule={selectedSection}>
          {component}
        </ProtectedRoute>
      );
    }

    return component;
  };

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col antialiased bg-gray-50 text-gray-900">
        {/* Header móvel */}
        <header className="sticky top-0 z-40 border-b bg-white px-4 py-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <AppSidebar onSectionChange={handleSectionChange} selectedSection={selectedSection} />
                </SheetContent>
              </Sheet>
              <h1 className="text-lg font-bold text-gray-900 truncate">
                HEAL Platform
              </h1>
            </div>
            <UserMenu onUserManagementClick={handleUserManagementClick} />
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1 p-4 pb-safe">
          {renderContent()}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
        <aside className="w-72 shrink-0 border-r bg-white dark:border-gray-700 dark:bg-gray-800 hidden lg:block">
          <AppSidebar onSectionChange={handleSectionChange} selectedSection={selectedSection} />
        </aside>
        
        {/* Sidebar para tablet */}
        <div className="lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-80">
              <AppSidebar onSectionChange={handleSectionChange} selectedSection={selectedSection} />
            </SheetContent>
          </Sheet>
        </div>
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header desktop */}
          <header className="border-b bg-white dark:border-gray-700 dark:bg-gray-800 px-4 lg:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden p-2"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-50">
                  HEAL Platform
                </h1>
              </div>
              <UserMenu onUserManagementClick={handleUserManagementClick} />
            </div>
          </header>
          
          {/* Conteúdo principal */}
          <div className="flex-1 py-6 lg:py-12 px-4 lg:px-6 xl:px-8 2xl:px-12 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
