
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Pathology {
  id: string;
  name: string;
  description: string;
  basicInfo: string;
  curiosity: string;
  therapeutic: string;
  iconName: string;
  createdAt: string;
  updatedAt: string;
}

interface SupabasePathology {
  id: string;
  name: string;
  description: string;
  basic_info: string;
  curiosity: string;
  therapeutic: string;
  icon_name: string;
  created_at: string;
  updated_at: string;
}

const convertPathology = (pathology: SupabasePathology): Pathology => ({
  id: pathology.id,
  name: pathology.name,
  description: pathology.description,
  basicInfo: pathology.basic_info,
  curiosity: pathology.curiosity,
  therapeutic: pathology.therapeutic,
  iconName: pathology.icon_name,
  createdAt: pathology.created_at,
  updatedAt: pathology.updated_at,
});

export const usePathologies = () => {
  return useQuery({
    queryKey: ['pathologies'],
    queryFn: async () => {
      console.log('Buscando patologias...');
      const { data, error } = await supabase
        .from('pathologies')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar patologias:', error);
        throw error;
      }

      console.log('Patologias encontradas:', data?.length);
      return data?.map(convertPathology) || [];
    },
  });
};

export const useCreatePathology = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pathology: Omit<Pathology, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('pathologies')
        .insert({
          name: pathology.name,
          description: pathology.description,
          basic_info: pathology.basicInfo,
          curiosity: pathology.curiosity,
          therapeutic: pathology.therapeutic,
          icon_name: pathology.iconName,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar patologia:', error);
        throw error;
      }

      return convertPathology(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pathologies'] });
    },
  });
};
