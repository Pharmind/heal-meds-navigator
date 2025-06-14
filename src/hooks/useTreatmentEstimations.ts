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
      console.log('💾 Salvando estimativa com cálculos em gramas...', {
        antimicrobial: estimation.antimicrobialName,
        unit: estimation.hospitalUnit,
        patients: estimation.activePatients,
        doseTotal: estimation.dosePerPatient,
        unidade: estimation.stockUnit
      });

      // Função para converter para gramas
      const convertToGrams = (value: number, unit: string): number => {
        switch (unit.toLowerCase()) {
          case 'mg': return value / 1000;
          case 'g': return value;
          case 'ui': return value / 1000000;
          case 'frascos': return value * 1;
          case 'ampolas': return value * 0.5;
          case 'comprimidos': return value * 0.25;
          case 'ml': return value / 1000;
          case 'l': return value * 1000;
          default: return value;
        }
      };

      // Converter valores para gramas para cálculos
      const doseInGrams = convertToGrams(estimation.dosePerPatient, estimation.stockUnit);
      const stockInGrams = convertToGrams(estimation.currentStock, estimation.stockUnit);
      
      // Cálculos em gramas
      const dailyTotalConsumptionInGrams = doseInGrams;
      const daysRemaining = stockInGrams > 0 ? stockInGrams / dailyTotalConsumptionInGrams : 0;
      const stockCoverageDays = Math.floor(daysRemaining);
      
      // Determinar nível de alerta baseado em gramas
      let alertLevel = 'normal';
      if (daysRemaining <= 0) alertLevel = 'crítico';
      else if (daysRemaining <= 2) alertLevel = 'crítico';
      else if (daysRemaining <= 5) alertLevel = 'baixo';

      console.log('🧮 Cálculos salvos em gramas:', {
        doseGramas: doseInGrams.toFixed(3),
        estoqueGramas: stockInGrams.toFixed(3),
        diasRestantes: daysRemaining.toFixed(2),
        alerta: alertLevel
      });

      const dataToSave = {
        estimation_date: estimation.estimationDate,
        hospital_unit: estimation.hospitalUnit,
        antimicrobial_name: estimation.antimicrobialName,
        dose_per_patient: Number(estimation.dosePerPatient), // Valor original na unidade selecionada
        active_patients: estimation.activePatients,
        estimated_days: estimation.estimatedDays,
        current_stock: Number(estimation.currentStock), // Valor original na unidade selecionada
        stock_unit: estimation.stockUnit,
        daily_total_consumption: Number(estimation.dosePerPatient), // Igual ao dose_per_patient
        days_remaining: daysRemaining,
        alert_level: alertLevel,
        stock_coverage_days: stockCoverageDays,
        // Adicionar as colunas antigas obrigatórias
        dose_per_patient_old: Number(estimation.dosePerPatient),
        active_patients_old: estimation.activePatients,
        daily_total_consumption_old: Number(estimation.dosePerPatient),
      };

      console.log('📝 Dados para salvar:', dataToSave);

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

      console.log('✅ Estimativa salva com cálculos em gramas:', data?.id);
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
