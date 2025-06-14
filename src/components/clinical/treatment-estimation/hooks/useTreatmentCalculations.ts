
import { useMemo } from 'react';

export const useTreatmentCalculations = (
  totalDailyDose: number, // Agora representa a dose total diária da unidade
  activePatients: number,
  estimatedDays: number,
  currentStock: number
) => {
  return useMemo(() => {
    // O consumo diário total é agora diretamente a dose total informada
    const dailyTotalConsumption = totalDailyDose;
    
    // Cálculo do consumo total para o tratamento estimado
    const treatmentConsumption = dailyTotalConsumption * estimatedDays;
    
    // Cálculo dos dias restantes de estoque
    const daysRemaining = dailyTotalConsumption > 0 ? currentStock / dailyTotalConsumption : 0;
    
    // Dias de cobertura (arredondado para baixo)
    const stockCoverageDays = Math.floor(daysRemaining);
    
    // Se o estoque é suficiente para o tratamento estimado
    const isStockSufficient = currentStock >= treatmentConsumption;
    
    // Nível de alerta
    const alertLevel = daysRemaining <= 0 ? 'crítico' : 
                      daysRemaining <= 2 ? 'crítico' : 
                      daysRemaining <= 5 ? 'baixo' : 'normal';

    return {
      dailyTotalConsumption,
      treatmentConsumption,
      daysRemaining,
      stockCoverageDays,
      isStockSufficient,
      alertLevel
    };
  }, [totalDailyDose, activePatients, estimatedDays, currentStock]);
};
