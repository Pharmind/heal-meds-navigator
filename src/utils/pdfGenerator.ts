import jsPDF from 'jspdf';

export interface DischargeGuidelinesData {
  patientInfo: {
    name: string;
    age: string;
  };
  pharmacistInfo: {
    name: string;
    crf: string;
  };
  pathologies: Array<{
    name: string;
    basicInfo: string;
    curiosity: string;
    therapeutic: string;
  }>;
}

export const generateDischargeGuidelinesPDF = (data: DischargeGuidelinesData) => {
  const doc = new jsPDF();
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ORIENTAÇÕES FARMACÊUTICAS DE ALTA HOSPITALAR', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Hospital Estadual de Águas Lindas de Goiás - HEAL', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 20;

  // Patient Info Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO PACIENTE', margin, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${data.patientInfo.name}`, margin, yPos);
  yPos += 7;
  doc.text(`Idade: ${data.patientInfo.age} anos`, margin, yPos);
  yPos += 15;

  // Pathologies Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ORIENTAÇÕES SOBRE SUAS CONDIÇÕES DE SAÚDE', margin, yPos);
  yPos += 15;

  data.pathologies.forEach((pathology, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Pathology title
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${pathology.name}`, margin, yPos);
    yPos += 10;

    // Basic info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const basicInfoLines = doc.splitTextToSize(pathology.basicInfo, maxWidth);
    doc.text(basicInfoLines, margin, yPos);
    yPos += basicInfoLines.length * 5 + 5;

    // Curiosity
    doc.setFont('helvetica', 'italic');
    const curiosityLines = doc.splitTextToSize(pathology.curiosity, maxWidth);
    doc.text(curiosityLines, margin, yPos);
    yPos += curiosityLines.length * 5 + 5;

    // Therapeutic importance
    doc.setFont('helvetica', 'bold');
    doc.text('Importância do Tratamento:', margin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    const therapeuticLines = doc.splitTextToSize(pathology.therapeutic, maxWidth);
    doc.text(therapeuticLines, margin, yPos);
    yPos += therapeuticLines.length * 5 + 15;
  });

  // Important notes
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ORIENTAÇÕES IMPORTANTES:', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const importantNotes = [
    '• Tome os medicamentos sempre nos horários prescritos',
    '• Nunca interrompa o tratamento sem orientação médica',
    '• Em caso de dúvidas, procure o farmacêutico ou médico',
    '• Mantenha seus medicamentos em local seco e arejado',
    '• Verifique sempre a validade dos medicamentos',
    '• Retorne ao hospital conforme orientação médica'
  ];

  importantNotes.forEach(note => {
    doc.text(note, margin, yPos);
    yPos += 6;
  });

  // Footer
  yPos += 20;
  doc.setFontSize(10);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPos);
  
  yPos += 20;
  doc.text('_'.repeat(40), margin, yPos);
  yPos += 5;
  doc.text(`${data.pharmacistInfo.name} - CRF: ${data.pharmacistInfo.crf}`, margin, yPos);
  yPos += 3;
  doc.text('Farmacêutico Responsável', margin, yPos);

  return doc;
};

export interface PictogramData {
  patientData: {
    name: string;
    age: string;
    allergy: string;
    bloodType: string;
    emergencyContact: string;
  };
  medications: Array<{
    name: string;
    concentration: string;
    type: string;
    schedule: string;
    customTime: string;
    observation: string;
  }>;
  fontSize: number;
}

export const generatePictogramPDF = (data: PictogramData) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  
  // Header
  doc.setFontSize(16 + data.fontSize);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEITA EM PICTOGRAMA', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12 + data.fontSize);
  doc.setFont('helvetica', 'normal');
  doc.text('Hospital Estadual de Águas Lindas de Goiás - HEAL', pageWidth / 2, 30, { align: 'center' });
  
  // Patient info table
  let yPos = 45;
  doc.setFontSize(10 + data.fontSize);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO PACIENTE', margin, yPos);
  yPos += 8;
  
  // Create patient info table
  const patientInfoData = [
    ['Nome:', data.patientData.name],
    ['Idade:', data.patientData.age],
    ['Alergia:', data.patientData.allergy || 'Nenhuma'],
    ['Tipo Sanguíneo:', data.patientData.bloodType],
    ['Contato de Emergência:', data.patientData.emergencyContact]
  ];
  
  patientInfoData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 40, yPos);
    yPos += 6;
  });
  
  // Medications table
  yPos += 10;
  doc.setFontSize(12 + data.fontSize);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAMENTOS DE USO CONTÍNUO', margin, yPos);
  yPos += 10;
  
  // Table headers
  const colWidths = [60, 40, 30, 30, 80];
  const headers = ['Medicamento', 'Concentração', 'Tipo', 'Horário', 'Observação'];
  
  doc.setFontSize(9 + data.fontSize);
  doc.setFont('helvetica', 'bold');
  
  let xPos = margin;
  headers.forEach((header, index) => {
    doc.rect(xPos, yPos, colWidths[index], 8);
    doc.text(header, xPos + 2, yPos + 5);
    xPos += colWidths[index];
  });
  yPos += 8;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  data.medications.forEach((med) => {
    const displayTime = med.schedule === 'custom' ? med.customTime : med.schedule;
    const rowData = [
      med.name,
      med.concentration,
      med.type,
      displayTime,
      med.observation
    ];
    
    xPos = margin;
    const rowHeight = 12;
    
    rowData.forEach((cellData, index) => {
      doc.rect(xPos, yPos, colWidths[index], rowHeight);
      
      // Split text if too long
      const lines = doc.splitTextToSize(cellData, colWidths[index] - 4);
      lines.forEach((line: string, lineIndex: number) => {
        doc.text(line, xPos + 2, yPos + 5 + (lineIndex * 4));
      });
      
      xPos += colWidths[index];
    });
    yPos += rowHeight;
  });
  
  // Footer
  yPos += 15;
  doc.setFontSize(9 + data.fontSize);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPos);
  doc.text('_'.repeat(40), pageWidth - 120, yPos + 10);
  doc.text('Assinatura do Farmacêutico', pageWidth - 120, yPos + 15);
  
  return doc;
};

export interface InteractionReportData {
  patientData: {
    name: string;
    age: string;
    pharmacist: string;
    notes: string;
  };
  medications: string[];
  interactions: Array<{
    drug1Name: string;
    drug2Name: string;
    severityLevel: string;
    clinicalEffect: string;
    mechanism: string;
    management: string;
    interactionType: string;
    bibliography?: string;
  }>;
  checkDate: string;
}

export const generateInteractionReportPDF = (data: InteractionReportData) => {
  const doc = new jsPDF();
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE INTERAÇÕES MEDICAMENTOSAS', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Hospital Estadual de Águas Lindas de Goiás - HEAL', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 20;

  // Patient Info Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO PACIENTE', margin, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  if (data.patientData.name) {
    doc.text(`Paciente: ${data.patientData.name}`, margin, yPos);
    yPos += 7;
  }
  if (data.patientData.age) {
    doc.text(`Idade: ${data.patientData.age}`, margin, yPos);
    yPos += 7;
  }
  doc.text(`Data da Verificação: ${data.checkDate}`, margin, yPos);
  yPos += 7;
  if (data.patientData.pharmacist) {
    doc.text(`Farmacêutico: ${data.patientData.pharmacist}`, margin, yPos);
    yPos += 15;
  } else {
    yPos += 10;
  }

  // Medications Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAMENTOS ANALISADOS', margin, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  data.medications.forEach((med, index) => {
    doc.text(`${index + 1}. ${med}`, margin + 5, yPos);
    yPos += 6;
  });
  yPos += 10;

  // Interactions Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`INTERAÇÕES ENCONTRADAS (${data.interactions.length})`, margin, yPos);
  yPos += 15;

  if (data.interactions.length === 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Nenhuma interação encontrada na base de dados consultada.', margin, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'italic');
    doc.text('Nota: A ausência de interações neste relatório não garante ausência', margin, yPos);
    yPos += 5;
    doc.text('total de interações. Sempre consulte literatura atualizada.', margin, yPos);
  } else {
    data.interactions.forEach((interaction, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${interaction.drug1Name} × ${interaction.drug2Name}`, margin, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Gravidade: ${interaction.severityLevel.toUpperCase()} | Tipo: ${interaction.interactionType === 'drug-drug' ? 'Medicamento-Medicamento' : 'Medicamento-Nutriente'}`, margin + 5, yPos);
      yPos += 8;

      doc.setFont('helvetica', 'bold');
      doc.text('Efeito Clínico:', margin + 5, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      const effectLines = doc.splitTextToSize(interaction.clinicalEffect, maxWidth - 10);
      doc.text(effectLines, margin + 5, yPos);
      yPos += effectLines.length * 5 + 3;

      doc.setFont('helvetica', 'bold');
      doc.text('Mecanismo:', margin + 5, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      const mechanismLines = doc.splitTextToSize(interaction.mechanism, maxWidth - 10);
      doc.text(mechanismLines, margin + 5, yPos);
      yPos += mechanismLines.length * 5 + 3;

      doc.setFont('helvetica', 'bold');
      doc.text('Conduta Recomendada:', margin + 5, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      const managementLines = doc.splitTextToSize(interaction.management, maxWidth - 10);
      doc.text(managementLines, margin + 5, yPos);
      yPos += managementLines.length * 5 + 5;

      if (interaction.bibliography) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text(`Bibliografia: ${interaction.bibliography}`, margin + 5, yPos);
        yPos += 8;
      }

      yPos += 5;
    });
  }

  // Recommendations
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDAÇÕES GERAIS:', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const recommendations = [
    '• Este relatório deve ser utilizado como ferramenta de apoio clínico',
    '• Sempre considere o contexto clínico individual do paciente',
    '• Consulte literatura científica atualizada para informações adicionais',
    '• Monitore o paciente conforme as condutas recomendadas',
    '• Em caso de dúvidas, consulte o farmacêutico clínico ou médico especialista'
  ];

  recommendations.forEach(rec => {
    doc.text(rec, margin, yPos);
    yPos += 6;
  });

  // Notes
  if (data.patientData.notes) {
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÕES:', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(data.patientData.notes, maxWidth);
    doc.text(notesLines, margin, yPos);
    yPos += notesLines.length * 5;
  }

  // Footer
  yPos += 20;
  doc.setFontSize(9);
  doc.text(`Relatório gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, yPos);
  
  if (data.patientData.pharmacist) {
    yPos += 15;
    doc.text('_'.repeat(40), margin, yPos);
    yPos += 5;
    doc.text(data.patientData.pharmacist, margin, yPos);
    yPos += 3;
    doc.text('Farmacêutico Responsável', margin, yPos);
  }

  return doc;
};
