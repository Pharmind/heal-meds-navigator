
import React from 'react';
import { PatientIdentificationSection } from './sections/PatientIdentificationSection';
import { CurrentStatusSection } from './sections/CurrentStatusSection';
import { FunctionalAssessmentSection } from './sections/FunctionalAssessmentSection';
import { PharmacotherapySection } from './sections/PharmacotherapySection';
import { TherapeuticGoalsSection } from './sections/TherapeuticGoalsSection';
import { ActiveProblemsSection } from './sections/ActiveProblemsSection';
import { DischargePlanningSection } from './sections/DischargePlanningSection';
import { RoundActionsSection } from './sections/RoundActionsSection';
import { RoundFooterSection } from './sections/RoundFooterSection';
import { RoundFormHeader } from './components/RoundFormHeader';
import { RoundFormActions } from './components/RoundFormActions';
import { useRoundData } from '@/hooks/useRoundData';
import { useFormPersistence } from './hooks/useFormPersistence';
import { toast } from 'sonner';

export const RoundChecklistForm: React.FC = () => {
  const { createRound, isLoading } = useRoundData();
  const { formData, updateFormData, clearFormData } = useFormPersistence();

  const handleRoundTypeChange = (type: 'Adulto' | 'Neonatal' | 'Pediátrica') => {
    const sectorMap = {
      'Adulto': 'UTI Adulto',
      'Neonatal': 'UTI Neonatal',
      'Pediátrica': 'UTI Pediátrica'
    };
    
    updateFormData('round_type', type);
    updateFormData('sector', sectorMap[type]);
  };

  const handleSubmit = async () => {
    // Validações básicas
    if (!formData.patient_name.trim()) {
      toast.error('Nome do paciente é obrigatório');
      return;
    }
    
    if (!formData.bed.trim()) {
      toast.error('Leito é obrigatório');
      return;
    }

    const result = await createRound(formData);
    if (result) {
      clearFormData();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClearForm = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
      clearFormData();
      toast.success('Formulário limpo');
    }
  };

  return (
    <div className="space-y-6">
      <RoundFormHeader
        formData={formData}
        isLoading={isLoading}
        onRoundTypeChange={handleRoundTypeChange}
        onDateChange={(date) => updateFormData('round_date', date)}
        onClearForm={handleClearForm}
        onPrint={handlePrint}
        onSubmit={handleSubmit}
      />

      <div className="space-y-6">
        <PatientIdentificationSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <CurrentStatusSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <FunctionalAssessmentSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <PharmacotherapySection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <TherapeuticGoalsSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <ActiveProblemsSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <DischargePlanningSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <RoundActionsSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
        
        <RoundFooterSection 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </div>

      <RoundFormActions
        isLoading={isLoading}
        onClearForm={handleClearForm}
        onPrint={handlePrint}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
