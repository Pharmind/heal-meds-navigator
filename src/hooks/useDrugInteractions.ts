
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DrugInteraction {
  id: string;
  drug1Name: string;
  drug2Name: string;
  interactionType: 'drug-drug' | 'drug-nutrient';
  severityLevel: 'leve' | 'moderada' | 'grave' | 'contraindicada';
  clinicalEffect: string;
  mechanism: string;
  management: string;
  bibliography: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InteractionCheck {
  id: string;
  patientName: string | null;
  patientAge: string | null;
  pharmacistName: string | null;
  medications: any[];
  interactionsFound: any[] | null;
  checkDate: string;
  notes: string | null;
  createdAt: string;
}

interface SupabaseDrugInteraction {
  id: string;
  drug1_name: string;
  drug2_name: string;
  interaction_type: 'drug-drug' | 'drug-nutrient';
  severity_level: 'leve' | 'moderada' | 'grave' | 'contraindicada';
  clinical_effect: string;
  mechanism: string;
  management: string;
  bibliography: string | null;
  created_at: string;
  updated_at: string;
}

interface SupabaseInteractionCheck {
  id: string;
  patient_name: string | null;
  patient_age: string | null;
  pharmacist_name: string | null;
  medications: any;
  interactions_found: any | null;
  check_date: string;
  notes: string | null;
  created_at: string;
}

const convertDrugInteraction = (interaction: SupabaseDrugInteraction): DrugInteraction => ({
  id: interaction.id,
  drug1Name: interaction.drug1_name,
  drug2Name: interaction.drug2_name,
  interactionType: interaction.interaction_type,
  severityLevel: interaction.severity_level,
  clinicalEffect: interaction.clinical_effect,
  mechanism: interaction.mechanism,
  management: interaction.management,
  bibliography: interaction.bibliography,
  createdAt: interaction.created_at,
  updatedAt: interaction.updated_at,
});

const convertInteractionCheck = (check: SupabaseInteractionCheck): InteractionCheck => ({
  id: check.id,
  patientName: check.patient_name,
  patientAge: check.patient_age,
  pharmacistName: check.pharmacist_name,
  medications: Array.isArray(check.medications) ? check.medications : [],
  interactionsFound: Array.isArray(check.interactions_found) ? check.interactions_found : null,
  checkDate: check.check_date,
  notes: check.notes,
  createdAt: check.created_at,
});

export const useDrugInteractions = () => {
  return useQuery({
    queryKey: ['drugInteractions'],
    queryFn: async () => {
      console.log('Buscando interações medicamentosas...');
      const { data, error } = await supabase
        .from('drug_interactions')
        .select('*')
        .order('drug1_name');

      if (error) {
        console.error('Erro ao buscar interações:', error);
        throw error;
      }

      console.log('Interações encontradas:', data?.length);
      return data?.map(convertDrugInteraction) || [];
    },
  });
};

export const useCreateInteractionCheck = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (checkData: {
      patientName?: string;
      patientAge?: string;
      pharmacistName?: string;
      medications: any[];
      interactionsFound?: any[];
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('interaction_checks')
        .insert({
          patient_name: checkData.patientName || null,
          patient_age: checkData.patientAge || null,
          pharmacist_name: checkData.pharmacistName || null,
          medications: checkData.medications,
          interactions_found: checkData.interactionsFound || null,
          notes: checkData.notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar verificação:', error);
        throw error;
      }

      return convertInteractionCheck(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactionChecks'] });
    },
  });
};

export const useInteractionChecks = () => {
  return useQuery({
    queryKey: ['interactionChecks'],
    queryFn: async () => {
      console.log('Buscando verificações de interação...');
      const { data, error } = await supabase
        .from('interaction_checks')
        .select('*')
        .order('check_date', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao buscar verificações:', error);
        throw error;
      }

      console.log('Verificações encontradas:', data?.length);
      return data?.map(convertInteractionCheck) || [];
    },
  });
};

// Função para verificar interações entre medicamentos
export const checkDrugInteractions = (medications: string[], allInteractions: DrugInteraction[]) => {
  const foundInteractions: DrugInteraction[] = [];
  
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const med1 = medications[i].toLowerCase();
      const med2 = medications[j].toLowerCase();
      
      // Busca interações em ambas as direções
      const interaction = allInteractions.find(int => 
        (int.drug1Name.toLowerCase().includes(med1) && int.drug2Name.toLowerCase().includes(med2)) ||
        (int.drug1Name.toLowerCase().includes(med2) && int.drug2Name.toLowerCase().includes(med1)) ||
        (med1.includes(int.drug1Name.toLowerCase()) && med2.includes(int.drug2Name.toLowerCase())) ||
        (med2.includes(int.drug1Name.toLowerCase()) && med1.includes(int.drug2Name.toLowerCase()))
      );
      
      if (interaction) {
        foundInteractions.push(interaction);
      }
    }
  }
  
  return foundInteractions;
};
