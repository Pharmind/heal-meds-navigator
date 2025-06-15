
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RoundPatient } from '@/types/multiprofessionalRound';
import { transformPatientData } from './utils/dataTransformers';

export const usePatientOperations = (fetchPatients: () => Promise<void>) => {
  const { user } = useAuth();

  const createOrUpdatePatient = async (patientData: Partial<RoundPatient>): Promise<RoundPatient | null> => {
    if (!user) return null;

    try {
      const dataToUpsert = {
        patient_name: patientData.patient_name || '',
        birth_date: patientData.birth_date || null,
        sector: patientData.sector || 'UTI Adulto',
        bed: patientData.bed || '',
        mother_name: patientData.mother_name || null,
        hospitalization_days: patientData.hospitalization_days || null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('round_patients')
        .upsert([dataToUpsert])
        .select()
        .single();

      if (error) throw error;
      
      const typedPatient = transformPatientData(data);
      await fetchPatients();
      return typedPatient;
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
      toast.error('Erro ao salvar dados do paciente');
      return null;
    }
  };

  return {
    createOrUpdatePatient
  };
};
