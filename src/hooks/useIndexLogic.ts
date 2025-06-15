import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';

type Section = 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation' | 'multiprofessional-round' | 'round-reports' | 'user-management';

export const useIndexLogic = () => {
  const { hasPermission, isFarmaceutico } = useAuth();
  const [selectedSection, setSelectedSection] = useState<Section>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { medications, materials, diets } = useSupabaseData(searchQuery);

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
    setSidebarOpen(false);
  };

  const handleUserManagementClick = () => {
    setSelectedSection('user-management');
  };

  return {
    selectedSection,
    searchQuery,
    sidebarOpen,
    medications,
    materials,
    diets,
    handleSearch,
    handleSectionChange,
    handleUserManagementClick,
    setSidebarOpen
  };
};
