
import { Search, Pill, Package, UtensilsCrossed, AlertTriangle, Eye, Users, FileText, Shield, Heart, ChevronDown, Image, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface AppSidebarProps {
  onSectionChange: (section: 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines') => void;
  selectedSection: string;
}

const AppSidebar = ({ onSectionChange, selectedSection }: AppSidebarProps) => {
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
    { id: 'pictogram', label: 'Receita em Pictograma', icon: Image },
    { id: 'discharge-guidelines', label: 'Orientações de Alta', icon: ClipboardCheck },
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
        <Collapsible 
          open={openSections.padronizacao} 
          onOpenChange={() => toggleSection('padronizacao')}
          className="mb-6"
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-heal-green-100 transition-colors">
              <h3 className="text-sm font-semibold text-heal-green-700">Padronização</h3>
              <ChevronDown 
                size={16} 
                className={`text-heal-green-600 transition-transform duration-200 ${
                  openSections.padronizacao ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Seção Farmácia Clínica */}
        <Collapsible 
          open={openSections.farmaciaClinica} 
          onOpenChange={() => toggleSection('farmaciaClinica')}
          className="mb-4"
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-heal-green-100 transition-colors">
              <h3 className="text-sm font-semibold text-heal-green-700">Farmácia Clínica</h3>
              <ChevronDown 
                size={16} 
                className={`text-heal-green-600 transition-transform duration-200 ${
                  openSections.farmaciaClinica ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
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
          </CollapsibleContent>
        </Collapsible>
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
