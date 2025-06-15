
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';
import { generatePrintData, PrintData } from './useRoundPrint/utils/dataGenerators';
import { generateSectorReportHTML } from './useRoundPrint/generators/sectorReportGenerator';
import { generatePatientReportHTML } from './useRoundPrint/generators/patientReportGenerator';

export { PrintData };

export const useRoundPrint = (rounds: MultiprofessionalRound[]) => {
  const printBySector = () => {
    const data = generatePrintData(rounds);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = generateSectorReportHTML(data);
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const printByPatient = () => {
    const data = generatePrintData(rounds);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = generatePatientReportHTML(data);
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return {
    printBySector,
    printByPatient,
    generatePrintData: () => generatePrintData(rounds)
  };
};
