
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Medication, Material, Diet } from '@/types/heal';

// Tipos para dados do Supabase
interface SupabaseMedication {
  id: string;
  mv_code: string;
  name: string;
  presentation: string;
  therapeutic_class: string;
  indication: string;
  dose_adult: string;
  dose_pediatric: string;
  dose_maximum: string;
  dose_adjustment: string;
  photosensitive: boolean;
  administration_route: string;
  preparation_reconstitution: string;
  preparation_dilution: string;
  preparation_heal_standard: string;
  stability: string;
  observation: string;
  updated_at: string;
}

interface SupabaseMaterial {
  id: string;
  mv_code: string;
  name: string;
  observation: string;
}

interface SupabaseDiet {
  id: string;
  mv_code: string;
  name: string;
  observation: string;
}

// Função para converter dados do Supabase para o formato da aplicação
const convertMedication = (med: SupabaseMedication): Medication => ({
  id: med.id,
  mvCode: med.mv_code,
  name: med.name,
  presentation: med.presentation,
  therapeuticClass: med.therapeutic_class,
  indication: med.indication,
  dose: {
    adult: med.dose_adult,
    pediatric: med.dose_pediatric,
    maximum: med.dose_maximum,
  },
  doseAdjustment: med.dose_adjustment,
  photosensitive: med.photosensitive,
  administrationRoute: med.administration_route,
  preparation: {
    reconstitution: med.preparation_reconstitution,
    dilution: med.preparation_dilution,
    healStandard: med.preparation_heal_standard,
  },
  stability: med.stability,
  observation: med.observation,
  lastUpdate: new Date(med.updated_at).toLocaleDateString('pt-BR'),
});

const convertMaterial = (mat: SupabaseMaterial): Material => ({
  id: mat.id,
  mvCode: mat.mv_code,
  name: mat.name,
  observation: mat.observation,
});

const convertDiet = (diet: SupabaseDiet): Diet => ({
  id: diet.id,
  mvCode: diet.mv_code,
  name: diet.name,
  observation: diet.observation,
});

// Hook para buscar medicamentos
export const useMedications = () => {
  return useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      console.log('Buscando medicamentos...');
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar medicamentos:', error);
        throw error;
      }

      console.log('Medicamentos encontrados:', data?.length);
      return data?.map(convertMedication) || [];
    },
  });
};

// Hook para buscar materiais
export const useMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      console.log('Buscando materiais...');
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar materiais:', error);
        throw error;
      }

      console.log('Materiais encontrados:', data?.length);
      return data?.map(convertMaterial) || [];
    },
  });
};

// Hook para buscar dietas
export const useDiets = () => {
  return useQuery({
    queryKey: ['diets'],
    queryFn: async () => {
      console.log('Buscando dietas...');
      const { data, error } = await supabase
        .from('diets')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar dietas:', error);
        throw error;
      }

      console.log('Dietas encontradas:', data?.length);
      return data?.map(convertDiet) || [];
    },
  });
};

// Hook para buscar medicamento específico
export const useMedication = (id: string) => {
  return useQuery({
    queryKey: ['medication', id],
    queryFn: async () => {
      console.log('Buscando medicamento:', id);
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar medicamento:', error);
        throw error;
      }

      console.log('Medicamento encontrado:', data?.name);
      return data ? convertMedication(data) : null;
    },
    enabled: !!id,
  });
};

// Hook combinado para buscar todos os dados
export const useAllData = () => {
  const medications = useMedications();
  const materials = useMaterials();
  const diets = useDiets();

  return {
    medications: medications.data || [],
    materials: materials.data || [],
    diets: diets.data || [],
    isLoading: medications.isLoading || materials.isLoading || diets.isLoading,
    error: medications.error || materials.error || diets.error,
  };
};
