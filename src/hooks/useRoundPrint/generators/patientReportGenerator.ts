
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PrintData } from '../utils/dataGenerators';
import { formatPatientInfo, formatCurrentStatus, formatFunctionalAssessment, formatActions } from '../utils/formatters';

export const generatePatientReportHTML = (data: PrintData): string => {
  return `
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
};
