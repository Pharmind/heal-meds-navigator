
import jsPDF from 'jspdf';
import { RoundMetrics } from '@/hooks/useRoundReports';

export interface RoundReportData {
  metrics: RoundMetrics;
  reportType: 'complete' | 'period' | 'summary';
  period: { start: string; end: string } | null;
  generationDate: string;
}

export const generateRoundReportPDF = (data: RoundReportData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);

  // Helper function to check if we need a new page
  const checkPageBreak = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Helper function to create simple bar chart
  const createBarChart = (chartData: Record<string, number>, title: string, startY: number) => {
    const chartHeight = 60;
    const chartWidth = maxWidth - 40;
    const values = Object.values(chartData);
    const maxValue = Math.max(...values, 1); // Evita divisão por zero
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 20, startY);
    
    let currentY = startY + 15;
    
    Object.entries(chartData).forEach(([key, value]) => {
      const barHeight = 8;
      const barWidth = maxValue > 0 ? (value / maxValue) * (chartWidth - 100) : 0;
      
      // Bar background
      doc.setFillColor(240, 240, 240);
      doc.rect(margin + 20, currentY, chartWidth - 100, barHeight, 'F');
      
      // Bar fill
      if (barWidth > 0) {
        doc.setFillColor(59, 130, 246); // Blue
        doc.rect(margin + 20, currentY, barWidth, barHeight, 'F');
      }
      
      // Label and value
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(key, margin + 20, currentY - 2);
      doc.text(value.toString(), margin + 20 + chartWidth - 80, currentY + 5);
      
      currentY += 12;
    });
    
    return currentY + 10;
  };

  // Helper function to create pie chart (simplified as text representation)
  const createPieChart = (chartData: Record<string, number>, title: string, startY: number) => {
    const total = Object.values(chartData).reduce((a, b) => a + b, 0);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 20, startY);
    
    let currentY = startY + 15;
    
    Object.entries(chartData).forEach(([key, value]) => {
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`• ${key}: ${value} (${percentage}%)`, margin + 20, currentY);
      
      currentY += 8;
    });
    
    return currentY + 10;
  };

  try {
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE INTERVENÇÕES - ROUNDS MULTIPROFISSIONAIS', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Hospital Estadual de Águas Lindas de Goiás - HEAL', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setFontSize(12);
    doc.text('Gestão Farmacêutica - Rounds Multiprofissionais', pageWidth / 2, yPos, { align: 'center' });
    
    if (data.period) {
      yPos += 6;
      doc.setFontSize(10);
      doc.text(`Período: ${data.period.start} a ${data.period.end}`, pageWidth / 2, yPos, { align: 'center' });
    }
    
    yPos += 25;

    // Resumo Geral
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO GERAL', margin, yPos);
    yPos += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const totalInterventions = Object.values(data.metrics.interventionsByCategory).reduce((a, b) => a + b, 0);
    const totalClinicalIndicators = Object.values(data.metrics.clinicalIndicators).reduce((a, b) => a + b, 0);
    
    const summaryData = [
      ['Total de Rounds Realizados:', data.metrics.totalRounds.toString()],
      ['Total de Intervenções:', totalInterventions.toString()],
      ['Estimativas de Alta:', data.metrics.dischargeEstimates.toString()],
      ['Média de Rounds/Dia:', data.metrics.averageRoundsPerDay.toFixed(1)],
      ['Indicadores Clínicos Ativos:', totalClinicalIndicators.toString()]
    ];

    summaryData.forEach(([label, value]) => {
      checkPageBreak(8);
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + 80, yPos);
      yPos += 7;
    });

    yPos += 15;

    // Gráfico de Rounds por Tipo
    if (Object.keys(data.metrics.roundsByType).length > 0) {
      checkPageBreak(80);
      yPos = createBarChart(data.metrics.roundsByType, 'DISTRIBUIÇÃO POR TIPO DE ROUND', yPos);
    }

    // Gráfico de Intervenções por Área
    if (totalInterventions > 0) {
      checkPageBreak(80);
      yPos = createBarChart(data.metrics.interventionsByCategory, 'INTERVENÇÕES POR ÁREA PROFISSIONAL', yPos);
    }

    // Nova página para indicadores clínicos
    if (totalClinicalIndicators > 0) {
      doc.addPage();
      yPos = 20;
      yPos = createPieChart(data.metrics.clinicalIndicators, 'INDICADORES CLÍNICOS IDENTIFICADOS', yPos);
    }

    // Avaliação Funcional
    const totalFunctionalIssues = Object.values(data.metrics.functionalAssessment).reduce((a, b) => a + b, 0);
    if (totalFunctionalIssues > 0) {
      checkPageBreak(80);
      yPos = createPieChart(data.metrics.functionalAssessment, 'ALTERAÇÕES FUNCIONAIS IDENTIFICADAS', yPos);
    }

    // Distribuição por Setor
    if (Object.keys(data.metrics.roundsBySector).length > 0) {
      checkPageBreak(80);
      yPos = createBarChart(data.metrics.roundsBySector, 'DISTRIBUIÇÃO POR SETOR', yPos);
    }

    // Tendência temporal (apenas para relatório completo)
    if (data.reportType === 'complete' && data.metrics.periodData.length > 0) {
      checkPageBreak(100);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('TENDÊNCIA TEMPORAL - ÚLTIMOS 30 DIAS', margin, yPos);
      yPos += 20;

      // Criar gráfico de linha simplificado
      const chartHeight = 60;
      const chartWidth = maxWidth - 40;
      const roundValues = data.metrics.periodData.map(d => d.rounds);
      const maxRounds = Math.max(...roundValues, 1);
      
      // Eixos
      doc.setDrawColor(0, 0, 0);
      doc.line(margin + 20, yPos + chartHeight, margin + 20 + chartWidth, yPos + chartHeight); // X axis
      doc.line(margin + 20, yPos, margin + 20, yPos + chartHeight); // Y axis
      
      // Pontos e linhas
      doc.setDrawColor(59, 130, 246);
      data.metrics.periodData.forEach((point, index) => {
        if (index < data.metrics.periodData.length - 1) {
          const x1 = margin + 20 + (index * chartWidth / Math.max(data.metrics.periodData.length - 1, 1));
          const y1 = yPos + chartHeight - (point.rounds / maxRounds * chartHeight);
          const x2 = margin + 20 + ((index + 1) * chartWidth / Math.max(data.metrics.periodData.length - 1, 1));
          const y2 = yPos + chartHeight - (data.metrics.periodData[index + 1].rounds / maxRounds * chartHeight);
          
          doc.line(x1, y1, x2, y2);
          doc.circle(x1, y1, 1, 'F');
        }
      });
      
      yPos += chartHeight + 20;
    }

    // Conclusões e Recomendações
    checkPageBreak(80);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CONCLUSÕES E RECOMENDAÇÕES', margin, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const recommendations = [
      '• Manter frequência regular de rounds multiprofissionais',
      '• Priorizar intervenções farmacêuticas quando identificadas',
      '• Acompanhar evolução dos indicadores clínicos',
      '• Documentar sistematicamente todas as intervenções realizadas',
      '• Avaliar impacto das intervenções nos desfechos clínicos'
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
    doc.text('_'.repeat(50), margin, yPos);
    yPos += 5;
    doc.text('Farmácia Clínica - Hospital Estadual de Águas Lindas de Goiás', margin, yPos);

    console.log('PDF gerado com sucesso');
    return doc;

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Erro na geração do PDF: ' + (error as Error).message);
  }
};
