
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
  image_url?: string;
}

interface SupabaseIntoxication {
  id: string;
  intoxication_agent: string;
  antidote: string;
  antidote_dosage: string;
  preparation_administration: string;
  bibliography: string;
  created_at: string;
  updated_at: string;
}

interface SupabaseHighAlertMedication {
  id: string;
  type: string;
  active_ingredient: string;
  created_at: string;
  updated_at: string;
}

export interface Intoxication {
  id: string;
  intoxicationAgent: string;
  antidote: string;
  antidoteDosage: string;
  preparationAdministration: string;
  bibliography: string;
  createdAt: string;
  updatedAt: string;
}

export interface HighAlertMedication {
  id: string;
  type: string;
  activeIngredient: string;
  createdAt: string;
  updatedAt: string;
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
  imageUrl: diet.image_url || undefined,
});

const convertIntoxication = (intox: SupabaseIntoxication): Intoxication => ({
  id: intox.id,
  intoxicationAgent: intox.intoxication_agent,
  antidote: intox.antidote,
  antidoteDosage: intox.antidote_dosage,
  preparationAdministration: intox.preparation_administration,
  bibliography: intox.bibliography,
  createdAt: intox.created_at,
  updatedAt: intox.updated_at,
});

const convertHighAlertMedication = (ham: SupabaseHighAlertMedication): HighAlertMedication => ({
  id: ham.id,
  type: ham.type,
  activeIngredient: ham.active_ingredient,
  createdAt: ham.created_at,
  updatedAt: ham.updated_at,
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

// Hook para buscar intoxicações
export const useIntoxications = () => {
  return useQuery({
    queryKey: ['intoxications'],
    queryFn: async () => {
      console.log('Buscando intoxicações...');
      const { data, error } = await supabase
        .from('intoxications')
        .select('*')
        .order('intoxication_agent');

      if (error) {
        console.error('Erro ao buscar intoxicações:', error);
        throw error;
      }

      console.log('Intoxicações encontradas:', data?.length);
      return data?.map(convertIntoxication) || [];
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

// Hook para buscar medicamentos de alta vigilância
export const useHighAlertMedications = () => {
  return useQuery({
    queryKey: ['highAlertMedications'],
    queryFn: async () => {
      console.log('Buscando medicamentos de alta vigilância...');
      const { data, error } = await supabase
        .from('high_alert_medications')
        .select('*')
        .order('type', { ascending: true })
        .order('active_ingredient', { ascending: true });

      if (error) {
        console.error('Erro ao buscar medicamentos de alta vigilância:', error);
        throw error;
      }

      console.log('Medicamentos de alta vigilância encontrados:', data?.length);
      return data?.map(convertHighAlertMedication) || [];
    },
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
