
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
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

type Section = 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation' | 'user-management';

const Index = () => {
  const { hasPermission, isFarmaceutico } = useAuth();
  const [selectedSection, setSelectedSection] = useState<Section>('search');
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
        <aside className="w-72 shrink-0 border-r bg-white dark:border-gray-700 dark:bg-gray-800">
          <AppSidebar onSectionChange={handleSectionChange} selectedSection={selectedSection} />
        </aside>
        <main className="flex-1 flex flex-col">
          {/* Header com menu do usuário */}
          <header className="border-b bg-white dark:border-gray-700 dark:bg-gray-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                HEAL Platform
              </h1>
              <UserMenu onUserManagementClick={handleUserManagementClick} />
            </div>
          </header>
          
          {/* Conteúdo principal */}
          <div className="flex-1 py-12 px-6 md:px-8 lg:px-10 xl:px-12">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
