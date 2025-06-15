
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EncryptionService } from '@/utils/encryption';
import { MultiprofessionalRound, RoundPatient } from '@/types/multiprofessionalRound';

// Hook para gerenciar dados de round com criptografia
export const useSecureRoundData = () => {
  const [rounds, setRounds] = useState<MultiprofessionalRound[]>([]);
  const [patients, setPatients] = useState<RoundPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const encryptPatientData = (patientData: Partial<RoundPatient>) => {
    const sensitiveFields = ['patient_name', 'mother_name'];
    return EncryptionService.encryptObjectFields(patientData, sensitiveFields);
  };

  const decryptPatientData = (patientData: any): RoundPatient => {
    const sensitiveFields = ['patient_name', 'mother_name'];
    const decrypted = EncryptionService.decryptObjectFields(patientData, sensitiveFields);
    
    return {
      id: decrypted.id,
      patient_name: decrypted.patient_name_encrypted ? 
        EncryptionService.decrypt(decrypted.patient_name_encrypted) : 
        decrypted.patient_name,
      birth_date: decrypted.birth_date,
      sector: decrypted.sector,
      bed: decrypted.bed,
      mother_name: decrypted.mother_name_encrypted ? 
        EncryptionService.decrypt(decrypted.mother_name_encrypted) : 
        decrypted.mother_name,
      hospitalization_days: decrypted.hospitalization_days,
      user_id: decrypted.user_id,
      created_at: decrypted.created_at,
      updated_at: decrypted.updated_at
    };
  };

  const fetchSecurePatients = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('round_patients')
        .select('*')
        .order('patient_name');

      if (error) throw error;
      
      const decryptedPatients = (data || []).map(decryptPatientData);
      setPatients(decryptedPatients);
      console.log('Pacientes descriptografados:', decryptedPatients.length);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      toast.error('Erro ao carregar dados dos pacientes');
    }
  };

  const createSecurePatient = async (patientData: Partial<RoundPatient>): Promise<RoundPatient | null> => {
    if (!user) return null;

    try {
      // Criptografar dados sensíveis antes de enviar
      const encryptedData = {
        patient_name: patientData.patient_name || '',
        patient_name_encrypted: patientData.patient_name ? 
          EncryptionService.encrypt(patientData.patient_name) : null,
        birth_date: patientData.birth_date || null,
        sector: patientData.sector || 'UTI Adulto',
        bed: patientData.bed || '',
        mother_name: patientData.mother_name || null,
        mother_name_encrypted: patientData.mother_name ? 
          EncryptionService.encrypt(patientData.mother_name) : null,
        hospitalization_days: patientData.hospitalization_days || null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('round_patients')
        .insert([encryptedData])
        .select()
        .single();

      if (error) throw error;
      
      const decryptedPatient = decryptPatientData(data);
      await fetchSecurePatients();
      
      console.log('Paciente criado com criptografia:', decryptedPatient.patient_name);
      return decryptedPatient;
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      toast.error('Erro ao salvar dados do paciente');
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchSecurePatients();
    }
  }, [user]);

  return {
    rounds,
    patients,
    isLoading,
    createSecurePatient,
    fetchSecurePatients
  };
};
