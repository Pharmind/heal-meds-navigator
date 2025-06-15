
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
        <div class="info-grid">
          <div><strong>Nome:</strong> ${patient.patient_name}</div>
          <div><strong>Idade:</strong> ${age}</div>
          <div><strong>Setor:</strong> ${patient.sector}</div>
          <div><strong>Leito:</strong> ${patient.bed}</div>
          ${patient.mother_name ? `<div><strong>Mãe:</strong> ${patient.mother_name}</div>` : ''}
          ${patient.hospitalization_days ? `<div><strong>Dias internação:</strong> ${patient.hospitalization_days}</div>` : ''}
        </div>
      </div>
    `;
  };

  const formatCurrentStatus = (round: MultiprofessionalRound) => {
    const statusItems = [
      { label: 'DVAs', value: round.dvas_usage, obs: round.dvas_usage_obs },
      { label: 'Sedoanalgesia', value: round.sedation_analgesia, obs: round.sedation_analgesia_obs },
      { label: 'Antibióticos', value: round.antibiotic_therapy, obs: round.antibiotic_therapy_obs },
      { label: 'Profilaxia TEV', value: round.tev_prophylaxis, obs: round.tev_prophylaxis_obs },
      { label: 'Profilaxia LAMG', value: round.lamg_prophylaxis, obs: round.lamg_prophylaxis_obs }
    ];

    return statusItems
      .filter(item => item.value)
      .map(item => `
        <div class="compact-item">
          <strong>${item.label}</strong>${item.obs ? `: ${item.obs}` : ''}
        </div>
      `).join('');
  };

  const formatFunctionalAssessment = (round: MultiprofessionalRound) => {
    const functions = [
      { label: 'F.Renal', value: round.renal_function, obs: round.renal_function_obs },
      { label: 'F.Hepática', value: round.hepatic_function, obs: round.hepatic_function_obs },
      { label: 'F.Pulmonar', value: round.pulmonary_function, obs: round.pulmonary_function_obs },
      { label: 'Evacuação', value: round.evacuation, obs: round.evacuation_obs },
      { label: 'Diurese', value: round.diuresis, obs: round.diuresis_obs }
    ];

    return functions
      .filter(func => func.value)
      .map(func => `
        <span class="inline-item"><strong>${func.label}:</strong> ${func.value}${func.obs ? ` (${func.obs})` : ''}</span>
      `).join(' • ');
  };

  const formatActions = (round: MultiprofessionalRound) => {
    const actions = [
      { label: 'Farm', value: round.pharmacy_actions },
      { label: 'Med', value: round.medicine_actions },
      { label: 'Enf', value: round.nursing_actions },
      { label: 'Fisio', value: round.physiotherapy_actions },
      { label: 'Nutr', value: round.nutrition_actions }
    ];

    return actions
      .filter(action => action.value)
      .map(action => `
        <div class="action-compact">
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
              padding: 15px; 
              color: #333;
              line-height: 1.3;
              font-size: 12px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header h1 { 
              color: #2563eb; 
              margin: 0 0 8px 0;
              font-size: 20px;
            }
            .print-date {
              color: #666;
              font-size: 11px;
            }
            .sector-section {
              page-break-before: always;
              margin-bottom: 25px;
            }
            .sector-section:first-child {
              page-break-before: auto;
            }
            .sector-title { 
              color: #059669; 
              font-size: 16px;
              border-bottom: 1px solid #059669;
              padding-bottom: 3px;
              margin-bottom: 15px;
            }
            .round-card { 
              border: 1px solid #d1d5db; 
              margin: 12px 0; 
              padding: 12px; 
              border-radius: 6px;
              background-color: #fafafa;
              page-break-inside: avoid;
            }
            .round-header { 
              background: #2563eb;
              color: white;
              padding: 6px 10px;
              margin: -12px -12px 10px -12px;
              border-radius: 4px 4px 0 0;
              font-size: 13px;
              font-weight: bold;
            }
            .patient-info {
              background: #eff6ff;
              padding: 8px;
              border-radius: 4px;
              margin: 8px 0;
              border-left: 3px solid #2563eb;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4px;
              font-size: 11px;
            }
            .section-title {
              color: #374151;
              font-size: 12px;
              font-weight: bold;
              margin: 12px 0 6px 0;
              padding-bottom: 2px;
              border-bottom: 1px solid #e5e7eb;
            }
            .compact-item {
              font-size: 11px;
              margin: 3px 0;
              line-height: 1.2;
            }
            .inline-item {
              font-size: 11px;
            }
            .action-compact {
              font-size: 11px;
              margin: 3px 0;
              line-height: 1.3;
            }
            .footer-info {
              background: #f3f4f6;
              padding: 6px;
              border-radius: 4px;
              margin-top: 8px;
              font-size: 10px;
            }
            @media print {
              body { margin: 0; padding: 10px; font-size: 11px; }
              .round-card { 
                box-shadow: none;
                border: 1px solid #333;
                margin: 8px 0;
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
                    <div style="font-size: 11px;">${formatFunctionalAssessment(round)}</div>
                  ` : ''}
                  
                  ${formatActions(round) ? `
                    <div class="section-title">Ações Definidas</div>
                    ${formatActions(round)}
                  ` : ''}
                  
                  ${round.discharge_estimate || round.next_evaluation || round.present_professionals ? `
                    <div class="footer-info">
                      ${round.discharge_estimate ? '<div><strong>✓ Estimativa de alta</strong></div>' : ''}
                      ${round.next_evaluation ? `<div><strong>Próx. aval.:</strong> ${format(new Date(round.next_evaluation), 'dd/MM/yyyy', { locale: ptBR })}</div>` : ''}
                      ${round.present_professionals ? `<div><strong>Presentes:</strong> ${round.present_professionals}</div>` : ''}
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
              padding: 15px; 
              color: #333;
              line-height: 1.3;
              font-size: 12px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header h1 { 
              color: #2563eb; 
              margin: 0 0 8px 0;
              font-size: 20px;
            }
            .print-date {
              color: #666;
              font-size: 11px;
            }
            .patient-section {
              page-break-before: always;
              margin-bottom: 20px;
              height: calc(100vh - 100px);
              max-height: 1000px;
            }
            .patient-section:first-child {
              page-break-before: auto;
            }
            .patient-title { 
              color: #059669; 
              font-size: 16px;
              border-bottom: 1px solid #059669;
              padding-bottom: 3px;
              margin-bottom: 12px;
            }
            .patient-summary {
              background: #eff6ff;
              padding: 8px;
              border-radius: 4px;
              margin-bottom: 12px;
              border-left: 3px solid #2563eb;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 4px;
              font-size: 11px;
            }
            .timeline-round { 
              border: 1px solid #d1d5db; 
              margin: 8px 0; 
              padding: 8px; 
              border-radius: 4px;
              background-color: #fafafa;
              border-left: 3px solid #2563eb;
              page-break-inside: avoid;
            }
            .timeline-date { 
              background: #2563eb;
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: bold;
              display: inline-block;
              margin-bottom: 8px;
            }
            .section-title {
              color: #374151;
              font-size: 11px;
              font-weight: bold;
              margin: 8px 0 4px 0;
              padding-bottom: 2px;
              border-bottom: 1px solid #e5e7eb;
            }
            .compact-item {
              font-size: 10px;
              margin: 2px 0;
              line-height: 1.2;
            }
            .inline-item {
              font-size: 10px;
            }
            .action-compact {
              font-size: 10px;
              margin: 2px 0;
              line-height: 1.3;
            }
            .round-summary {
              background: #f3f4f6;
              padding: 4px;
              border-radius: 4px;
              margin-top: 6px;
              font-size: 10px;
            }
            @media print {
              body { margin: 0; padding: 10px; font-size: 11px; }
              .timeline-round { 
                box-shadow: none;
                border: 1px solid #333;
                margin: 6px 0;
              }
              .patient-section {
                page-break-before: always;
                height: auto;
                max-height: none;
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
              
              ${rounds.slice(0, 6).map(round => `
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
                    <div style="font-size: 10px;">${formatFunctionalAssessment(round)}</div>
                  ` : ''}
                  
                  ${formatActions(round) ? `
                    <div class="section-title">Ações Definidas</div>
                    ${formatActions(round)}
                  ` : ''}
                  
                  ${round.discharge_estimate || round.next_evaluation || round.present_professionals ? `
                    <div class="round-summary">
                      ${round.discharge_estimate ? '<div><strong>✓ Estimativa de alta</strong></div>' : ''}
                      ${round.next_evaluation ? `<div><strong>Próx. aval.:</strong> ${format(new Date(round.next_evaluation), 'dd/MM/yyyy', { locale: ptBR })}</div>` : ''}
                      ${round.present_professionals ? `<div><strong>Presentes:</strong> ${round.present_professionals}</div>` : ''}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
              
              ${rounds.length > 6 ? `
                <div style="text-align: center; font-size: 10px; color: #666; margin-top: 10px;">
                  ... e mais ${rounds.length - 6} rounds anteriores
                </div>
              ` : ''}
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
