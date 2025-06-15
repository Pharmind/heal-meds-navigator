
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

  const formatPatientInfo = (round: MultiprofessionalRound) => {
    const patient = round.patient;
    if (!patient) return 'Informações do paciente não disponíveis';

    const age = patient.birth_date 
      ? `${Math.floor((new Date().getTime() - new Date(patient.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} anos`
      : 'Idade não informada';

    return `
      <div class="patient-info">
        <strong>Nome:</strong> ${patient.patient_name}<br>
        <strong>Idade:</strong> ${age}<br>
        <strong>Setor:</strong> ${patient.sector}<br>
        <strong>Leito:</strong> ${patient.bed}<br>
        ${patient.mother_name ? `<strong>Nome da mãe:</strong> ${patient.mother_name}<br>` : ''}
        ${patient.hospitalization_days ? `<strong>Dias de internação:</strong> ${patient.hospitalization_days}<br>` : ''}
      </div>
    `;
  };

  const formatCurrentStatus = (round: MultiprofessionalRound) => {
    const statusItems = [
      { label: 'DVAs em uso', value: round.dvas_usage, obs: round.dvas_usage_obs },
      { label: 'Sedoanalgesia', value: round.sedation_analgesia, obs: round.sedation_analgesia_obs },
      { label: 'Antibioticoterapia', value: round.antibiotic_therapy, obs: round.antibiotic_therapy_obs },
      { label: 'Profilaxia TEV', value: round.tev_prophylaxis, obs: round.tev_prophylaxis_obs },
      { label: 'Profilaxia LAMG', value: round.lamg_prophylaxis, obs: round.lamg_prophylaxis_obs }
    ];

    return statusItems
      .filter(item => item.value)
      .map(item => `
        <div class="status-item">
          <strong>${item.label}</strong>
          ${item.obs ? `<br><em>Obs: ${item.obs}</em>` : ''}
        </div>
      `).join('');
  };

  const formatFunctionalAssessment = (round: MultiprofessionalRound) => {
    const functions = [
      { label: 'Função Renal', value: round.renal_function, obs: round.renal_function_obs },
      { label: 'Função Hepática', value: round.hepatic_function, obs: round.hepatic_function_obs },
      { label: 'Função Pulmonar', value: round.pulmonary_function, obs: round.pulmonary_function_obs },
      { label: 'Evacuação', value: round.evacuation, obs: round.evacuation_obs },
      { label: 'Diurese', value: round.diuresis, obs: round.diuresis_obs }
    ];

    return functions
      .filter(func => func.value)
      .map(func => `
        <div class="function-item">
          <strong>${func.label}:</strong> ${func.value}
          ${func.obs ? `<br><em>Obs: ${func.obs}</em>` : ''}
        </div>
      `).join('');
  };

  const formatActions = (round: MultiprofessionalRound) => {
    const actions = [
      { label: 'Farmácia', value: round.pharmacy_actions },
      { label: 'Medicina', value: round.medicine_actions },
      { label: 'Enfermagem', value: round.nursing_actions },
      { label: 'Fisioterapia', value: round.physiotherapy_actions },
      { label: 'Nutrição', value: round.nutrition_actions }
    ];

    return actions
      .filter(action => action.value)
      .map(action => `
        <div class="action-item">
          <strong>${action.label}:</strong> ${action.value}
        </div>
      `).join('');
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
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #333;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 { 
              color: #2563eb; 
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .print-date {
              color: #666;
              font-size: 14px;
            }
            .sector-section {
              page-break-before: auto;
              margin-bottom: 40px;
            }
            .sector-title { 
              color: #059669; 
              font-size: 22px;
              border-bottom: 2px solid #059669;
              padding-bottom: 5px;
              margin-bottom: 20px;
            }
            .round-card { 
              border: 2px solid #e5e7eb; 
              margin: 20px 0; 
              padding: 20px; 
              border-radius: 8px;
              background-color: #f9fafb;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .round-header { 
              background: #2563eb;
              color: white;
              padding: 10px 15px;
              margin: -20px -20px 15px -20px;
              border-radius: 6px 6px 0 0;
              font-size: 18px;
              font-weight: bold;
            }
            .patient-info {
              background: #eff6ff;
              padding: 15px;
              border-radius: 6px;
              margin: 15px 0;
              border-left: 4px solid #2563eb;
            }
            .section-title {
              color: #374151;
              font-size: 16px;
              font-weight: bold;
              margin: 20px 0 10px 0;
              padding-bottom: 5px;
              border-bottom: 1px solid #d1d5db;
            }
            .status-item, .function-item, .action-item {
              background: white;
              padding: 10px;
              margin: 8px 0;
              border-radius: 4px;
              border-left: 3px solid #10b981;
            }
            .footer-info {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 6px;
              margin-top: 15px;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .round-card { 
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #000;
              }
              .sector-section {
                page-break-before: always;
              }
              .sector-section:first-child {
                page-break-before: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Rounds por Setor</h1>
            <div class="print-date">
              <strong>Data de impressão:</strong> ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </div>
          </div>
          
          ${Object.entries(data.bySector).map(([sector, rounds]) => `
            <div class="sector-section">
              <h2 class="sector-title">${sector} (${rounds.length} rounds)</h2>
              ${rounds.map(round => `
                <div class="round-card">
                  <div class="round-header">
                    Round ${round.round_type} - ${format(new Date(round.round_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                  
                  ${formatPatientInfo(round)}
                  
                  ${formatCurrentStatus(round) ? `
                    <div class="section-title">Status Atual</div>
                    ${formatCurrentStatus(round)}
                  ` : ''}
                  
                  ${formatFunctionalAssessment(round) ? `
                    <div class="section-title">Avaliação Funcional</div>
                    ${formatFunctionalAssessment(round)}
                  ` : ''}
                  
                  ${formatActions(round) ? `
                    <div class="section-title">Ações Definidas</div>
                    ${formatActions(round)}
                  ` : ''}
                  
                  ${round.discharge_estimate || round.next_evaluation || round.present_professionals ? `
                    <div class="footer-info">
                      ${round.discharge_estimate ? '<div><strong>✓ Há estimativa de alta</strong></div>' : ''}
                      ${round.next_evaluation ? `<div><strong>Próxima avaliação:</strong> ${format(new Date(round.next_evaluation), 'dd/MM/yyyy', { locale: ptBR })}</div>` : ''}
                      ${round.present_professionals ? `<div><strong>Profissionais presentes:</strong> ${round.present_professionals}</div>` : ''}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `).join('')}
          
          <script>
            window.onload = function() {
              setTimeout(() => window.print(), 500);
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
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #333;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 { 
              color: #2563eb; 
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .print-date {
              color: #666;
              font-size: 14px;
            }
            .patient-section {
              page-break-before: auto;
              margin-bottom: 40px;
            }
            .patient-title { 
              color: #059669; 
              font-size: 22px;
              border-bottom: 2px solid #059669;
              padding-bottom: 5px;
              margin-bottom: 20px;
            }
            .timeline-round { 
              border: 2px solid #e5e7eb; 
              margin: 20px 0; 
              padding: 20px; 
              border-radius: 8px;
              background-color: #f9fafb;
              position: relative;
              border-left: 4px solid #2563eb;
            }
            .timeline-date { 
              background: #2563eb;
              color: white;
              padding: 8px 15px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
              margin-bottom: 15px;
            }
            .patient-summary {
              background: #eff6ff;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 20px;
              border-left: 4px solid #2563eb;
            }
            .section-title {
              color: #374151;
              font-size: 16px;
              font-weight: bold;
              margin: 20px 0 10px 0;
              padding-bottom: 5px;
              border-bottom: 1px solid #d1d5db;
            }
            .status-item, .function-item, .action-item {
              background: white;
              padding: 10px;
              margin: 8px 0;
              border-radius: 4px;
              border-left: 3px solid #10b981;
            }
            .round-summary {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 6px;
              margin-top: 15px;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .timeline-round { 
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #000;
              }
              .patient-section {
                page-break-before: always;
              }
              .patient-section:first-child {
                page-break-before: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Rounds por Paciente</h1>
            <div class="print-date">
              <strong>Data de impressão:</strong> ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </div>
          </div>
          
          ${Object.entries(data.byPatient).map(([patient, rounds]) => {
            const latestRound = rounds[0];
            return `
            <div class="patient-section">
              <h2 class="patient-title">${patient} (${rounds.length} rounds)</h2>
              
              <div class="patient-summary">
                ${formatPatientInfo(latestRound)}
              </div>
              
              ${rounds.map(round => `
                <div class="timeline-round">
                  <div class="timeline-date">
                    ${format(new Date(round.round_date), 'dd/MM/yyyy', { locale: ptBR })} - Round ${round.round_type}
                  </div>
                  
                  ${formatCurrentStatus(round) ? `
                    <div class="section-title">Status Atual</div>
                    ${formatCurrentStatus(round)}
                  ` : ''}
                  
                  ${formatFunctionalAssessment(round) ? `
                    <div class="section-title">Avaliação Funcional</div>
                    ${formatFunctionalAssessment(round)}
                  ` : ''}
                  
                  ${formatActions(round) ? `
                    <div class="section-title">Ações Definidas</div>
                    ${formatActions(round)}
                  ` : ''}
                  
                  ${round.discharge_estimate || round.next_evaluation || round.present_professionals ? `
                    <div class="round-summary">
                      ${round.discharge_estimate ? '<div><strong>✓ Há estimativa de alta</strong></div>' : ''}
                      ${round.next_evaluation ? `<div><strong>Próxima avaliação:</strong> ${format(new Date(round.next_evaluation), 'dd/MM/yyyy', { locale: ptBR })}</div>` : ''}
                      ${round.present_professionals ? `<div><strong>Profissionais presentes:</strong> ${round.present_professionals}</div>` : ''}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `}).join('')}
          
          <script>
            window.onload = function() {
              setTimeout(() => window.print(), 500);
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
