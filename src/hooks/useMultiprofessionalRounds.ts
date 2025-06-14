
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MultiprofessionalRound {
  id: string;
  patient_name: string;
  medical_record: string;
  date: string;
  participants: string;
  main_issues: string;
  clinical_evolution: string;
  medication_review: string;
  next_steps: string;
  observations: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface MultiprofessionalRoundData {
  patient_name: string;
  medical_record: string;
  date: string;
  participants: string;
  main_issues: string;
  clinical_evolution: string;
  medication_review: string;
  next_steps: string;
  observations?: string;
}

export const useMultiprofessionalRounds = () => {
  const [rounds, setRounds] = useState<MultiprofessionalRound[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchRounds = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('multiprofessional_rounds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRounds(data || []);
    } catch (error) {
      console.error('Erro ao buscar rounds:', error);
      toast.error('Erro ao carregar rounds multiprofissionais');
    } finally {
      setIsLoading(false);
    }
  };

  const createRound = async (roundData: MultiprofessionalRoundData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('multiprofessional_rounds')
        .insert([{
          ...roundData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setRounds(prev => [data, ...prev]);
      toast.success('Round multiprofissional criado com sucesso');
      return data;
    } catch (error) {
      console.error('Erro ao criar round:', error);
      toast.error('Erro ao criar round multiprofissional');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRound = async (id: string, roundData: MultiprofessionalRoundData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('multiprofessional_rounds')
        .update(roundData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setRounds(prev => prev.map(round => round.id === id ? data : round));
      toast.success('Round multiprofissional atualizado com sucesso');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar round:', error);
      toast.error('Erro ao atualizar round multiprofissional');
      throw error;
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
      
      setRounds(prev => prev.filter(round => round.id !== id));
      toast.success('Round multiprofissional excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir round:', error);
      toast.error('Erro ao excluir round multiprofissional');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadRoundPDF = async (id: string) => {
    try {
      const round = rounds.find(r => r.id === id);
      if (!round) {
        toast.error('Round não encontrado');
        return;
      }

      // Simular download de PDF
      toast.success('Funcionalidade de download será implementada em breve');
      console.log('Downloading PDF for round:', round);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      toast.error('Erro ao baixar PDF do round');
    }
  };

  useEffect(() => {
    fetchRounds();
  }, [user]);

  return {
    rounds,
    createRound,
    updateRound,
    deleteRound,
    downloadRoundPDF,
    isLoading,
    refetch: fetchRounds
  };
};
