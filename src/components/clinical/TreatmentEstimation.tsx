import React, { useState } from 'react';
import { useTreatmentEstimations, useSaveTreatmentEstimation } from '@/hooks/useTreatmentEstimations';
import { useTreatmentCalculations } from './treatment-estimation/hooks/useTreatmentCalculations';
import { hospitalUnits, stockUnits, commonAntimicrobials } from './treatment-estimation/constants';

import EstimationHeader from './treatment-estimation/EstimationHeader';
import BasicInfoCard from './treatment-estimation/BasicInfoCard';
import SimplifiedForm from './treatment-estimation/SimplifiedForm';
import DashboardResults from './treatment-estimation/DashboardResults';
import SavedEstimations from './treatment-estimation/SavedEstimations';
import EstimationSummary from './treatment-estimation/EstimationSummary';
import EstimationConsultation from './treatment-estimation/EstimationConsultation';
import EstimationDashboard from './treatment-estimation/EstimationDashboard';

const TreatmentEstimation = () => {
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospitalUnit, setHospitalUnit] = useState('');
  const [antimicrobialName, setAntimicrobialName] = useState('');
  const [dosePerPatient, setDosePerPatient] = useState<number>(0);
  const [activePatients, setActivePatients] = useState<number>(0);
  const [estimatedDays, setEstimatedDays] = useState<number>(7);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [stockUnit, setStockUnit] = useState('mg');
  const [activeTab, setActiveTab] = useState<'new' | 'consultation' | 'summary' | 'dashboard'>('new');

  const { data: savedEstimations, isLoading: loadingEstimations, refetch } = useTreatmentEstimations(currentDate, hospitalUnit);
  const saveMutation = useSaveTreatmentEstimation();

  const { 
    dailyTotalConsumption, 
    daysRemaining, 
    stockCoverageDays, 
    alertLevel 
  } = useTreatmentCalculations(dosePerPatient, activePatients, estimatedDays, currentStock, stockUnit);

  const handleSaveEstimation = () => {
    const isValidForSaving = () => {
      return hospitalUnit && 
             antimicrobialName && 
             dosePerPatient > 0 && 
             activePatients > 0;
    };

    if (isValidForSaving()) {
      console.log('💾 Salvando estimativa manualmente...');
      
      saveMutation.mutate({
        estimationDate: currentDate,
        hospitalUnit,
        antimicrobialName,
        dosePerPatient,
        activePatients,
        estimatedDays,
        currentStock,
        stockUnit,
        dailyTotalConsumption: dosePerPatient,
        daysRemaining,
        alertLevel,
        stockCoverageDays,
      }, {
        onSuccess: () => {
          refetch();
        }
      });
    }
  };

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
    setActiveTab('new');
  };

  const showResults = hospitalUnit && antimicrobialName && dosePerPatient > 0 && activePatients > 0;
  const canSave = hospitalUnit && antimicrobialName && dosePerPatient > 0 && activePatients > 0;

  return (
    <div className="space-y-6">
      <EstimationHeader />

      <BasicInfoCard
        currentDate={currentDate}
        hospitalUnit={hospitalUnit}
        setHospitalUnit={setHospitalUnit}
        hospitalUnits={hospitalUnits}
      />

      {/* Navegação por Abas */}
      {hospitalUnit && (
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'new' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Nova Estimativa
          </button>
          <button
            onClick={() => setActiveTab('consultation')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'consultation' 
                ? 'border-purple-500 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Consultar/Atualizar
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'dashboard' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'summary' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Resumo Consolidado
          </button>
        </div>
      )}

      {/* Conteúdo das Abas */}
      {hospitalUnit && activeTab === 'new' && (
        <>
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
            onSave={handleSaveEstimation}
            canSave={canSave}
            isSaving={saveMutation.isPending}
            dailyTotalConsumption={dosePerPatient}
            daysRemaining={daysRemaining}
            alertLevel={alertLevel}
          />

          {showResults && (
            <DashboardResults
              dailyTotalConsumption={dosePerPatient}
              daysRemaining={daysRemaining}
              stockCoverageDays={stockCoverageDays}
              stockUnit={stockUnit}
              activePatients={activePatients}
              dosePerPatient={activePatients > 0 ? dosePerPatient / activePatients : 0}
              currentStock={currentStock}
              estimatedDays={estimatedDays}
              alertLevel={alertLevel}
            />
          )}
        </>
      )}

      {hospitalUnit && activeTab === 'consultation' && (
        <EstimationConsultation
          estimations={savedEstimations || []}
          hospitalUnit={hospitalUnit}
          onEstimationUpdated={() => refetch()}
        />
      )}

      {hospitalUnit && activeTab === 'dashboard' && (
        <EstimationDashboard
          estimations={savedEstimations || []}
          selectedUnit={hospitalUnit}
        />
      )}

      {hospitalUnit && activeTab === 'summary' && (
        <EstimationSummary
          estimations={savedEstimations || []}
          selectedUnit={hospitalUnit}
        />
      )}

      {savedEstimations && savedEstimations.length > 0 && !loadingEstimations && activeTab === 'new' && (
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
