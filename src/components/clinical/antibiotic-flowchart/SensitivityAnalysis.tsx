
import React from 'react';
import { getSensitivityColor, getSensitivityIcon } from './utils';
import { SensitivityResult, PathogenData } from './types';

interface SensitivityAnalysisProps {
  selectedPathogen: string;
  selectedAntibiotic: string;
  pathogenData: PathogenData;
}

const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({
  selectedPathogen,
  selectedAntibiotic,
  pathogenData
}) => {
  if (!selectedPathogen) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Perfil de sensibilidade para {selectedPathogen}:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
        {Object.entries(pathogenData).map(([antibiotic, sensitivity]) => {
          const Icon = getSensitivityIcon(sensitivity as SensitivityResult);
          return (
            <div 
              key={antibiotic}
              className={`p-2 rounded-lg border flex items-center justify-between text-xs ${getSensitivityColor(sensitivity as SensitivityResult)} ${
                antibiotic === selectedAntibiotic ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <span className="font-medium">{antibiotic}</span>
              <div className="flex items-center gap-1">
                <Icon className="w-4 h-4" />
                <span className="capitalize">{sensitivity}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensitivityAnalysis;
