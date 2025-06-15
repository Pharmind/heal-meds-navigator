
import { useState } from 'react';
import { Database, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarMenuItems } from '@/hooks/useSidebarMenuItems';
import SidebarHeader from '@/components/sidebar/SidebarHeader';
import SidebarFooter from '@/components/sidebar/SidebarFooter';
import MenuSection from '@/components/sidebar/MenuSection';
import EmptyStateMessage from '@/components/sidebar/EmptyStateMessage';

interface AppSidebarProps {
  onSectionChange: (section: 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation' | 'therapeutic-alternatives' | 'multiprofessional-round' | 'round-reports') => void;
  selectedSection: string;
}

const AppSidebar = ({ onSectionChange, selectedSection }: AppSidebarProps) => {
  const isMobile = useIsMobile();
  const { menuItems } = useSidebarMenuItems();
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({});

  // Initialize open sections based on menu items
  useState(() => {
    const initialOpenSections: {[key: string]: boolean} = {};
    menuItems.forEach((group, index) => {
      initialOpenSections[group.title] = index === 0; // First group open by default
    });
    setOpenSections(initialOpenSections);
  });

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const hasAnyItems = menuItems.length > 0;

  return (
    <div className="h-full flex flex-col bg-white min-h-screen">
      <SidebarHeader />
      
      <div className={`flex-1 ${isMobile ? 'px-2 py-3' : 'px-4 py-6'} bg-gradient-to-b from-gray-50 to-white overflow-y-auto`}>
        {menuItems.map((group) => {
          // Map the group data to MenuSection props
          const menuSectionItems = group.items.map(item => ({
            id: item.section,
            label: item.title,
            icon: item.icon,
            color: 'text-heal-green-600' // Default color
          }));

          return (
            <MenuSection
              key={group.title}
              title={group.title}
              icon={group.title === 'Padronizado' ? Database : Heart}
              isOpen={openSections[group.title] || false}
              onToggle={() => toggleSection(group.title)}
              items={menuSectionItems}
              selectedSection={selectedSection}
              onSectionChange={onSectionChange}
            />
          );
        })}

        {!hasAnyItems && <EmptyStateMessage />}
      </div>
      
      <SidebarFooter />
    </div>
  );
};

export default AppSidebar;
