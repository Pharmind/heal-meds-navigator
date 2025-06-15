
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MultiprofessionalRound, RoundPatient } from '@/types/multiprofessionalRound';
import { transformRoundData, transformPatientData } from './utils/dataTransformers';

export const useRoundQueries = () => {
  const [rounds, setRounds] = useState<MultiprofessionalRound[]>([]);
  const [patients, setPatients] = useState<RoundPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchRounds = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('multiprofessional_rounds')
        .select(`
          *,
          patient:round_patients(*),
          active_problems:round_active_problems(*)
        `)
        .order('round_date', { ascending: false });

      if (error) throw error;
      
      const typedRounds = (data || []).map(transformRoundData);
      setRounds(typedRounds);
    } catch (error) {
      console.error('Erro ao buscar rounds:', error);
      toast.error('Erro ao carregar rounds');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatients = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('round_patients')
        .select('*')
        .order('patient_name');

      if (error) throw error;
      
      const typedPatients = (data || []).map(transformPatientData);
      setPatients(typedPatients);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRounds();
      fetchPatients();
    }
  }, [user]);

  return {
    rounds,
    setRounds,
    patients,
    setPatients,
    isLoading,
    setIsLoading,
    fetchRounds,
    fetchPatients
  };
};
