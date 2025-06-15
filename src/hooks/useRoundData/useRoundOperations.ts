
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MultiprofessionalRound, RoundFormData } from '@/types/multiprofessionalRound';
import { transformRoundData } from './utils/dataTransformers';
import { usePatientOperations } from './usePatientOperations';

export const useRoundOperations = (
  fetchRounds: () => Promise<void>,
  fetchPatients: () => Promise<void>,
  setIsLoading: (loading: boolean) => void
) => {
  const { user } = useAuth();
  const { createOrUpdatePatient } = usePatientOperations(fetchPatients);

  const createRound = async (formData: RoundFormData): Promise<MultiprofessionalRound | null> => {
    if (!user) return null;

    setIsLoading(true);
    try {
      // Validações básicas
      if (!formData.patient_name?.trim()) {
        toast.error('Nome do paciente é obrigatório');
        return null;
      }
      
      if (!formData.bed?.trim()) {
        toast.error('Leito é obrigatório');
        return null;
      }

      // Primeiro, criar ou encontrar o paciente
      const patientData = {
        patient_name: formData.patient_name,
        birth_date: formData.birth_date || null,
        sector: formData.sector,
        bed: formData.bed,
        mother_name: formData.mother_name || null,
        hospitalization_days: Number(formData.hospitalization_days) || null,
      };

      const patient = await createOrUpdatePatient(patientData);
      if (!patient) throw new Error('Erro ao criar paciente');

      // Preparar dados do round
      const roundData = {
        round_type: formData.round_type,
        round_date: formData.round_date,
        patient_id: patient.id,
        user_id: user.id,
        
        // Status Atual
        dvas_usage: formData.dvas_usage || false,
        dvas_usage_obs: formData.dvas_usage_obs || null,
        sedation_analgesia: formData.sedation_analgesia || false,
        sedation_analgesia_obs: formData.sedation_analgesia_obs || null,
        antibiotic_therapy: formData.antibiotic_therapy || false,
        antibiotic_therapy_obs: formData.antibiotic_therapy_obs || null,
        tev_prophylaxis: formData.tev_prophylaxis || false,
        tev_prophylaxis_obs: formData.tev_prophylaxis_obs || null,
        lamg_prophylaxis: formData.lamg_prophylaxis || false,
        lamg_prophylaxis_obs: formData.lamg_prophylaxis_obs || null,
        
        // Avaliação Funcional
        renal_function: formData.renal_function || null,
        renal_function_obs: formData.renal_function_obs || null,
        hepatic_function: formData.hepatic_function || null,
        hepatic_function_obs: formData.hepatic_function_obs || null,
        pulmonary_function: formData.pulmonary_function || null,
        pulmonary_function_obs: formData.pulmonary_function_obs || null,
        evacuation: formData.evacuation || null,
        evacuation_obs: formData.evacuation_obs || null,
        diuresis: formData.diuresis || null,
        diuresis_obs: formData.diuresis_obs || null,
        
        // Farmacoterapia
        severe_drug_interaction: formData.severe_drug_interaction || false,
        severe_drug_interaction_obs: formData.severe_drug_interaction_obs || null,
        adequate_administration_route: formData.adequate_administration_route || false,
        adequate_administration_route_obs: formData.adequate_administration_route_obs || null,
        drug_allergy: formData.drug_allergy || false,
        drug_allergy_obs: formData.drug_allergy_obs || null,
        updated_lab_data: formData.updated_lab_data || false,
        updated_lab_data_obs: formData.updated_lab_data_obs || null,
        
        // Antibioticoterapia
        indication_compliance: formData.indication_compliance || false,
        adequate_spectrum: formData.adequate_spectrum || false,
        correct_dosage: formData.correct_dosage || false,
        treatment_time_defined: formData.treatment_time_defined || false,
        antibiotic_action: formData.antibiotic_action || null,
        
        // Metas Terapêuticas
        adequate_glycemic_control: formData.adequate_glycemic_control || false,
        adequate_glycemic_control_obs: formData.adequate_glycemic_control_obs || null,
        adequate_sedation_level: formData.adequate_sedation_level || false,
        adequate_sedation_level_obs: formData.adequate_sedation_level_obs || null,
        sedation_can_be_reduced: formData.sedation_can_be_reduced || false,
        sedation_can_be_reduced_obs: formData.sedation_can_be_reduced_obs || null,
        
        // Planejamento de Alta
        discharge_estimate: formData.discharge_estimate || false,
        discharge_criteria_met: formData.discharge_criteria_met || false,
        discharge_pending_issues: formData.discharge_pending_issues || null,
        
        // Ações do Round
        pharmacy_actions: formData.pharmacy_actions || null,
        medicine_actions: formData.medicine_actions || null,
        nursing_actions: formData.nursing_actions || null,
        physiotherapy_actions: formData.physiotherapy_actions || null,
        nutrition_actions: formData.nutrition_actions || null,
        
        // Rodapé
        present_professionals: formData.present_professionals || null,
        next_evaluation: formData.next_evaluation || null,
      };

      const { data, error } = await supabase
        .from('multiprofessional_rounds')
        .insert([roundData])
        .select()
        .single();

      if (error) throw error;

      const typedRound = transformRoundData(data);

      // Salvar problemas ativos se existirem
      if (formData.active_problems && formData.active_problems.length > 0) {
        const problemsData = formData.active_problems.map((problem: any, index: number) => ({
          round_id: data.id,
          problem_description: problem.problem_description,
          expected_result: problem.expected_result || null,
          status: problem.status || null,
          observations: problem.observations || null,
          problem_order: index + 1,
        }));

        const { error: problemsError } = await supabase
          .from('round_active_problems')
          .insert(problemsData);

        if (problemsError) {
          console.error('Erro ao salvar problemas:', problemsError);
        }
      }

      await fetchRounds();
      toast.success('Round criado com sucesso');
      return typedRound;
    } catch (error) {
      console.error('Erro ao criar round:', error);
      toast.error('Erro ao criar round');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRound = async (id: string, formData: RoundFormData): Promise<MultiprofessionalRound | null> => {
    if (!user) return null;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('multiprofessional_rounds')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const typedRound = transformRoundData(data);
      await fetchRounds();
      toast.success('Round atualizado com sucesso');
      return typedRound;
    } catch (error) {
      console.error('Erro ao atualizar round:', error);
      toast.error('Erro ao atualizar round');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRound = async (id: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('multiprofessional_rounds')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchRounds();
      toast.success('Round excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir round:', error);
      toast.error('Erro ao excluir round');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createRound,
    updateRound,
    deleteRound
  };
};
