
import { useRoundQueries } from './useRoundData/useRoundQueries';
import { useRoundOperations } from './useRoundData/useRoundOperations';

export const useRoundData = () => {
  const {
    rounds,
    patients,
    isLoading,
    setIsLoading,
    fetchRounds,
    fetchPatients
  } = useRoundQueries();

  const {
    createRound,
    updateRound,
    deleteRound
  } = useRoundOperations(fetchRounds, fetchPatients, setIsLoading);

  return {
    rounds,
    patients,
    isLoading,
    createRound,
    updateRound,
    deleteRound,
    fetchRounds,
    fetchPatients
  };
};
