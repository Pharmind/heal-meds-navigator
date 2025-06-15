
import { useState, useEffect } from 'react';
import { RoundFormData } from '@/types/multiprofessionalRound';
import { getInitialFormData, STORAGE_KEY } from '../utils/formData';

export const useFormPersistence = () => {
  const [formData, setFormData] = useState<RoundFormData>(getInitialFormData());

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Save to localStorage when formData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFormData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(getInitialFormData());
  };

  return {
    formData,
    setFormData,
    updateFormData,
    clearFormData
  };
};
