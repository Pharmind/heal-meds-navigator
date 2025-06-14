
import React from 'react';
import { Calculator, Activity } from 'lucide-react';

const EstimationHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-rose-100 rounded-full">
          <Calculator className="text-rose-600" size={32} />
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          <Activity className="text-blue-600" size={32} />
        </div>
      </div>
      <h2 className="text-4xl font-bold text-heal-green-800 mb-3">
        Estimativa de Tratamento
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Cálculo automatizado de consumo de antimicrobianos e verificação de estoque por unidade hospitalar
      </p>
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-blue-700 font-medium">Sistema com salvamento automático</span>
      </div>
    </div>
  );
};

export default EstimationHeader;
