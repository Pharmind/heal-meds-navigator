
import React from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface MenuSectionProps {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  items: {
    id: string;
    label: string;
    icon: LucideIcon;
    color: string;
  }[];
  selectedSection: string;
  onSectionChange: (section: any) => void;
}

const MenuSection = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  items,
  selectedSection,
  onSectionChange
}: MenuSectionProps) => {
  const isMobile = useIsMobile();

  if (items.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="mb-6">
      <CollapsibleTrigger className="w-full group">
        <div className={`flex items-center justify-between w-full ${isMobile ? 'p-2' : 'p-3'} rounded-xl hover:bg-heal-green-50 transition-all duration-200 group`}>
          <div className="flex items-center space-x-3">
            <Icon className="text-heal-green-600" size={isMobile ? 18 : 20} />
            <h3 className={`font-bold text-heal-green-800 ${isMobile ? 'text-xs' : 'text-sm'}`}>{title}</h3>
          </div>
          <ChevronDown 
            size={isMobile ? 14 : 16} 
            className={`text-heal-green-600 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        <SidebarMenu className={`space-y-${isMobile ? '1' : '2'}`}>
          {items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = selectedSection === item.id;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => onSectionChange(item.id as any)}
                  isActive={isActive}
                  className={`
                    w-full justify-start gap-3 ${isMobile ? 'px-3 py-2' : 'px-4 py-3'} rounded-xl transition-all duration-300 text-left group
                    ${isActive 
                      ? 'bg-gradient-to-r from-heal-green-600 to-emerald-600 text-white shadow-lg hover:from-heal-green-700 hover:to-emerald-700 scale-[0.98]' 
                      : 'text-gray-700 hover:bg-heal-green-50 hover:text-heal-green-800 hover:scale-[1.02]'
                    }
                  `}
                >
                  <ItemIcon size={isMobile ? 16 : 20} className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-white' : item.color} group-hover:scale-110`} />
                  <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MenuSection;
