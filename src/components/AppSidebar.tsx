
import { Search, Pill, Package, UtensilsCrossed, AlertTriangle, Eye, Users, FileText, Shield, Heart } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  onSectionChange: (section: 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'pharmacovigilance' | 'cft' | 'protocols') => void;
  selectedSection: string;
}

const AppSidebar = ({ onSectionChange, selectedSection }: AppSidebarProps) => {
  const padronizacaoItems = [
    { id: 'search', label: 'Busca Geral', icon: Search },
    { id: 'medications', label: 'Medicamentos', icon: Pill },
    { id: 'materials', label: 'Materiais', icon: Package },
    { id: 'diets', label: 'Dietas', icon: UtensilsCrossed },
  ];

  const farmaciaClinicaItems = [
    { id: 'intoxication', label: 'Intoxicação e Antídotos', icon: AlertTriangle },
    { id: 'high-alert', label: 'Alta Vigilância', icon: Eye },
    { id: 'elderly', label: 'Medicamentos p/ Idosos', icon: Users },
    { id: 'pharmacovigilance', label: 'Farmacovigilância', icon: Shield },
    { id: 'cft', label: 'CFT', icon: FileText },
    { id: 'protocols', label: 'Protocolos', icon: Heart },
  ];

  return (
    <Sidebar className="border-r border-heal-green-200 bg-gradient-to-b from-heal-green-50 to-white">
      <SidebarHeader className="p-6 border-b border-heal-green-200 bg-gradient-to-r from-heal-green-100 to-heal-green-50">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-heal-green-800">Guia Farmacêutico</h1>
          <p className="text-sm text-heal-green-600">HEAL</p>
          <p className="text-xs text-heal-green-500">Hospital Estadual de Águas Lindas - GO</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        {/* Seção Padronização */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-heal-green-700 mb-3">Padronização</h3>
          <SidebarMenu className="space-y-2">
            {padronizacaoItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedSection === item.id;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id as any)}
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
        </div>

        {/* Seção Farmácia Clínica */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-heal-green-700 mb-3">Farmácia Clínica</h3>
          <SidebarMenu className="space-y-2">
            {farmaciaClinicaItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedSection === item.id;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id as any)}
                    isActive={isActive}
                    className={`
                      w-full justify-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left
                      ${isActive 
                        ? 'bg-heal-green-600 text-white shadow-lg hover:bg-heal-green-700' 
                        : 'text-heal-green-700 hover:bg-heal-green-100 hover:text-heal-green-800'
                      }
                    `}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
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
