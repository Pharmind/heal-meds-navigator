
import React from 'react';
import { Activity, Zap } from 'lucide-react';

const EstimationHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Activity className="text-blue-600" size={32} />
        </div>
        <div className="p-3 bg-green-100 rounded-full">
          <Zap className="text-green-600" size={32} />
        </div>
      </div>
      <h2 className="text-4xl font-bold text-heal-green-800 mb-3">
        Controle Diário de Antimicrobianos
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Sistema simplificado para acompanhamento diário do consumo e estoque de antimicrobianos por unidade
      </p>
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-green-700 font-medium">Monitoramento em tempo real</span>
      </div>
    </div>
  );
};

export default EstimationHeader;
