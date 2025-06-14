
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TreatmentEstimation {
  id: string;
  estimationDate: string;
  hospitalUnit: string;
  antimicrobialName: string;
  dosePerPatient: number;
  activePatients: number;
  estimatedDays: number;
  currentStock: number;
  stockUnit: string;
  dailyTotalConsumption: number;
  daysRemaining: number;
  alertLevel: string;
  stockCoverageDays: number;
  createdAt: string;
  updatedAt: string;
}

interface SupabaseTreatmentEstimation {
  id: string;
  estimation_date: string;
  hospital_unit: string;
  antimicrobial_name: string;
  dose_per_patient: number;
  active_patients: number;
  estimated_days: number;
  current_stock: number;
  stock_unit: string;
  daily_total_consumption: number;
  days_remaining: number;
  alert_level: string;
  stock_coverage_days: number;
  created_at: string;
  updated_at: string;
}

const convertFromSupabase = (data: SupabaseTreatmentEstimation): TreatmentEstimation => ({
  id: data.id,
  estimationDate: data.estimation_date,
  hospitalUnit: data.hospital_unit,
  antimicrobialName: data.antimicrobial_name,
  dosePerPatient: Number(data.dose_per_patient),
  activePatients: data.active_patients,
  estimatedDays: data.estimated_days,
  currentStock: Number(data.current_stock),
  stockUnit: data.stock_unit,
  dailyTotalConsumption: Number(data.daily_total_consumption),
  daysRemaining: Number(data.days_remaining),
  alertLevel: data.alert_level,
  stockCoverageDays: Number(data.stock_coverage_days),
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const useTreatmentEstimations = (date?: string, hospitalUnit?: string) => {
  return useQuery({
    queryKey: ['treatmentEstimations', date, hospitalUnit],
    queryFn: async () => {
      console.log('🔍 Buscando estimativas simplificadas...', { date, hospitalUnit });
      
      let query = supabase
        .from('treatment_estimations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (date) {
        query = query.eq('estimation_date', date);
      }
      if (hospitalUnit) {
        query = query.eq('hospital_unit', hospitalUnit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erro ao buscar estimativas:', error);
        throw new Error(`Erro ao carregar estimativas: ${error.message}`);
      }

      console.log(`✅ ${data?.length || 0} estimativas encontradas`);
      return data?.map(convertFromSupabase) || [];
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useSaveTreatmentEstimation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (estimation: Omit<TreatmentEstimation, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('💾 Salvando estimativa simplificada...', {
        antimicrobial: estimation.antimicrobialName,
        unit: estimation.hospitalUnit,
        patients: estimation.activePatients
      });

      // Calcular valores automaticamente
      const dailyTotalConsumption = estimation.dosePerPatient * estimation.activePatients;
      const daysRemaining = estimation.currentStock > 0 ? estimation.currentStock / dailyTotalConsumption : 0;
      const stockCoverageDays = Math.floor(daysRemaining);
      
      // Determinar nível de alerta
      let alertLevel = 'normal';
      if (daysRemaining <= 0) alertLevel = 'crítico';
      else if (daysRemaining <= 2) alertLevel = 'crítico';
      else if (daysRemaining <= 5) alertLevel = 'baixo';

      const dataToSave = {
        estimation_date: estimation.estimationDate,
        hospital_unit: estimation.hospitalUnit,
        antimicrobial_name: estimation.antimicrobialName,
        dose_per_patient: Number(estimation.dosePerPatient),
        active_patients: estimation.activePatients,
        estimated_days: estimation.estimatedDays,
        current_stock: Number(estimation.currentStock),
        stock_unit: estimation.stockUnit,
        daily_total_consumption: dailyTotalConsumption,
        days_remaining: daysRemaining,
        alert_level: alertLevel,
        stock_coverage_days: stockCoverageDays,
      };

      console.log('📝 Dados calculados:', dataToSave);

      const { data, error } = await supabase
        .from('treatment_estimations')
        .upsert(dataToSave, { 
          onConflict: 'estimation_date,hospital_unit,antimicrobial_name',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar:', error);
        throw new Error(`Erro ao salvar: ${error.message}`);
      }

      console.log('✅ Estimativa salva com sucesso:', data?.id);
      return convertFromSupabase(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['treatmentEstimations'] });
      
      const alertMessage = data.alertLevel === 'crítico' ? '🚨 ESTOQUE CRÍTICO!' : 
                          data.alertLevel === 'baixo' ? '⚠️ Estoque baixo' : 
                          '✅ Salvo com sucesso!';
      
      toast({
        title: alertMessage,
        description: `${data.antimicrobialName} - ${data.daysRemaining.toFixed(1)} dias restantes`,
        duration: 3000,
        variant: data.alertLevel === 'crítico' ? 'destructive' : 'default',
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Erro ao salvar",
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    },
  });
};

export const useDeleteTreatmentEstimation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (estimationId: string) => {
      const { error } = await supabase
        .from('treatment_estimations')
        .delete()
        .eq('id', estimationId);

      if (error) {
        throw new Error(`Erro ao deletar: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatmentEstimations'] });
      toast({
        title: "✅ Deletado!",
        description: "Estimativa removida com sucesso.",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Erro ao deletar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
