
import { useState } from 'react';
import { Database, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarMenuItems } from '@/hooks/useSidebarMenuItems';
import {
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import SidebarHeader from '@/components/sidebar/SidebarHeader';
import SidebarFooter from '@/components/sidebar/SidebarFooter';
import MenuSection from '@/components/sidebar/MenuSection';
import EmptyStateMessage from '@/components/sidebar/EmptyStateMessage';

interface AppSidebarProps {
  onSectionChange: (section: 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation') => void;
  selectedSection: string;
}

const AppSidebar = ({ onSectionChange, selectedSection }: AppSidebarProps) => {
  const isMobile = useIsMobile();
  const { padronizacaoItems, farmaciaClinicaItems } = useSidebarMenuItems();
  const [openSections, setOpenSections] = useState({
    padronizacao: true,
    farmaciaClinica: false
  });

  const toggleSection = (section: 'padronizacao' | 'farmaciaClinica') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasAnyItems = padronizacaoItems.length > 0 || farmaciaClinicaItems.length > 0;

  return (
    <Sidebar className="border-r-0 shadow-xl bg-white h-full">
      <SidebarHeader />
      
      <SidebarContent className={`${isMobile ? 'px-3 py-4' : 'px-4 py-6'} bg-gradient-to-b from-gray-50 to-white overflow-y-auto`}>
        <MenuSection
          title="Padronizado"
          icon={Database}
          isOpen={openSections.padronizacao}
          onToggle={() => toggleSection('padronizacao')}
          items={padronizacaoItems}
          selectedSection={selectedSection}
          onSectionChange={onSectionChange}
        />

        <MenuSection
          title="Farmácia Clínica"
          icon={Heart}
          isOpen={openSections.farmaciaClinica}
          onToggle={() => toggleSection('farmaciaClinica')}
          items={farmaciaClinicaItems}
          selectedSection={selectedSection}
          onSectionChange={onSectionChange}
        />

        {!hasAnyItems && <EmptyStateMessage />}
      </SidebarContent>
      
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
