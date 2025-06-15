
import { SensitivityResult, Recommendation } from './types';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export const getSensitivityColor = (sensitivity: SensitivityResult): string => {
  switch (sensitivity) {
    case 'sensitive': return 'bg-green-100 text-green-800 border-green-300';
    case 'variable': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'resistant': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getSensitivityIcon = (sensitivity: SensitivityResult) => {
  switch (sensitivity) {
    case 'sensitive': return CheckCircle;
    case 'variable': return AlertTriangle;
    case 'resistant': return XCircle;
    default: return Info;
  }
};

export const getRecommendation = (sensitivity: SensitivityResult): Recommendation => {
  const recommendations = {
    'sensitive': {
      title: 'Recomendação: Terapia Dirigida',
      description: 'Antibiótico apropriado para este patógeno. Considere descalonamento se estava em terapia empírica mais ampla.',
      color: 'bg-green-50 border-green-200',
      action: 'Manter ou descalonar para este antibiótico'
    },
    'variable': {
      title: 'Recomendação: Avaliar Antibiograma',
      description: 'Sensibilidade variável. Necessário antibiograma para confirmar eficácia. Considere alternativas.',
      color: 'bg-yellow-50 border-yellow-200',
      action: 'Aguardar antibiograma ou considerar alternativa'
    },
    'resistant': {
      title: 'Recomendação: Escalonamento Necessário',
      description: 'Resistência esperada. Necessário escalonamento para antibiótico de espectro mais amplo.',
      color: 'bg-red-50 border-red-200',
      action: 'Escalonar para antibiótico alternativo'
    }
  };

  return recommendations[sensitivity];
};
