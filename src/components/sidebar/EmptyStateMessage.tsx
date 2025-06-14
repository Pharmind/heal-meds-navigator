
import React from 'react';
import { Database } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const EmptyStateMessage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="text-center py-8">
      <div className="text-gray-400 mb-2">
        <Database size={isMobile ? 20 : 24} className="mx-auto mb-2" />
      </div>
      <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
        Nenhum módulo disponível.
      </p>
      <p className={`text-gray-400 mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
        Entre em contato com um farmacêutico para solicitar acesso.
      </p>
    </div>
  );
};

export default EmptyStateMessage;
