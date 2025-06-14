
import { useState, useEffect } from 'react';
import { useDrugInteractions, checkDrugInteractions, useCreateInteractionCheck } from '@/hooks/useDrugInteractions';
import { generateInteractionReportPDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';
import MedicationSearch from './interactions/MedicationSearch';
import InteractionAnalysis from './interactions/InteractionAnalysis';
import PatientDataForm from './interactions/PatientDataForm';
import InteractionNotes from './interactions/InteractionNotes';

interface DrugInteractionsProps {
  importedMedications?: string[];
}

const DrugInteractions = ({ importedMedications = [] }: DrugInteractionsProps) => {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    pharmacist: '',
    notes: ''
  });
  
  const { data: allInteractions = [], isLoading } = useDrugInteractions();
  const createInteractionCheck = useCreateInteractionCheck();
  
  // Initialize with imported medications when component mounts
  useEffect(() => {
    if (importedMedications.length > 0) {
      setSelectedMedications(importedMedications);
      if (importedMedications.length > 1) {
        toast.success(`${importedMedications.length} medicamentos importados da receita`);
      }
    }
  }, [importedMedications]);
  
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

  const generateReport = async () => {
    if (selectedMedications.length < 2) {
      toast.error('Selecione pelo menos 2 medicamentos para gerar relatório');
      return;
    }

    const reportData = {
      patientData,
      medications: selectedMedications,
      interactions: foundInteractions,
      checkDate: new Date().toLocaleDateString('pt-BR')
    };

    // Salvar verificação no banco de dados
    try {
      await createInteractionCheck.mutateAsync({
        patientName: patientData.name || undefined,
        patientAge: patientData.age || undefined,
        pharmacistName: patientData.pharmacist || undefined,
        medications: selectedMedications,
        interactionsFound: foundInteractions,
        notes: patientData.notes || undefined,
      });
      
      console.log('Verificação de interação salva no banco de dados');
    } catch (error) {
      console.error('Erro ao salvar verificação:', error);
      toast.error('Erro ao salvar verificação no banco de dados');
    }

    const pdf = generateInteractionReportPDF(reportData);
    pdf.save(`relatorio-interacoes-${Date.now()}.pdf`);
    
    toast.success('Relatório gerado com sucesso!');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Carregando base de interações medicamentosas...</p>
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
        <p className="text-sm text-blue-600 mt-2">
          Base de dados: {allInteractions.length} interações catalogadas
        </p>
        {importedMedications.length > 0 && (
          <p className="text-sm text-green-600 mt-1">
            Medicamentos importados da Receita Simplificada
          </p>
        )}
      </div>

      <PatientDataForm 
        patientData={patientData}
        onUpdate={setPatientData}
      />

      <MedicationSearch 
        selectedMedications={selectedMedications}
        onMedicationAdd={handleMedicationAdd}
        onMedicationRemove={handleMedicationRemove}
      />

      <InteractionNotes 
        notes={patientData.notes}
        onUpdate={(notes) => setPatientData(prev => ({ ...prev, notes }))}
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
