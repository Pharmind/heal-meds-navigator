
import { useState } from 'react';
import { useDrugInteractions, checkDrugInteractions } from '@/hooks/useDrugInteractions';
import { generateInteractionReportPDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';
import MedicationSearch from './interactions/MedicationSearch';
import InteractionAnalysis from './interactions/InteractionAnalysis';

const DrugInteractions = () => {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  
  const { data: allInteractions = [], isLoading } = useDrugInteractions();
  
  const foundInteractions = checkDrugInteractions(selectedMedications, allInteractions);

  const handleMedicationAdd = (medication: string) => {
    if (selectedMedications.length >= 20) {
      toast.error('Máximo de 20 medicamentos permitidos');
      return;
    }
    
    if (!selectedMedications.includes(medication)) {
      setSelectedMedications(prev => [...prev, medication]);
      toast.success(`${medication} adicionado à análise`);
    }
  };

  const handleMedicationRemove = (medication: string) => {
    setSelectedMedications(prev => prev.filter(med => med !== medication));
    toast.success(`${medication} removido da análise`);
  };

  const generateReport = () => {
    if (selectedMedications.length < 2) {
      toast.error('Selecione pelo menos 2 medicamentos para gerar relatório');
      return;
    }

    const reportData = {
      patientData: {
        name: '',
        age: '',
        pharmacist: '',
        notes: ''
      },
      medications: selectedMedications,
      interactions: foundInteractions,
      checkDate: new Date().toLocaleDateString('pt-BR')
    };

    const pdf = generateInteractionReportPDF(reportData);
    pdf.save(`relatorio-interacoes-${Date.now()}.pdf`);
    
    toast.success('Relatório gerado com sucesso!');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Carregando base de interações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-purple-800 mb-2">Interações Medicamentosas</h2>
        <p className="text-gray-600">
          Análise de interações medicamento-medicamento e medicamento-nutriente
        </p>
      </div>

      <MedicationSearch 
        selectedMedications={selectedMedications}
        onMedicationAdd={handleMedicationAdd}
        onMedicationRemove={handleMedicationRemove}
      />

      <InteractionAnalysis 
        interactions={foundInteractions}
        medicationCount={selectedMedications.length}
        onGenerateReport={generateReport}
      />
    </div>
  );
};

export default DrugInteractions;
