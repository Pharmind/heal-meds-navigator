
import { useMemo } from 'react';

// Função para converter unidades para gramas
const convertToGrams = (value: number, unit: string): number => {
  switch (unit.toLowerCase()) {
    case 'mg': return value / 1000; // mg para g
    case 'g': return value; // já está em gramas
    case 'ui': return value / 1000000; // UI para g (aproximação)
    case 'frascos': return value * 1; // assumindo 1g por frasco
    case 'ampolas': return value * 0.5; // assumindo 0.5g por ampola
    case 'comprimidos': return value * 0.25; // assumindo 0.25g por comprimido
    case 'ml': return value / 1000; // ml para litros, depois para gramas (densidade água)
    case 'l': return value * 1000; // litros para gramas (densidade água)
    default: return value; // sem conversão
  }
};

// Função para converter gramas de volta para a unidade original
const convertFromGrams = (valueInGrams: number, unit: string): number => {
  switch (unit.toLowerCase()) {
    case 'mg': return valueInGrams * 1000; // g para mg
    case 'g': return valueInGrams; // já está em gramas
    case 'ui': return valueInGrams * 1000000; // g para UI (aproximação)
    case 'frascos': return valueInGrams / 1; // assumindo 1g por frasco
    case 'ampolas': return valueInGrams / 0.5; // assumindo 0.5g por ampola
    case 'comprimidos': return valueInGrams / 0.25; // assumindo 0.25g por comprimido
    case 'ml': return valueInGrams * 1000; // gramas para ml (densidade água)
    case 'l': return valueInGrams / 1000; // gramas para litros
    default: return valueInGrams; // sem conversão
  }
};

export const useTreatmentCalculations = (
  totalDailyDoseInOriginalUnit: number, // Dose total diária na unidade original
  activePatients: number,
  estimatedDays: number,
  currentStockInOriginalUnit: number,
  stockUnit: string = 'mg'
) => {
  return useMemo(() => {
    // Converter tudo para gramas para cálculos internos
    const totalDailyDoseInGrams = convertToGrams(totalDailyDoseInOriginalUnit, stockUnit);
    const currentStockInGrams = convertToGrams(currentStockInOriginalUnit, stockUnit);
    
    console.log('🧮 Cálculos em gramas:', {
      doseOriginal: totalDailyDoseInOriginalUnit,
      doseEmGramas: totalDailyDoseInGrams,
      estoqueOriginal: currentStockInOriginalUnit,
      estoqueEmGramas: currentStockInGrams,
      unidade: stockUnit
    });
    
    // O consumo diário total em gramas
    const dailyTotalConsumptionInGrams = totalDailyDoseInGrams;
    
    // Cálculo do consumo total para o tratamento estimado (em gramas)
    const treatmentConsumptionInGrams = dailyTotalConsumptionInGrams * estimatedDays;
    
    // Cálculo dos dias restantes de estoque
    const daysRemaining = dailyTotalConsumptionInGrams > 0 ? currentStockInGrams / dailyTotalConsumptionInGrams : 0;
    
    // Dias de cobertura (arredondado para baixo)
    const stockCoverageDays = Math.floor(daysRemaining);
    
    // Se o estoque é suficiente para o tratamento estimado
    const isStockSufficient = currentStockInGrams >= treatmentConsumptionInGrams;
    
    // Nível de alerta baseado nos dias restantes
    const alertLevel = daysRemaining <= 0 ? 'crítico' : 
                      daysRemaining <= 2 ? 'crítico' : 
                      daysRemaining <= 5 ? 'baixo' : 'normal';

    // Converter de volta para a unidade original para exibição
    const dailyTotalConsumption = convertFromGrams(dailyTotalConsumptionInGrams, stockUnit);
    const treatmentConsumption = convertFromGrams(treatmentConsumptionInGrams, stockUnit);

    console.log('📊 Resultados dos cálculos:', {
      diasRestantes: daysRemaining.toFixed(2),
      consumoDiarioGramas: dailyTotalConsumptionInGrams.toFixed(3),
      consumoDiarioOriginal: dailyTotalConsumption.toFixed(2),
      alerta: alertLevel
    });

    return {
      dailyTotalConsumption, // Na unidade original para exibição
      dailyTotalConsumptionInGrams, // Em gramas para referência
      treatmentConsumption, // Na unidade original para exibição
      treatmentConsumptionInGrams, // Em gramas para referência
      daysRemaining,
      stockCoverageDays,
      isStockSufficient,
      alertLevel
    };
  }, [totalDailyDoseInOriginalUnit, activePatients, estimatedDays, currentStockInOriginalUnit, stockUnit]);
};
