
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EncryptionService } from '@/utils/encryption';
import { Medication, Material, Diet } from '@/types/heal';

// Tipos para dados criptografados
interface EncryptedMedication {
  id: string;
  mv_code: string;
  name: string;
  name_encrypted?: string;
  presentation: string;
  therapeutic_class: string;
  indication: string;
  indication_encrypted?: string;
  dose_adult: string;
  dose_adult_encrypted?: string;
  dose_pediatric: string;
  dose_pediatric_encrypted?: string;
  dose_maximum: string;
  dose_adjustment: string;
  photosensitive: boolean;
  administration_route: string;
  preparation_reconstitution: string;
  preparation_dilution: string;
  preparation_heal_standard: string;
  stability: string;
  observation: string;
  observation_encrypted?: string;
  updated_at: string;
}

// Função para descriptografar medicamento
const decryptMedication = (med: EncryptedMedication): Medication => {
  const decrypted = {
    id: med.id,
    mvCode: med.mv_code,
    name: med.name_encrypted ? EncryptionService.decrypt(med.name_encrypted) : med.name,
    presentation: med.presentation,
    therapeuticClass: med.therapeutic_class,
    indication: med.indication_encrypted ? EncryptionService.decrypt(med.indication_encrypted) : med.indication,
    dose: {
      adult: med.dose_adult_encrypted ? EncryptionService.decrypt(med.dose_adult_encrypted) : med.dose_adult,
      pediatric: med.dose_pediatric_encrypted ? EncryptionService.decrypt(med.dose_pediatric_encrypted) : med.dose_pediatric,
      maximum: med.dose_maximum,
    },
    doseAdjustment: med.dose_adjustment,
    photosensitive: med.photosensitive,
    administrationRoute: med.administration_route,
    preparation: {
      reconstitution: med.preparation_reconstitution,
      dilution: med.preparation_dilution,
      healStandard: med.preparation_heal_standard,
    },
    stability: med.stability,
    observation: med.observation_encrypted ? EncryptionService.decrypt(med.observation_encrypted) : med.observation,
    lastUpdate: new Date(med.updated_at).toLocaleDateString('pt-BR'),
  };

  console.log('Decrypted medication:', decrypted.name);
  return decrypted;
};

// Hook para buscar medicamentos com descriptografia
export const useEncryptedMedications = () => {
  return useQuery({
    queryKey: ['encrypted-medications'],
    queryFn: async () => {
      console.log('Buscando medicamentos criptografados...');
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar medicamentos:', error);
        throw error;
      }

      console.log('Medicamentos encontrados:', data?.length);
      return (data || []).map(decryptMedication);
    },
  });
};

// Hook para buscar dados com suporte a criptografia
export const useEncryptedSupabaseData = (searchQuery: string) => {
  const medications = useEncryptedMedications();

  // Para busca, precisamos considerar tanto dados criptografados quanto não criptografados
  const filteredMedications = searchQuery 
    ? (medications.data || []).filter(med => {
        const query = searchQuery.toLowerCase();
        return (
          med.name.toLowerCase().includes(query) ||
          med.mvCode.toLowerCase().includes(query) ||
          med.therapeuticClass.toLowerCase().includes(query) ||
          med.indication.toLowerCase().includes(query)
        );
      })
    : medications.data || [];

  return {
    medications: filteredMedications,
    isLoading: medications.isLoading,
    error: medications.error,
  };
};
