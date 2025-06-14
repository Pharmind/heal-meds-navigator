
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const SidebarFooter = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`mt-auto ${isMobile ? 'p-3' : 'p-4'} border-t border-gray-100 bg-gradient-to-r from-heal-green-50 to-emerald-50`}>
      <div className={`text-heal-green-700 text-center ${isMobile ? 'text-xs' : 'text-xs'}`}>
        <div className="flex items-center justify-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-heal-green-500 rounded-full animate-pulse"></div>
          <p className="font-semibold">Sistema Ativo</p>
        </div>
        <p className="text-heal-green-600">Versão 1.0.0</p>
      </div>
    </div>
  );
};

export default SidebarFooter;
