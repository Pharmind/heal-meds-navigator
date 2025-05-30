
import { Search, Pill, Package, UtensilsCrossed } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
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
    <Sidebar className="border-r border-heal-green-200 bg-gradient-to-b from-heal-green-50 to-white">
      <SidebarHeader className="p-6 border-b border-heal-green-200 bg-gradient-to-r from-heal-green-100 to-heal-green-50">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-heal-green-800">Padronização HEAL</h1>
          <p className="text-sm text-heal-green-600">Sistema de Pesquisa</p>
          <p className="text-xs text-heal-green-500">Hospital Estadual de Águas Lindas - GO</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedCategory === item.id;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => onCategoryChange(item.id as any)}
                  isActive={isActive}
                  className={`
                    w-full justify-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left
                    ${isActive 
                      ? 'bg-heal-green-600 text-white shadow-lg hover:bg-heal-green-700' 
                      : 'text-heal-green-700 hover:bg-heal-green-100 hover:text-heal-green-800'
                    }
                  `}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      
      {/* Footer da sidebar */}
      <div className="mt-auto p-4 border-t border-heal-green-200 bg-heal-green-50">
        <div className="text-xs text-heal-green-600 text-center space-y-1">
          <p className="font-medium">Versão 1.0</p>
          <p>Última atualização: Dez/2024</p>
        </div>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
