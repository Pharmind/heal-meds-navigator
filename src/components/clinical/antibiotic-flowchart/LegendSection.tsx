
import React from 'react';
import { Info } from 'lucide-react';

const LegendSection: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Info size={16} />
        Legenda e Categorias Hospitalares
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Sensibilidade:</h5>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm">Sensível - Ação excelente (≥90% sensível)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm">Variável - Ação moderada (50-89%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-sm">Resistente - Ação insuficiente (&lt;50%)</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Categorias incluídas:</h5>
          <div className="text-xs space-y-1">
            <div>• Cocos Gram-positivos (11 espécies)</div>
            <div>• Bacilos Gram-positivos (4 espécies)</div>
            <div>• Enterobactérias (16 espécies)</div>
            <div>• BGN não-fermentadoras (6 espécies)</div>
            <div>• BGN fastidiosos (6 espécies)</div>
            <div>• Atípicos (6 espécies)</div>
            <div>• Anaeróbios (7 espécies)</div>
            <div>• Micobactérias (2 espécies)</div>
            <div>• Fungos hospitalares (4 espécies)</div>
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Classes de antibióticos:</h5>
          <div className="text-xs space-y-1">
            <div>• Beta-lactâmicos (25+ antibióticos)</div>
            <div>• Aminoglicosídeos (6 antibióticos)</div>
            <div>• Quinolonas (8 antibióticos)</div>
            <div>• Macrolídeos (4 antibióticos)</div>
            <div>• Glicopeptídeos (2 antibióticos)</div>
            <div>• Oxazolidinonas (2 antibióticos)</div>
            <div>• Antimicrobianos de reserva (10+ antibióticos)</div>
            <div>• Antifúngicos (7 antibióticos)</div>
            <div>• Outros (15+ antibióticos)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegendSection;
