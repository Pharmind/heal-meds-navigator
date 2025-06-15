
import { useMemo } from 'react';
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';
import { format, subDays, isAfter, isBefore, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface RoundMetrics {
  totalRounds: number;
  roundsByType: Record<string, number>;
  roundsBySector: Record<string, number>;
  interventionsByCategory: {
    pharmacy: number;
    medicine: number;
    nursing: number;
    physiotherapy: number;
    nutrition: number;
  };
  clinicalIndicators: {
    dvasUsage: number;
    antibioticTherapy: number;
    sedationAnalgesia: number;
    tevProphylaxis: number;
    lamgProphylaxis: number;
  };
  functionalAssessment: {
    renalAltered: number;
    hepaticAltered: number;
    pulmonaryAltered: number;
    evacuationAltered: number;
    diuresisAltered: number;
  };
  dischargeEstimates: number;
  averageRoundsPerDay: number;
  periodData: Array<{
    date: string;
    rounds: number;
    interventions: number;
  }>;
}

export const useRoundReports = (rounds: MultiprofessionalRound[]) => {
  const generateMetrics = (startDate?: Date, endDate?: Date): RoundMetrics => {
    let filteredRounds = rounds;
    
    if (startDate && endDate) {
      filteredRounds = rounds.filter(round => {
        const roundDate = new Date(round.round_date);
        return (isAfter(roundDate, startDate) || isSameDay(roundDate, startDate)) && 
               (isBefore(roundDate, endDate) || isSameDay(roundDate, endDate));
      });
    }

    console.log('Total rounds:', rounds.length);
    console.log('Filtered rounds:', filteredRounds.length);

    const totalRounds = filteredRounds.length;
    
    // Rounds por tipo
    const roundsByType = filteredRounds.reduce((acc, round) => {
      const type = round.round_type || 'Não informado';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Rounds por setor
    const roundsBySector = filteredRounds.reduce((acc, round) => {
      const sector = round.patient?.sector || 'Não informado';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Intervenções por categoria
    const interventionsByCategory = {
      pharmacy: filteredRounds.filter(r => r.pharmacy_actions && r.pharmacy_actions.trim() !== '').length,
      medicine: filteredRounds.filter(r => r.medicine_actions && r.medicine_actions.trim() !== '').length,
      nursing: filteredRounds.filter(r => r.nursing_actions && r.nursing_actions.trim() !== '').length,
      physiotherapy: filteredRounds.filter(r => r.physiotherapy_actions && r.physiotherapy_actions.trim() !== '').length,
      nutrition: filteredRounds.filter(r => r.nutrition_actions && r.nutrition_actions.trim() !== '').length,
    };

    // Indicadores clínicos
    const clinicalIndicators = {
      dvasUsage: filteredRounds.filter(r => r.dvas_usage === true).length,
      antibioticTherapy: filteredRounds.filter(r => r.antibiotic_therapy === true).length,
      sedationAnalgesia: filteredRounds.filter(r => r.sedation_analgesia === true).length,
      tevProphylaxis: filteredRounds.filter(r => r.tev_prophylaxis === true).length,
      lamgProphylaxis: filteredRounds.filter(r => r.lamg_prophylaxis === true).length,
    };

    // Avaliação funcional
    const functionalAssessment = {
      renalAltered: filteredRounds.filter(r => r.renal_function === 'Alterada').length,
      hepaticAltered: filteredRounds.filter(r => r.hepatic_function === 'Alterada').length,
      pulmonaryAltered: filteredRounds.filter(r => r.pulmonary_function === 'Alterada').length,
      evacuationAltered: filteredRounds.filter(r => r.evacuation === 'Alterada').length,
      diuresisAltered: filteredRounds.filter(r => r.diuresis === 'Alterada').length,
    };

    const dischargeEstimates = filteredRounds.filter(r => r.discharge_estimate === true).length;

    // Dados por período (últimos 30 dias)
    const periodData = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayRounds = filteredRounds.filter(r => 
        format(new Date(r.round_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      const interventions = dayRounds.reduce((acc, round) => {
        let count = 0;
        if (round.pharmacy_actions && round.pharmacy_actions.trim() !== '') count++;
        if (round.medicine_actions && round.medicine_actions.trim() !== '') count++;
        if (round.nursing_actions && round.nursing_actions.trim() !== '') count++;
        if (round.physiotherapy_actions && round.physiotherapy_actions.trim() !== '') count++;
        if (round.nutrition_actions && round.nutrition_actions.trim() !== '') count++;
        return acc + count;
      }, 0);

      periodData.push({
        date: format(date, 'dd/MM', { locale: ptBR }),
        rounds: dayRounds.length,
        interventions
      });
    }

    const averageRoundsPerDay = periodData.length > 0 
      ? periodData.reduce((acc, day) => acc + day.rounds, 0) / periodData.length 
      : 0;

    return {
      totalRounds,
      roundsByType,
      roundsBySector,
      interventionsByCategory,
      clinicalIndicators,
      functionalAssessment,
      dischargeEstimates,
      averageRoundsPerDay,
      periodData
    };
  };

  const metrics = useMemo(() => generateMetrics(), [rounds]);

  return {
    metrics,
    generateMetrics
  };
};
