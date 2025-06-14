
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
  dailyDosePerPatient: data.daily_dose_per_patient,
  averageTreatmentDays: data.average_treatment_days,
  frequencyPerDay: data.frequency_per_day,
  totalPatientsUsing: data.total_patients_using,
  currentStock: data.current_stock,
  stockUnit: data.stock_unit,
  dailyConsumption: data.daily_consumption,
  treatmentConsumption: data.treatment_consumption,
  stockCoverageDays: data.stock_coverage_days,
  isStockSufficient: data.is_stock_sufficient,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const useTreatmentEstimations = (date?: string, hospitalUnit?: string) => {
  return useQuery({
    queryKey: ['treatmentEstimations', date, hospitalUnit],
    queryFn: async () => {
      console.log('Buscando estimativas de tratamento...');
      let query = supabase
        .from('treatment_estimations')
        .select('*')
        .order('antimicrobial_name');

      if (date) {
        query = query.eq('estimation_date', date);
      }
      if (hospitalUnit) {
        query = query.eq('hospital_unit', hospitalUnit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar estimativas:', error);
        throw error;
      }

      console.log('Estimativas encontradas:', data?.length);
      return data?.map(convertFromSupabase) || [];
    },
  });
};

export const useSaveTreatmentEstimation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (estimation: Omit<TreatmentEstimation, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('Salvando estimativa:', estimation);

      const dataToSave = {
        estimation_date: estimation.estimationDate,
        hospital_unit: estimation.hospitalUnit,
        antimicrobial_name: estimation.antimicrobialName,
        daily_dose_per_patient: estimation.dailyDosePerPatient,
        average_treatment_days: estimation.averageTreatmentDays,
        frequency_per_day: estimation.frequencyPerDay,
        total_patients_using: estimation.totalPatientsUsing,
        current_stock: estimation.currentStock,
        stock_unit: estimation.stockUnit,
        daily_consumption: estimation.dailyConsumption,
        treatment_consumption: estimation.treatmentConsumption,
        stock_coverage_days: estimation.stockCoverageDays,
        is_stock_sufficient: estimation.isStockSufficient,
      };

      const { data, error } = await supabase
        .from('treatment_estimations')
        .upsert(dataToSave, { 
          onConflict: 'estimation_date,hospital_unit,antimicrobial_name',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar estimativa:', error);
        throw error;
      }

      console.log('Estimativa salva com sucesso:', data);
      return convertFromSupabase(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatmentEstimations'] });
      toast({
        title: "Sucesso",
        description: "Estimativa salva automaticamente!",
      });
    },
    onError: (error) => {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar a estimativa. Tente novamente.",
        variant: "destructive"
      });
    },
  });
};
