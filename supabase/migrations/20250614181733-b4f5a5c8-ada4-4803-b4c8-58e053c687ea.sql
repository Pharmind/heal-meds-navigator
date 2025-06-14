
-- Atualizar a descrição e comentários das colunas para refletir a mudança conceitual
COMMENT ON COLUMN public.treatment_estimations.dose_per_patient IS 'Dose total diária da unidade (soma de todos os pacientes em mg/g/UI)';
COMMENT ON COLUMN public.treatment_estimations.daily_total_consumption IS 'Consumo diário total da unidade (igual ao dose_per_patient)';

-- Atualizar registros existentes para garantir consistência
-- O dose_per_patient agora representa a dose total da unidade, não individual
UPDATE public.treatment_estimations 
SET daily_total_consumption = dose_per_patient,
    days_remaining = CASE 
      WHEN dose_per_patient > 0 THEN current_stock / dose_per_patient 
      ELSE 0 
    END,
    stock_coverage_days = CASE 
      WHEN dose_per_patient > 0 THEN FLOOR(current_stock / dose_per_patient)
      ELSE 0 
    END,
    alert_level = CASE 
      WHEN dose_per_patient = 0 OR current_stock = 0 THEN 'crítico'
      WHEN (current_stock / dose_per_patient) <= 2 THEN 'crítico'
      WHEN (current_stock / dose_per_patient) <= 5 THEN 'baixo'
      ELSE 'normal'
    END
WHERE dose_per_patient IS NOT NULL;
