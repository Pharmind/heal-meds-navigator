
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TherapeuticGroup {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReferenceMedication {
  id: string;
  name: string;
  therapeutic_group_id: string;
  active_ingredient: string | null;
  therapeutic_class: string | null;
  created_at: string;
  updated_at: string;
  therapeutic_group?: TherapeuticGroup;
}

export interface TherapeuticAlternative {
  id: string;
  reference_medication_id: string;
  alternative_name: string;
  active_ingredient: string | null;
  dosage: string;
  administration_route: string;
  equivalent_dose: string | null;
  considerations: string | null;
  contraindications: string | null;
  availability: 'disponivel' | 'indisponivel' | 'controlado';
  created_at: string;
  updated_at: string;
}

// Hook para buscar grupos terapêuticos
export const useTherapeuticGroups = () => {
  return useQuery({
    queryKey: ['therapeutic-groups'],
    queryFn: async () => {
      console.log('Buscando grupos terapêuticos...');
      const { data, error } = await supabase
        .from('therapeutic_groups')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar grupos terapêuticos:', error);
        throw error;
      }

      console.log('Grupos terapêuticos encontrados:', data?.length);
      return data as TherapeuticGroup[];
    },
  });
};

// Hook para buscar medicamentos de referência
export const useReferenceMedications = () => {
  return useQuery({
    queryKey: ['reference-medications'],
    queryFn: async () => {
      console.log('Buscando medicamentos de referência...');
      const { data, error } = await supabase
        .from('reference_medications')
        .select(`
          *,
          therapeutic_group:therapeutic_groups(*)
        `)
        .order('name');

      if (error) {
        console.error('Erro ao buscar medicamentos de referência:', error);
        throw error;
      }

      console.log('Medicamentos de referência encontrados:', data?.length);
      return data as ReferenceMedication[];
    },
  });
};

// Hook para buscar alternativas por medicamento de referência
export const useTherapeuticAlternativesByMedication = (medicationName: string) => {
  return useQuery({
    queryKey: ['therapeutic-alternatives', medicationName],
    queryFn: async () => {
      if (!medicationName) return null;

      console.log('Buscando alternativas para:', medicationName);
      
      // Primeiro, buscar o medicamento de referência
      const { data: refMedication, error: refError } = await supabase
        .from('reference_medications')
        .select('id, name')
        .ilike('name', `%${medicationName}%`)
        .limit(1)
        .single();

      if (refError || !refMedication) {
        console.log('Medicamento de referência não encontrado:', medicationName);
        return null;
      }

      // Buscar as alternativas
      const { data: alternatives, error: altError } = await supabase
        .from('therapeutic_alternatives')
        .select('*')
        .eq('reference_medication_id', refMedication.id)
        .order('alternative_name');

      if (altError) {
        console.error('Erro ao buscar alternativas:', altError);
        throw altError;
      }

      console.log('Alternativas encontradas:', alternatives?.length);
      return {
        referenceMedication: refMedication,
        alternatives: alternatives as TherapeuticAlternative[]
      };
    },
    enabled: !!medicationName,
  });
};

// Hook para buscar todas as alternativas terapêuticas
export const useAllTherapeuticAlternatives = () => {
  return useQuery({
    queryKey: ['all-therapeutic-alternatives'],
    queryFn: async () => {
      console.log('Buscando todas as alternativas terapêuticas...');
      const { data, error } = await supabase
        .from('therapeutic_alternatives')
        .select(`
          *,
          reference_medication:reference_medications(
            name,
            therapeutic_group:therapeutic_groups(name)
          )
        `)
        .order('alternative_name');

      if (error) {
        console.error('Erro ao buscar alternativas:', error);
        throw error;
      }

      console.log('Alternativas encontradas:', data?.length);
      return data;
    },
  });
};

// Hook para adicionar nova alternativa terapêutica
export const useAddTherapeuticAlternative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAlternative: Omit<TherapeuticAlternative, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('therapeutic_alternatives')
        .insert([newAlternative])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapeutic-alternatives'] });
      queryClient.invalidateQueries({ queryKey: ['all-therapeutic-alternatives'] });
    },
  });
};

// Hook para adicionar novo medicamento de referência
export const useAddReferenceMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMedication: Omit<ReferenceMedication, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('reference_medications')
        .insert([newMedication])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reference-medications'] });
    },
  });
};

// Hook para adicionar novo grupo terapêutico
export const useAddTherapeuticGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGroup: Omit<TherapeuticGroup, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('therapeutic_groups')
        .insert([newGroup])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapeutic-groups'] });
    },
  });
};
