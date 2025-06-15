
import React from 'react';

interface StatisticsCardsProps {
  totalPathogens: number;
  availableAntibiotics: number;
  totalCombinations: number;
  filteredPathogens: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalPathogens,
  availableAntibiotics,
  totalCombinations,
  filteredPathogens
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <div className="text-2xl font-bold text-blue-600">{totalPathogens}</div>
        <div className="text-sm text-blue-700">Patógenos</div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <div className="text-2xl font-bold text-green-600">
          {availableAntibiotics > 0 ? availableAntibiotics : '-'}
        </div>
        <div className="text-sm text-green-700">Antibióticos disponíveis</div>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg text-center">
        <div className="text-2xl font-bold text-purple-600">{totalCombinations}</div>
        <div className="text-sm text-purple-700">Total de combinações</div>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg text-center">
        <div className="text-2xl font-bold text-orange-600">{filteredPathogens}</div>
        <div className="text-sm text-orange-700">Patógenos filtrados</div>
      </div>
    </div>
  );
};

export default StatisticsCards;
