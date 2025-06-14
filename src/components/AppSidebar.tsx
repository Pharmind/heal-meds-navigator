
import { Search, Pill, Package, UtensilsCrossed, AlertTriangle, Eye, Users, FileText, Shield, Heart, ChevronDown, Image, ClipboardCheck, Zap, ArrowRightLeft, Stethoscope, Database, Calculator } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  onSectionChange: (section: 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation') => void;
  selectedSection: string;
}

const AppSidebar = ({ onSectionChange, selectedSection }: AppSidebarProps) => {
  const { hasPermission, isFarmaceutico } = useAuth();
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

  const allPadronizacaoItems = [
    { id: 'search', label: 'Busca Geral', icon: Search, color: 'text-blue-600' },
    { id: 'medications', label: 'Medicamentos', icon: Pill, color: 'text-blue-500' },
    { id: 'materials', label: 'Materiais', icon: Package, color: 'text-green-600' },
    { id: 'diets', label: 'Dietas', icon: UtensilsCrossed, color: 'text-orange-600' },
  ];

  const allFarmaciaClinicaItems = [
    { id: 'intoxication', label: 'Intoxicação e Antídotos', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'high-alert', label: 'Alta Vigilância', icon: Eye, color: 'text-amber-600' },
    { id: 'elderly', label: 'Medicamentos p/ Idosos', icon: Users, color: 'text-purple-600' },
    { id: 'sequential-therapy', label: 'Terapia Sequencial', icon: ArrowRightLeft, color: 'text-indigo-600' },
    { id: 'pictogram', label: 'Receita Simplificada', icon: Image, color: 'text-cyan-600' },
    { id: 'drug-interactions', label: 'Interações Medicamentosas', icon: Zap, color: 'text-yellow-600' },
    { id: 'discharge-guidelines', label: 'Orientações de Alta', icon: ClipboardCheck, color: 'text-teal-600' },
    { id: 'treatment-estimation', label: 'Estimativa de Tratamento', icon: Calculator, color: 'text-rose-600' },
    { id: 'pharmacovigilance', label: 'Farmacovigilância', icon: Shield, color: 'text-emerald-600' },
    { id: 'cft', label: 'CFT', icon: FileText, color: 'text-slate-600' },
    { id: 'protocols', label: 'Protocolos', icon: Heart, color: 'text-pink-600' },
  ];

  // Filtrar itens baseado nas permissões do usuário
  const padronizacaoItems = allPadronizacaoItems.filter(item => 
    isFarmaceutico || hasPermission(item.id)
  );

  const farmaciaClinicaItems = allFarmaciaClinicaItems.filter(item => 
    isFarmaceutico || hasPermission(item.id)
  );

  return (
    <Sidebar className="border-r-0 shadow-xl bg-white">
      <SidebarHeader className="p-6 border-b border-gray-100 bg-gradient-to-br from-heal-green-600 to-emerald-600 text-white">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Stethoscope size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Guia Farmacêutico</h1>
              <p className="text-sm text-heal-green-100">HEAL</p>
            </div>
          </div>
          <p className="text-xs text-heal-green-100 pl-14">
            Hospital Estadual de Águas Lindas - GO
          </p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
        {/* Seção Padronização - só mostrar se houver itens */}
        {padronizacaoItems.length > 0 && (
          <Collapsible 
            open={openSections.padronizacao} 
            onOpenChange={() => toggleSection('padronizacao')}
            className="mb-6"
          >
            <CollapsibleTrigger className="w-full group">
              <div className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-heal-green-50 transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <Database className="text-heal-green-600" size={20} />
                  <h3 className="text-sm font-bold text-heal-green-800">Padronizado</h3>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-heal-green-600 transition-transform duration-300 ${
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
                          w-full justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left group
                          ${isActive 
                            ? 'bg-gradient-to-r from-heal-green-600 to-emerald-600 text-white shadow-lg hover:from-heal-green-700 hover:to-emerald-700 scale-[0.98]' 
                            : 'text-gray-700 hover:bg-heal-green-50 hover:text-heal-green-800 hover:scale-[1.02]'
                          }
                        `}
                      >
                        <Icon size={20} className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-white' : item.color} group-hover:scale-110`} />
                        <span className="font-medium">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Seção Farmácia Clínica - só mostrar se houver itens */}
        {farmaciaClinicaItems.length > 0 && (
          <Collapsible 
            open={openSections.farmaciaClinica} 
            onOpenChange={() => toggleSection('farmaciaClinica')}
            className="mb-4"
          >
            <CollapsibleTrigger className="w-full group">
              <div className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-heal-green-50 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Heart className="text-heal-green-600" size={20} />
                  <h3 className="text-sm font-bold text-heal-green-800">Farmácia Clínica</h3>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-heal-green-600 transition-transform duration-300 ${
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
                          w-full justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left group
                          ${isActive 
                            ? 'bg-gradient-to-r from-heal-green-600 to-emerald-600 text-white shadow-lg hover:from-heal-green-700 hover:to-emerald-700 scale-[0.98]' 
                            : 'text-gray-700 hover:bg-heal-green-50 hover:text-heal-green-800 hover:scale-[1.02]'
                          }
                        `}
                      >
                        <Icon size={18} className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-white' : item.color} group-hover:scale-110`} />
                        <span className="font-medium text-sm">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Mostrar mensagem se não há módulos disponíveis */}
        {padronizacaoItems.length === 0 && farmaciaClinicaItems.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Database size={24} className="mx-auto mb-2" />
            </div>
            <p className="text-sm text-gray-500">
              Nenhum módulo disponível.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Entre em contato com um farmacêutico para solicitar acesso.
            </p>
          </div>
        )}
      </SidebarContent>
      
      {/* Footer da sidebar */}
      <div className="mt-auto p-4 border-t border-gray-100 bg-gradient-to-r from-heal-green-50 to-emerald-50">
        <div className="text-xs text-heal-green-700 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-heal-green-500 rounded-full animate-pulse"></div>
            <p className="font-semibold">Sistema Ativo</p>
          </div>
          <p className="text-heal-green-600">Versão 1.0.0</p>
        </div>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
