
import { MultiprofessionalRound, RoundPatient } from '@/types/multiprofessionalRound';

export const transformRoundData = (round: any): MultiprofessionalRound => {
  return {
    ...round,
    round_type: round.round_type as 'Adulto' | 'Neonatal' | 'Pediátrica',
    renal_function: round.renal_function as 'Preservada' | 'Alterada' | null,
    hepatic_function: round.hepatic_function as 'Preservada' | 'Alterada' | null,
    pulmonary_function: round.pulmonary_function as 'Preservada' | 'Alterada' | null,
    evacuation: round.evacuation as 'Preservada' | 'Alterada' | null,
    diuresis: round.diuresis as 'Preservada' | 'Alterada' | null,
    antibiotic_action: round.antibiotic_action as 'Iniciar' | 'Ajustar' | 'Suspender' | 'Nenhuma' | null,
    patient: round.patient ? {
      ...round.patient,
      sector: round.patient.sector as 'UTI Adulto' | 'UTI Neonatal' | 'UTI Pediátrica'
    } : undefined,
    active_problems: round.active_problems?.map((problem: any) => ({
      ...problem,
      status: problem.status as 'Atingido' | 'Não atingido' | 'Suspenso' | 'Em andamento' | null
    })) || []
  } as MultiprofessionalRound;
};

export const transformPatientData = (patient: any): RoundPatient => {
  return {
    ...patient,
    sector: patient.sector as 'UTI Adulto' | 'UTI Neonatal' | 'UTI Pediátrica'
  } as RoundPatient;
};
