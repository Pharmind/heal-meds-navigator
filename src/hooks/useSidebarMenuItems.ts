
import { Search, Pill, Package, UtensilsCrossed, AlertTriangle, Eye, Users, FileText, Shield, Heart, Image, ClipboardCheck, Zap, ArrowRightLeft, Calculator } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const useSidebarMenuItems = () => {
  const { hasPermission, isFarmaceutico } = useAuth();

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

  return {
    padronizacaoItems,
    farmaciaClinicaItems
  };
};
