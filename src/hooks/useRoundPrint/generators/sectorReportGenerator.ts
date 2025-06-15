
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PrintData } from '../utils/dataGenerators';
import { formatPatientInfo, formatCurrentStatus, formatFunctionalAssessment, formatActions } from '../utils/formatters';

export const generateSectorReportHTML = (data: PrintData): string => {
  return `
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
};
