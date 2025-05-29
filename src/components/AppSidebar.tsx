
import { Search, Pill, Package, UtensilsCrossed } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  onCategoryChange: (category: 'all' | 'medications' | 'materials' | 'diets') => void;
  selectedCategory: string;
}

const AppSidebar = ({ onCategoryChange, selectedCategory }: AppSidebarProps) => {
  const menuItems = [
    { id: 'all', label: 'Todos os Itens', icon: Search },
    { id: 'medications', label: 'Medicamentos', icon: Pill },
    { id: 'materials', label: 'Materiais', icon: Package },
    { id: 'diets', label: 'Dietas', icon: UtensilsCrossed },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-heal-green-200">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-heal-green-800">Padronização HEAL</h1>
          <p className="text-sm text-heal-green-600">Sistema de Pesquisa</p>
          <p className="text-xs text-heal-green-500">Hospital Estadual de Águas Lindas - GO</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => onCategoryChange(item.id as any)}
                  isActive={selectedCategory === item.id}
                  className="w-full justify-start hover:bg-heal-green-100 data-[active=true]:bg-heal-green-200 data-[active=true]:text-heal-green-800"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
