
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';

export interface PrintData {
  bySector: Record<string, MultiprofessionalRound[]>;
  byPatient: Record<string, MultiprofessionalRound[]>;
}

export const generatePrintData = (rounds: MultiprofessionalRound[]): PrintData => {
  const bySector: Record<string, MultiprofessionalRound[]> = {};
  const byPatient: Record<string, MultiprofessionalRound[]> = {};

  rounds.forEach(round => {
    const sector = round.patient?.sector || 'Setor não informado';
    const patientName = round.patient?.patient_name || 'Paciente não informado';

    if (!bySector[sector]) {
      bySector[sector] = [];
    }
    bySector[sector].push(round);

    if (!byPatient[patientName]) {
      byPatient[patientName] = [];
    }
    byPatient[patientName].push(round);
  });

  // Ordenar rounds por data dentro de cada grupo
  Object.keys(bySector).forEach(sector => {
    bySector[sector].sort((a, b) => new Date(b.round_date).getTime() - new Date(a.round_date).getTime());
  });

  Object.keys(byPatient).forEach(patient => {
    byPatient[patient].sort((a, b) => new Date(b.round_date).getTime() - new Date(a.round_date).getTime());
  });

  return { bySector, byPatient };
};
