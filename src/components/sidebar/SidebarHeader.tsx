
import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarHeader as SidebarHeaderUI } from '@/components/ui/sidebar';

const SidebarHeader = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarHeaderUI className={`p-4 lg:p-6 border-b border-gray-100 bg-gradient-to-br from-heal-green-600 to-emerald-600 text-white ${isMobile ? 'py-4' : ''}`}>
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Stethoscope size={isMobile ? 20 : 24} className="text-white" />
          </div>
          <div>
            <h1 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>Guia Farmacêutico</h1>
            <p className={`text-heal-green-100 ${isMobile ? 'text-xs' : 'text-sm'}`}>HEAL</p>
          </div>
        </div>
        <p className={`text-heal-green-100 ${isMobile ? 'pl-12 text-xs' : 'pl-14 text-xs'}`}>
          Hospital Estadual de Águas Lindas - GO
        </p>
      </div>
    </SidebarHeaderUI>
  );
};

export default SidebarHeader;
