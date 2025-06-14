
export const useTreatmentCalculations = (
  dailyDosePerPatient: number,
  totalPatientsUsing: number,
  averageTreatmentDays: number,
  currentStock: number
) => {
  const dailyConsumption = dailyDosePerPatient * totalPatientsUsing;
  const treatmentConsumption = dailyConsumption * averageTreatmentDays;
  const stockCoverageDays = currentStock > 0 ? Math.round((currentStock / dailyConsumption) * 10) / 10 : 0;
  const isStockSufficient = stockCoverageDays >= averageTreatmentDays;

  return {
    dailyConsumption,
    treatmentConsumption,
    stockCoverageDays,
    isStockSufficient
  };
};
