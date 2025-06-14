
import jsPDF from 'jspdf';

export interface ConsolidatedReportData {
  institutionTotals: {
    totalPatients: number;
    totalEstimations: number;
    totalSectors: number;
    totalAntimicrobials: number;
    criticalMedications: number;
    lowStockMedications: number;
  };
  summaryByAntimicrobial: Array<{
    antimicrobialName: string;
    totalPatients: number;
    totalDailyConsumption: number;
    totalStock: number;
    averageDaysRemaining: number;
    stockUnit: string;
    alertLevel: string;
    sectorsCount: number;
  }>;
  summaryBySector: Array<{
    sectorName: string;
    totalPatients: number;
    totalEstimations: number;
    criticalMedications: number;
    lowStockMedications: number;
    antimicrobials: Array<{
      name: string;
      patients: number;
      dailyConsumption: number;
      stock: number;
      daysRemaining: number;
      alertLevel: string;
      stockUnit: string;
    }>;
  }>;
  generationDate: string;
}

export const generateConsolidatedReportPDF = (data: ConsolidatedReportData) => {
  const doc = new jsPDF();
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);

  // Helper function to check if we need a new page
  const checkPageBreak = (neededSpace: number) => {
    if (yPos + neededSpace > 270) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO CONSOLIDADO DE ESTIMATIVAS', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Hospital Estadual de Águas Lindas de Goiás - HEAL', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(12);
  doc.text('Gestão Farmacêutica - Controle de Antimicrobianos', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 25;

  // Resumo Institucional
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO GERAL DA INSTITUIÇÃO', margin, yPos);
  yPos += 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const institutionalData = [
    ['Total de Pacientes:', data.institutionTotals.totalPatients.toString()],
    ['Total de Setores:', data.institutionTotals.totalSectors.toString()],
    ['Total de Antimicrobianos:', data.institutionTotals.totalAntimicrobials.toString()],
    ['Total de Estimativas:', data.institutionTotals.totalEstimations.toString()],
    ['Medicamentos em Estoque Baixo:', data.institutionTotals.lowStockMedications.toString()],
    ['Medicamentos em Estoque Crítico:', data.institutionTotals.criticalMedications.toString()]
  ];

  institutionalData.forEach(([label, value]) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 80, yPos);
    yPos += 7;
  });

  yPos += 15;

  // Consolidado por Antimicrobiano
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CONSOLIDADO POR ANTIMICROBIANO', margin, yPos);
  yPos += 15;

  // Table header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const tableHeaders = ['Antimicrobiano', 'Pacientes', 'Setores', 'Consumo/dia', 'Estoque', 'Dias Rest.', 'Status'];
  const colWidths = [45, 20, 15, 25, 25, 20, 20];
  
  let xPos = margin;
  tableHeaders.forEach((header, index) => {
    doc.rect(xPos, yPos, colWidths[index], 8);
    doc.text(header, xPos + 2, yPos + 5);
    xPos += colWidths[index];
  });
  yPos += 8;

  // Table rows
  doc.setFont('helvetica', 'normal');
  data.summaryByAntimicrobial.forEach((antimicrobial) => {
    checkPageBreak(12);
    
    const rowData = [
      antimicrobial.antimicrobialName,
      antimicrobial.totalPatients.toString(),
      antimicrobial.sectorsCount.toString(),
      `${antimicrobial.totalDailyConsumption.toLocaleString('pt-BR')} ${antimicrobial.stockUnit}`,
      `${antimicrobial.totalStock.toLocaleString('pt-BR')} ${antimicrobial.stockUnit}`,
      antimicrobial.averageDaysRemaining.toFixed(1),
      antimicrobial.alertLevel.toUpperCase()
    ];
    
    xPos = margin;
    const rowHeight = 12;
    
    rowData.forEach((cellData, index) => {
      doc.rect(xPos, yPos, colWidths[index], rowHeight);
      
      // Color coding for status
      if (index === 6) { // Status column
        if (antimicrobial.alertLevel === 'crítico') {
          doc.setTextColor(255, 0, 0); // Red
        } else if (antimicrobial.alertLevel === 'baixo') {
          doc.setTextColor(255, 165, 0); // Orange
        } else {
          doc.setTextColor(0, 128, 0); // Green
        }
      } else {
        doc.setTextColor(0, 0, 0); // Black
      }
      
      const lines = doc.splitTextToSize(cellData, colWidths[index] - 4);
      lines.forEach((line: string, lineIndex: number) => {
        doc.text(line, xPos + 2, yPos + 5 + (lineIndex * 4));
      });
      
      xPos += colWidths[index];
    });
    yPos += rowHeight;
    doc.setTextColor(0, 0, 0); // Reset color
  });

  yPos += 15;

  // Resumo por Setor
  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO POR SETOR', margin, yPos);
  yPos += 15;

  data.summaryBySector.forEach((sector) => {
    checkPageBreak(30);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(sector.sectorName, margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Pacientes: ${sector.totalPatients} | Estimativas: ${sector.totalEstimations} | Críticos: ${sector.criticalMedications} | Baixo: ${sector.lowStockMedications}`, margin + 5, yPos);
    yPos += 10;

    // Antimicrobianos do setor
    sector.antimicrobials.forEach((med) => {
      checkPageBreak(8);
      doc.setFontSize(9);
      const statusColor = med.alertLevel === 'crítico' ? 'CRÍTICO' : med.alertLevel === 'baixo' ? 'BAIXO' : 'NORMAL';
      doc.text(`• ${med.name}: ${med.patients} pac. | ${med.daysRemaining.toFixed(1)} dias | ${statusColor}`, margin + 10, yPos);
      yPos += 6;
    });
    yPos += 8;
  });

  // Recomendações
  checkPageBreak(50);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDAÇÕES PARA GESTÃO:', margin, yPos);
  yPos += 12;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const recommendations = [
    '• Priorizar reposição de medicamentos em status CRÍTICO',
    '• Monitorar consumo diário dos antimicrobianos de maior volume',
    '• Implementar controle de estoque preventivo para medicamentos em BAIXO',
    '• Avaliar redistribuição entre setores quando possível',
    '• Revisar periodicamente as estimativas de consumo'
  ];

  recommendations.forEach((rec) => {
    checkPageBreak(8);
    doc.text(rec, margin, yPos);
    yPos += 7;
  });

  // Footer
  yPos += 20;
  checkPageBreak(30);
  doc.setFontSize(9);
  doc.text(`Relatório gerado em: ${data.generationDate}`, margin, yPos);
  yPos += 10;
  doc.text('_'.repeat(40), margin, yPos);
  yPos += 5;
  doc.text('Gestão Farmacêutica - HEAL', margin, yPos);

  return doc;
};
