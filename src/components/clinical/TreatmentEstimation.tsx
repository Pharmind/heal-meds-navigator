
import React, { useState, useEffect } from 'react';
import { useTreatmentEstimations, useSaveTreatmentEstimation } from '@/hooks/useTreatmentEstimations';
import { useTreatmentCalculations } from './treatment-estimation/hooks/useTreatmentCalculations';
import { getStockStatus } from './treatment-estimation/utils/stockStatus';
import { hospitalUnits, stockUnits, commonAntimicrobials } from './treatment-estimation/constants';

import EstimationHeader from './treatment-estimation/EstimationHeader';
import BasicInfoCard from './treatment-estimation/BasicInfoCard';
import AntimicrobialForm from './treatment-estimation/AntimicrobialForm';
import CalculationResults from './treatment-estimation/CalculationResults';
import SavedEstimations from './treatment-estimation/SavedEstimations';
import InstructionsCard from './treatment-estimation/InstructionsCard';

const TreatmentEstimation = () => {
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospitalUnit, setHospitalUnit] = useState('');
  const [antimicrobialName, setAntimicrobialName] = useState('');
  const [dailyDosePerPatient, setDailyDosePerPatient] = useState<number>(0);
  const [averageTreatmentDays, setAverageTreatmentDays] = useState<number>(7);
  const [frequencyPerDay, setFrequencyPerDay] = useState<number>(1);
  const [totalPatientsUsing, setTotalPatientsUsing] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [stockUnit, setStockUnit] = useState('mg');

  const { data: savedEstimations } = useTreatmentEstimations(currentDate, hospitalUnit);
  const saveMutation = useSaveTreatmentEstimation();

  const { dailyConsumption, treatmentConsumption, stockCoverageDays, isStockSufficient } = 
    useTreatmentCalculations(dailyDosePerPatient, totalPatientsUsing, averageTreatmentDays, currentStock);

  // Auto-save quando os dados mudam
  useEffect(() => {
    if (hospitalUnit && antimicrobialName && dailyDosePerPatient > 0 && totalPatientsUsing > 0) {
      const timeoutId = setTimeout(() => {
        saveMutation.mutate({
          estimationDate: currentDate,
          hospitalUnit,
          antimicrobialName,
          dailyDosePerPatient,
          averageTreatmentDays,
          frequencyPerDay,
          totalPatientsUsing,
          currentStock,
          stockUnit,
          dailyConsumption,
          treatmentConsumption,
          stockCoverageDays,
          isStockSufficient,
        });
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [hospitalUnit, antimicrobialName, dailyDosePerPatient, averageTreatmentDays, frequencyPerDay, totalPatientsUsing, currentStock, stockUnit]);

  const clearForm = () => {
    setAntimicrobialName('');
    setDailyDosePerPatient(0);
    setAverageTreatmentDays(7);
    setFrequencyPerDay(1);
    setTotalPatientsUsing(0);
    setCurrentStock(0);
    setStockUnit('mg');
  };

  const stockStatus = getStockStatus(currentStock, stockCoverageDays, isStockSufficient);

  const showResults = hospitalUnit && antimicrobialName && dailyDosePerPatient > 0 && totalPatientsUsing > 0;

  return (
    <div className="space-y-6">
      <EstimationHeader />

      <BasicInfoCard
        currentDate={currentDate}
        hospitalUnit={hospitalUnit}
        setHospitalUnit={setHospitalUnit}
        hospitalUnits={hospitalUnits}
      />

      <AntimicrobialForm
        antimicrobialName={antimicrobialName}
        setAntimicrobialName={setAntimicrobialName}
        totalPatientsUsing={totalPatientsUsing}
        setTotalPatientsUsing={setTotalPatientsUsing}
        dailyDosePerPatient={dailyDosePerPatient}
        setDailyDosePerPatient={setDailyDosePerPatient}
        averageTreatmentDays={averageTreatmentDays}
        setAverageTreatmentDays={setAverageTreatmentDays}
        frequencyPerDay={frequencyPerDay}
        setFrequencyPerDay={setFrequencyPerDay}
        currentStock={currentStock}
        setCurrentStock={setCurrentStock}
        stockUnit={stockUnit}
        setStockUnit={setStockUnit}
        commonAntimicrobials={commonAntimicrobials}
        stockUnits={stockUnits}
        clearForm={clearForm}
        isPending={saveMutation.isPending}
      />

      {showResults && (
        <CalculationResults
          dailyConsumption={dailyConsumption}
          treatmentConsumption={treatmentConsumption}
          stockCoverageDays={stockCoverageDays}
          isStockSufficient={isStockSufficient}
          stockUnit={stockUnit}
          totalPatientsUsing={totalPatientsUsing}
          dailyDosePerPatient={dailyDosePerPatient}
          currentStock={currentStock}
          averageTreatmentDays={averageTreatmentDays}
          stockStatus={stockStatus}
        />
      )}

      {savedEstimations && savedEstimations.length > 0 && (
        <SavedEstimations
          savedEstimations={savedEstimations}
          hospitalUnit={hospitalUnit}
        />
      )}

      <InstructionsCard />
    </div>
  );
};

export default TreatmentEstimation;
