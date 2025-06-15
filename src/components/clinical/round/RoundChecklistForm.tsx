
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Printer, RefreshCw, AlertCircle } from 'lucide-react';
import { PatientIdentificationSection } from './sections/PatientIdentificationSection';
import { CurrentStatusSection } from './sections/CurrentStatusSection';
import { FunctionalAssessmentSection } from './sections/FunctionalAssessmentSection';
import { PharmacotherapySection } from './sections/PharmacotherapySection';
import { TherapeuticGoalsSection } from './sections/TherapeuticGoalsSection';
import { ActiveProblemsSection } from './sections/ActiveProblemsSection';
import { DischargePlanningSection } from './sections/DischargePlanningSection';
import { RoundActionsSection } from './sections/RoundActionsSection';
import { RoundFooterSection } from './sections/RoundFooterSection';
import { useRoundData } from '@/hooks/useRoundData';
import { RoundFormData } from '@/types/multiprofessionalRound';
import { toast } from 'sonner';

export const RoundChecklistForm: React.FC = () => {
  const { createRound, isLoading } = useRoundData();
  const [formData, setFormData] = useState<RoundFormData>({
    round_type: 'Adulto',
    round_date: new Date().toISOString().split('T')[0],
    patient_name: '',
    birth_date: '',
    sector: 'UTI Adulto',
    bed: '',
    mother_name: '',
    hospitalization_days: '',
    
    // Status Atual
    dvas_usage: false,
    dvas_usage_obs: '',
    sedation_analgesia: false,
    sedation_analgesia_obs: '',
    antibiotic_therapy: false,
    antibiotic_therapy_obs: '',
    tev_prophylaxis: false,
    tev_prophylaxis_obs: '',
    lamg_prophylaxis: false,
    lamg_prophylaxis_obs: '',
    
    // Avaliação Funcional
    renal_function: null,
    renal_function_obs: '',
    hepatic_function: null,
    hepatic_function_obs: '',
    pulmonary_function: null,
    pulmonary_function_obs: '',
    evacuation: null,
    evacuation_obs: '',
    diuresis: null,
    diuresis_obs: '',
    
    // Farmacoterapia
    severe_drug_interaction: false,
    severe_drug_interaction_obs: '',
    adequate_administration_route: false,
    adequate_administration_route_obs: '',
    drug_allergy: false,
    drug_allergy_obs: '',
    updated_lab_data: false,
    updated_lab_data_obs: '',
    
    // Antibioticoterapia
    indication_compliance: false,
    adequate_spectrum: false,
    correct_dosage: false,
    treatment_time_defined: false,
    antibiotic_action: null,
    
    // Metas Terapêuticas
    adequate_glycemic_control: false,
    adequate_glycemic_control_obs: '',
    adequate_sedation_level: false,
    adequate_sedation_level_obs: '',
    sedation_can_be_reduced: false,
    sedation_can_be_reduced_obs: '',
    
    // Planejamento de Alta
    discharge_estimate: false,
    discharge_criteria_met: false,
    discharge_pending_issues: '',
    
    // Ações do Round
    pharmacy_actions: '',
    medicine_actions: '',
    nursing_actions: '',
    physiotherapy_actions: '',
    nutrition_actions: '',
    
    // Rodapé
    present_professionals: '',
    next_evaluation: '',
    
    // Problemas Ativos
    active_problems: []
  });

  // Auto-save no localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('round_checklist_draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('round_checklist_draft', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoundTypeChange = (type: 'Adulto' | 'Neonatal' | 'Pediátrica') => {
    const sectorMap = {
      'Adulto': 'UTI Adulto',
      'Neonatal': 'UTI Neonatal',
      'Pediátrica': 'UTI Pediátrica'
    };
    
    setFormData(prev => ({
      ...prev,
      round_type: type,
      sector: sectorMap[type] as any
    }));
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
      // Limpar formulário após sucesso
      localStorage.removeItem('round_checklist_draft');
      setFormData({
        round_type: 'Adulto',
        round_date: new Date().toISOString().split('T')[0],
        patient_name: '',
        birth_date: '',
        sector: 'UTI Adulto',
        bed: '',
        mother_name: '',
        hospitalization_days: '',
        dvas_usage: false,
        dvas_usage_obs: '',
        sedation_analgesia: false,
        sedation_analgesia_obs: '',
        antibiotic_therapy: false,
        antibiotic_therapy_obs: '',
        tev_prophylaxis: false,
        tev_prophylaxis_obs: '',
        lamg_prophylaxis: false,
        lamg_prophylaxis_obs: '',
        renal_function: null,
        renal_function_obs: '',
        hepatic_function: null,
        hepatic_function_obs: '',
        pulmonary_function: null,
        pulmonary_function_obs: '',
        evacuation: null,
        evacuation_obs: '',
        diuresis: null,
        diuresis_obs: '',
        severe_drug_interaction: false,
        severe_drug_interaction_obs: '',
        adequate_administration_route: false,
        adequate_administration_route_obs: '',
        drug_allergy: false,
        drug_allergy_obs: '',
        updated_lab_data: false,
        updated_lab_data_obs: '',
        indication_compliance: false,
        adequate_spectrum: false,
        correct_dosage: false,
        treatment_time_defined: false,
        antibiotic_action: null,
        adequate_glycemic_control: false,
        adequate_glycemic_control_obs: '',
        adequate_sedation_level: false,
        adequate_sedation_level_obs: '',
        sedation_can_be_reduced: false,
        sedation_can_be_reduced_obs: '',
        discharge_estimate: false,
        discharge_criteria_met: false,
        discharge_pending_issues: '',
        pharmacy_actions: '',
        medicine_actions: '',
        nursing_actions: '',
        physiotherapy_actions: '',
        nutrition_actions: '',
        present_professionals: '',
        next_evaluation: '',
        active_problems: []
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const clearForm = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
      localStorage.removeItem('round_checklist_draft');
      setFormData({
        round_type: 'Adulto',
        round_date: new Date().toISOString().split('T')[0],
        patient_name: '',
        birth_date: '',
        sector: 'UTI Adulto',
        bed: '',
        mother_name: '',
        hospitalization_days: '',
        dvas_usage: false,
        dvas_usage_obs: '',
        sedation_analgesia: false,
        sedation_analgesia_obs: '',
        antibiotic_therapy: false,
        antibiotic_therapy_obs: '',
        tev_prophylaxis: false,
        tev_prophylaxis_obs: '',
        lamg_prophylaxis: false,
        lamg_prophylaxis_obs: '',
        renal_function: null,
        renal_function_obs: '',
        hepatic_function: null,
        hepatic_function_obs: '',
        pulmonary_function: null,
        pulmonary_function_obs: '',
        evacuation: null,
        evacuation_obs: '',
        diuresis: null,
        diuresis_obs: '',
        severe_drug_interaction: false,
        severe_drug_interaction_obs: '',
        adequate_administration_route: false,
        adequate_administration_route_obs: '',
        drug_allergy: false,
        drug_allergy_obs: '',
        updated_lab_data: false,
        updated_lab_data_obs: '',
        indication_compliance: false,
        adequate_spectrum: false,
        correct_dosage: false,
        treatment_time_defined: false,
        antibiotic_action: null,
        adequate_glycemic_control: false,
        adequate_glycemic_control_obs: '',
        adequate_sedation_level: false,
        adequate_sedation_level_obs: '',
        sedation_can_be_reduced: false,
        sedation_can_be_reduced_obs: '',
        discharge_estimate: false,
        discharge_criteria_met: false,
        discharge_pending_issues: '',
        pharmacy_actions: '',
        medicine_actions: '',
        nursing_actions: '',
        physiotherapy_actions: '',
        nutrition_actions: '',
        present_professionals: '',
        next_evaluation: '',
        active_problems: []
      });
      toast.success('Formulário limpo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Formulário */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-blue-50 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold text-blue-900">Checklist Round Multiprofissional UTI</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex gap-2">
              {(['Adulto', 'Neonatal', 'Pediátrica'] as const).map((type) => (
                <Badge
                  key={type}
                  variant={formData.round_type === type ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleRoundTypeChange(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Data:</label>
              <input
                type="date"
                value={formData.round_date}
                onChange={(e) => updateFormData('round_date', e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={clearForm} variant="outline" size="sm">
            <RefreshCw size={16} className="mr-1" />
            Limpar
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer size={16} className="mr-1" />
            Imprimir
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} size="sm">
            <Save size={16} className="mr-1" />
            {isLoading ? 'Salvando...' : 'Salvar Round'}
          </Button>
        </div>
      </div>

      {/* Seções do Formulário */}
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

      {/* Botões Finais */}
      <div className="flex justify-center gap-4 p-6 bg-gray-50 rounded-lg">
        <Button onClick={clearForm} variant="outline">
          <RefreshCw size={18} className="mr-2" />
          Limpar Formulário
        </Button>
        <Button onClick={handlePrint} variant="outline">
          <Printer size={18} className="mr-2" />
          Imprimir Checklist
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="px-8">
          <Save size={18} className="mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Round Completo'}
        </Button>
      </div>
    </div>
  );
};
