
-- Update treatment_estimations table to ensure proper constraints and indexing
-- Add any missing columns and improve the structure

-- First, let's ensure the unique constraint is properly set
ALTER TABLE public.treatment_estimations 
DROP CONSTRAINT IF EXISTS treatment_estimations_estimation_date_hospital_unit_antimicrob_key;

-- Add the unique constraint with proper naming
ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT unique_estimation_per_unit_drug_date 
UNIQUE(estimation_date, hospital_unit, antimicrobial_name);

-- Ensure all numeric columns are properly typed
ALTER TABLE public.treatment_estimations 
ALTER COLUMN daily_dose_per_patient TYPE DECIMAL(10,3);

ALTER TABLE public.treatment_estimations 
ALTER COLUMN current_stock TYPE DECIMAL(12,3);

ALTER TABLE public.treatment_estimations 
ALTER COLUMN daily_consumption TYPE DECIMAL(12,3);

ALTER TABLE public.treatment_estimations 
ALTER COLUMN treatment_consumption TYPE DECIMAL(12,3);

ALTER TABLE public.treatment_estimations 
ALTER COLUMN stock_coverage_days TYPE DECIMAL(8,2);

-- Add trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_treatment_estimations_updated_at ON public.treatment_estimations;

CREATE TRIGGER update_treatment_estimations_updated_at
    BEFORE UPDATE ON public.treatment_estimations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add additional indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_treatment_estimations_updated_at 
ON public.treatment_estimations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_treatment_estimations_stock_status 
ON public.treatment_estimations(is_stock_sufficient, estimation_date);

-- Add check constraints for data validation
ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT check_positive_daily_dose 
CHECK (daily_dose_per_patient > 0);

ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT check_positive_treatment_days 
CHECK (average_treatment_days > 0);

ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT check_positive_frequency 
CHECK (frequency_per_day > 0);

ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT check_positive_patients 
CHECK (total_patients_using > 0);

ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT check_non_negative_stock 
CHECK (current_stock >= 0);

ALTER TABLE public.treatment_estimations 
ADD CONSTRAINT check_non_negative_coverage 
CHECK (stock_coverage_days >= 0);

-- Update table comment
COMMENT ON TABLE public.treatment_estimations IS 'Estimativas diárias de consumo de antimicrobianos por unidade hospitalar com cálculos automáticos';
