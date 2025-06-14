import React, { useState, useEffect } from 'react';
import { useTreatmentEstimations, useSaveTreatmentEstimation } from '@/hooks/useTreatmentEstimations';
import { useTreatmentCalculations } from './treatment-estimation/hooks/useTreatmentCalculations';
import { hospitalUnits, stockUnits, commonAntimicrobials } from './treatment-estimation/constants';

import EstimationHeader from './treatment-estimation/EstimationHeader';
import BasicInfoCard from './treatment-estimation/BasicInfoCard';
import SimplifiedForm from './treatment-estimation/SimplifiedForm';
import DashboardResults from './treatment-estimation/DashboardResults';
import SavedEstimations from './treatment-estimation/SavedEstimations';

const TreatmentEstimation = () => {
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospitalUnit, setHospitalUnit] = useState('');
  const [antimicrobialName, setAntimicrobialName] = useState('');
  const [dosePerPatient, setDosePerPatient] = useState<number>(0);
  const [activePatients, setActivePatients] = useState<number>(0);
  const [estimatedDays, setEstimatedDays] = useState<number>(7);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [stockUnit, setStockUnit] = useState('mg');

  const { data: savedEstimations, isLoading: loadingEstimations } = useTreatmentEstimations(currentDate, hospitalUnit);
  const saveMutation = useSaveTreatmentEstimation();

  const { 
    dailyTotalConsumption, 
    daysRemaining, 
    stockCoverageDays, 
    alertLevel 
  } = useTreatmentCalculations(dosePerPatient, activePatients, estimatedDays, currentStock);

  // Auto-save simplificado
  useEffect(() => {
    const isValidForSaving = () => {
      return hospitalUnit && 
             antimicrobialName && 
             dosePerPatient > 0 && 
             activePatients > 0;
    };

    if (isValidForSaving() && !saveMutation.isPending) {
      const timeoutId = setTimeout(() => {
        console.log('🔄 Auto-salvando estimativa simplificada...');
        
        saveMutation.mutate({
          estimationDate: currentDate,
          hospitalUnit,
          antimicrobialName,
          dosePerPatient, // Agora é dose total da unidade
          activePatients,
          estimatedDays,
          currentStock,
          stockUnit,
          dailyTotalConsumption: dosePerPatient, // Dose total diária
          daysRemaining,
          alertLevel,
          stockCoverageDays,
        });
      }, 2000); // 2 segundos de debounce

      return () => clearTimeout(timeoutId);
    }
  }, [
    hospitalUnit, 
    antimicrobialName, 
    dosePerPatient, 
    activePatients, 
    estimatedDays, 
    currentStock, 
    stockUnit,
    daysRemaining,
    alertLevel,
    stockCoverageDays,
    saveMutation,
    currentDate
  ]);

  const clearForm = () => {
    console.log('🧹 Limpando formulário...');
    setAntimicrobialName('');
    setDosePerPatient(0);
    setActivePatients(0);
    setEstimatedDays(7);
    setCurrentStock(0);
    setStockUnit('mg');
  };

  const loadEstimation = (estimation: any) => {
    console.log('📥 Carregando estimativa:', estimation.antimicrobialName);
    setAntimicrobialName(estimation.antimicrobialName);
    setDosePerPatient(estimation.dosePerPatient);
    setActivePatients(estimation.activePatients);
    setEstimatedDays(estimation.estimatedDays);
    setCurrentStock(estimation.currentStock);
    setStockUnit(estimation.stockUnit);
  };

  const showResults = hospitalUnit && antimicrobialName && dosePerPatient > 0 && activePatients > 0;

  return (
    <div className="space-y-6">
      <EstimationHeader />

      <BasicInfoCard
        currentDate={currentDate}
        hospitalUnit={hospitalUnit}
        setHospitalUnit={setHospitalUnit}
        hospitalUnits={hospitalUnits}
      />

      <SimplifiedForm
        antimicrobialName={antimicrobialName}
        setAntimicrobialName={setAntimicrobialName}
        dosePerPatient={dosePerPatient}
        setDosePerPatient={setDosePerPatient}
        activePatients={activePatients}
        setActivePatients={setActivePatients}
        estimatedDays={estimatedDays}
        setEstimatedDays={setEstimatedDays}
        currentStock={currentStock}
        setCurrentStock={setCurrentStock}
        stockUnit={stockUnit}
        setStockUnit={setStockUnit}
        commonAntimicrobials={commonAntimicrobials}
        stockUnits={stockUnits}
        clearForm={clearForm}
        isPending={saveMutation.isPending}
        dailyTotalConsumption={dosePerPatient} // Agora é igual ao campo dose
        daysRemaining={daysRemaining}
        alertLevel={alertLevel}
      />

      {showResults && (
        <DashboardResults
          dailyTotalConsumption={dosePerPatient} // Dose total da unidade
          daysRemaining={daysRemaining}
          stockCoverageDays={stockCoverageDays}
          stockUnit={stockUnit}
          activePatients={activePatients}
          dosePerPatient={activePatients > 0 ? dosePerPatient / activePatients : 0} // Dose média por paciente
          currentStock={currentStock}
          estimatedDays={estimatedDays}
          alertLevel={alertLevel}
        />
      )}

      {savedEstimations && savedEstimations.length > 0 && !loadingEstimations && (
        <SavedEstimations
          savedEstimations={savedEstimations}
          hospitalUnit={hospitalUnit}
          onLoadEstimation={loadEstimation}
        />
      )}
    </div>
  );
};

export default TreatmentEstimation;
