
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AntibioticProtocol {
  id: string;
  pathogen_name: string;
  antibiotic_tested: string;
  sensitivity_result: 'S' | 'I' | 'R';
  recommendation_type: 'escalation' | 'deescalation' | 'maintain';
  recommended_antibiotic: string;
  dose: string;
  route: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  clinical_considerations?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAntibioticProtocols = () => {
  return useQuery({
    queryKey: ['antibiotic-protocols'],
    queryFn: async () => {
      console.log('Buscando protocolos de antibióticos...');
      const { data, error } = await supabase
        .from('antibiotic_protocols')
        .select('*')
        .eq('is_active', true)
        .order('pathogen_name')
        .order('antibiotic_tested');

      if (error) {
        console.error('Erro ao buscar protocolos de antibióticos:', error);
        throw error;
      }

      console.log('Protocolos de antibióticos encontrados:', data?.length);
      return data as AntibioticProtocol[];
    },
  });
};

export const useProtocolsByPathogen = (pathogenName: string, antibiotic: string, sensitivity: string) => {
  return useQuery({
    queryKey: ['antibiotic-protocols', pathogenName, antibiotic, sensitivity],
    queryFn: async () => {
      console.log('Buscando protocolos específicos para:', { pathogenName, antibiotic, sensitivity });
      const { data, error } = await supabase
        .from('antibiotic_protocols')
        .select('*')
        .eq('pathogen_name', pathogenName)
        .eq('antibiotic_tested', antibiotic)
        .eq('sensitivity_result', sensitivity)
        .eq('is_active', true)
        .order('priority', { ascending: false }); // high, medium, low

      if (error) {
        console.error('Erro ao buscar protocolos específicos:', error);
        throw error;
      }

      console.log('Protocolos específicos encontrados:', data?.length);
      return data as AntibioticProtocol[];
    },
    enabled: !!pathogenName && !!antibiotic && !!sensitivity,
  });
};

export type { AntibioticProtocol };
