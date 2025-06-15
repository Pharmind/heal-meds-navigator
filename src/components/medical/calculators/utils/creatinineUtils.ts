
export type Race = 'white' | 'black' | '';

export interface FormulaResult {
  name: string;
  clearance: number;
  category: string;
  color: string;
  applicable: boolean;
  reason?: string;
}

export const getCategoryAndColor = (clearance: number) => {
  if (clearance >= 90) {
    return { category: 'Normal ou elevada (G1)', color: 'bg-green-100 text-green-800' };
  } else if (clearance >= 60) {
    return { category: 'Diminuição leve (G2)', color: 'bg-yellow-100 text-yellow-800' };
  } else if (clearance >= 45) {
    return { category: 'Diminuição leve a moderada (G3a)', color: 'bg-orange-100 text-orange-800' };
  } else if (clearance >= 30) {
    return { category: 'Diminuição moderada a grave (G3b)', color: 'bg-red-100 text-red-800' };
  } else if (clearance >= 15) {
    return { category: 'Diminuição grave (G4)', color: 'bg-red-200 text-red-900' };
  } else {
    return { category: 'Falência renal (G5)', color: 'bg-red-300 text-red-900' };
  }
};

export const calculateAllFormulas = (
  age: number,
  weight: number,
  creatinine: number,
  gender: 'male' | 'female',
  race: Race
): FormulaResult[] => {
  const formulaResults: FormulaResult[] = [];

  // Cockcroft-Gault
  if (weight > 0) {
    let clearance = ((140 - age) * weight) / (72 * creatinine);
    if (gender === 'female') {
      clearance *= 0.85;
    }
    const { category, color } = getCategoryAndColor(clearance);
    formulaResults.push({
      name: 'Cockcroft-Gault',
      clearance: Math.round(clearance * 100) / 100,
      category,
      color,
      applicable: true
    });
  } else {
    formulaResults.push({
      name: 'Cockcroft-Gault',
      clearance: 0,
      category: '',
      color: '',
      applicable: false,
      reason: 'Peso necessário'
    });
  }

  // MDRD
  let clearanceMDRD = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
  if (gender === 'female') {
    clearanceMDRD *= 0.742;
  }
  if (race === 'black') {
    clearanceMDRD *= 1.212;
  }
  const mdrdResult = getCategoryAndColor(clearanceMDRD);
  formulaResults.push({
    name: 'MDRD',
    clearance: Math.round(clearanceMDRD * 100) / 100,
    category: mdrdResult.category,
    color: mdrdResult.color,
    applicable: true
  });

  // CKD-EPI
  let kappa = gender === 'female' ? 0.7 : 0.9;
  let alpha = gender === 'female' ? -0.329 : -0.411;
  let minValue = Math.min(creatinine / kappa, 1);
  let maxValue = Math.max(creatinine / kappa, 1);
  
  let clearanceCKD = 141 * Math.pow(minValue, alpha) * Math.pow(maxValue, -1.209) * Math.pow(0.993, age);
  if (gender === 'female') {
    clearanceCKD *= 1.018;
  }
  if (race === 'black') {
    clearanceCKD *= 1.159;
  }
  const ckdResult = getCategoryAndColor(clearanceCKD);
  formulaResults.push({
    name: 'CKD-EPI',
    clearance: Math.round(clearanceCKD * 100) / 100,
    category: ckdResult.category,
    color: ckdResult.color,
    applicable: true
  });

  return formulaResults;
};
