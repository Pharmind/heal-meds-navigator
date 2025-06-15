
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface PrintData {
  bySector: Record<string, MultiprofessionalRound[]>;
  byPatient: Record<string, MultiprofessionalRound[]>;
}

export const useRoundPrint = (rounds: MultiprofessionalRound[]) => {
  const generatePrintData = (): PrintData => {
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

  const printBySector = () => {
    const data = generatePrintData();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Rounds por Setor</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #059669; margin-top: 30px; }
            .round-item { 
              border: 1px solid #e5e7eb; 
              margin: 10px 0; 
              padding: 15px; 
              border-radius: 5px;
              background-color: #f9fafb;
            }
            .round-header { font-weight: bold; margin-bottom: 8px; }
            .round-info { margin: 5px 0; }
            .status-list { margin: 10px 0; }
            .status-item { 
              display: inline-block; 
              background: #ddd6fe; 
              padding: 2px 8px; 
              margin: 2px; 
              border-radius: 12px; 
              font-size: 12px;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Relatório de Rounds por Setor</h1>
          <p><strong>Data de impressão:</strong> ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
          
          ${Object.entries(data.bySector).map(([sector, rounds]) => `
            <h2>${sector} (${rounds.length} rounds)</h2>
            ${rounds.map(round => `
              <div class="round-item">
                <div class="round-header">
                  ${round.patient?.patient_name || 'Nome não informado'} - Leito ${round.patient?.bed || 'N/A'}
                </div>
                <div class="round-info">
                  <strong>Data:</strong> ${format(new Date(round.round_date), 'dd/MM/yyyy', { locale: ptBR })} | 
                  <strong>Tipo:</strong> ${round.round_type}
                </div>
                <div class="status-list">
                  ${round.dvas_usage ? '<span class="status-item">DVAs em uso</span>' : ''}
                  ${round.antibiotic_therapy ? '<span class="status-item">Antibioticoterapia</span>' : ''}
                  ${round.sedation_analgesia ? '<span class="status-item">Sedoanalgesia</span>' : ''}
                  ${round.discharge_estimate ? '<span class="status-item">Estimativa de alta</span>' : ''}
                </div>
                ${round.next_evaluation ? `<div class="round-info"><strong>Próxima avaliação:</strong> ${format(new Date(round.next_evaluation), 'dd/MM/yyyy', { locale: ptBR })}</div>` : ''}
              </div>
            `).join('')}
          `).join('')}
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const printByPatient = () => {
    const data = generatePrintData();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Rounds por Paciente</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #059669; margin-top: 30px; }
            .round-item { 
              border: 1px solid #e5e7eb; 
              margin: 10px 0; 
              padding: 15px; 
              border-radius: 5px;
              background-color: #f9fafb;
            }
            .round-header { font-weight: bold; margin-bottom: 8px; }
            .round-info { margin: 5px 0; }
            .status-list { margin: 10px 0; }
            .status-item { 
              display: inline-block; 
              background: #ddd6fe; 
              padding: 2px 8px; 
              margin: 2px; 
              border-radius: 12px; 
              font-size: 12px;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Relatório de Rounds por Paciente</h1>
          <p><strong>Data de impressão:</strong> ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
          
          ${Object.entries(data.byPatient).map(([patient, rounds]) => `
            <h2>${patient} (${rounds.length} rounds)</h2>
            ${rounds.map(round => `
              <div class="round-item">
                <div class="round-header">
                  ${format(new Date(round.round_date), 'dd/MM/yyyy', { locale: ptBR })} - ${round.round_type}
                </div>
                <div class="round-info">
                  <strong>Setor:</strong> ${round.patient?.sector || 'N/A'} | 
                  <strong>Leito:</strong> ${round.patient?.bed || 'N/A'}
                </div>
                <div class="status-list">
                  ${round.dvas_usage ? '<span class="status-item">DVAs em uso</span>' : ''}
                  ${round.antibiotic_therapy ? '<span class="status-item">Antibioticoterapia</span>' : ''}
                  ${round.sedation_analgesia ? '<span class="status-item">Sedoanalgesia</span>' : ''}
                  ${round.discharge_estimate ? '<span class="status-item">Estimativa de alta</span>' : ''}
                </div>
                ${round.next_evaluation ? `<div class="round-info"><strong>Próxima avaliação:</strong> ${format(new Date(round.next_evaluation), 'dd/MM/yyyy', { locale: ptBR })}</div>` : ''}
              </div>
            `).join('')}
          `).join('')}
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return {
    printBySector,
    printByPatient,
    generatePrintData
  };
};
