
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TreatmentEstimation {
  id: string;
  estimationDate: string;
  hospitalUnit: string;
  antimicrobialName: string;
  dailyDosePerPatient: number;
  averageTreatmentDays: number;
  frequencyPerDay: number;
  totalPatientsUsing: number;
  currentStock: number;
  stockUnit: string;
  dailyConsumption: number;
  treatmentConsumption: number;
  stockCoverageDays: number;
  isStockSufficient: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SupabaseTreatmentEstimation {
  id: string;
  estimation_date: string;
  hospital_unit: string;
  antimicrobial_name: string;
  daily_dose_per_patient: number;
  average_treatment_days: number;
  frequency_per_day: number;
  total_patients_using: number;
  current_stock: number;
  stock_unit: string;
  daily_consumption: number;
  treatment_consumption: number;
  stock_coverage_days: number;
  is_stock_sufficient: boolean;
  created_at: string;
  updated_at: string;
}

const convertFromSupabase = (data: SupabaseTreatmentEstimation): TreatmentEstimation => ({
  id: data.id,
  estimationDate: data.estimation_date,
  hospitalUnit: data.hospital_unit,
  antimicrobialName: data.antimicrobial_name,
  dailyDosePerPatient: Number(data.daily_dose_per_patient),
  averageTreatmentDays: data.average_treatment_days,
  frequencyPerDay: data.frequency_per_day,
  totalPatientsUsing: data.total_patients_using,
  currentStock: Number(data.current_stock),
  stockUnit: data.stock_unit,
  dailyConsumption: Number(data.daily_consumption),
  treatmentConsumption: Number(data.treatment_consumption),
  stockCoverageDays: Number(data.stock_coverage_days),
  isStockSufficient: data.is_stock_sufficient,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const useTreatmentEstimations = (date?: string, hospitalUnit?: string) => {
  return useQuery({
    queryKey: ['treatmentEstimations', date, hospitalUnit],
    queryFn: async () => {
      console.log('🔍 Buscando estimativas de tratamento...', { date, hospitalUnit });
      
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
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSaveTreatmentEstimation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (estimation: Omit<TreatmentEstimation, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('💾 Iniciando salvamento da estimativa...', {
        antimicrobial: estimation.antimicrobialName,
        unit: estimation.hospitalUnit,
        date: estimation.estimationDate
      });

      // Validate required fields
      if (!estimation.hospitalUnit || !estimation.antimicrobialName) {
        throw new Error('Unidade hospitalar e antimicrobiano são obrigatórios');
      }

      if (estimation.dailyDosePerPatient <= 0 || estimation.totalPatientsUsing <= 0) {
        throw new Error('Dose diária e número de pacientes devem ser maiores que zero');
      }

      const dataToSave = {
        estimation_date: estimation.estimationDate,
        hospital_unit: estimation.hospitalUnit,
        antimicrobial_name: estimation.antimicrobialName,
        daily_dose_per_patient: Number(estimation.dailyDosePerPatient),
        average_treatment_days: estimation.averageTreatmentDays,
        frequency_per_day: estimation.frequencyPerDay,
        total_patients_using: estimation.totalPatientsUsing,
        current_stock: Number(estimation.currentStock),
        stock_unit: estimation.stockUnit,
        daily_consumption: Number(estimation.dailyConsumption),
        treatment_consumption: Number(estimation.treatmentConsumption),
        stock_coverage_days: Number(estimation.stockCoverageDays),
        is_stock_sufficient: estimation.isStockSufficient,
      };

      console.log('📝 Dados preparados para salvamento:', dataToSave);

      const { data, error } = await supabase
        .from('treatment_estimations')
        .upsert(dataToSave, { 
          onConflict: 'estimation_date,hospital_unit,antimicrobial_name',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro detalhado ao salvar:', error);
        
        // Handle specific database constraint errors
        if (error.code === '23514') {
          throw new Error('Dados inválidos: verifique se todos os valores são positivos');
        }
        if (error.code === '23505') {
          throw new Error('Estimativa já existe para esta data, unidade e antimicrobiano');
        }
        
        throw new Error(`Erro ao salvar: ${error.message}`);
      }

      console.log('✅ Estimativa salva com sucesso:', data?.id);
      return convertFromSupabase(data);
    },
    onSuccess: (data) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['treatmentEstimations'] });
      
      toast({
        title: "✅ Salvo com sucesso!",
        description: `Estimativa para ${data.antimicrobialName} atualizada automaticamente.`,
        duration: 2000,
      });
      
      console.log('🔄 Cache atualizado para:', data.antimicrobialName);
    },
    onError: (error) => {
      console.error('💥 Erro no salvamento:', error);
      
      toast({
        title: "❌ Erro ao salvar",
        description: error.message || "Falha ao salvar a estimativa. Tente novamente.",
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
      console.log('🗑️ Deletando estimativa:', estimationId);
      
      const { error } = await supabase
        .from('treatment_estimations')
        .delete()
        .eq('id', estimationId);

      if (error) {
        console.error('❌ Erro ao deletar:', error);
        throw new Error(`Erro ao deletar: ${error.message}`);
      }

      console.log('✅ Estimativa deletada com sucesso');
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
