
import { useState } from 'react';
import { useDrugInteractions, useCreateInteractionCheck, checkDrugInteractions } from '@/hooks/useDrugInteractions';
import { generateInteractionReportPDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';
import PatientDataForm from './interactions/PatientDataForm';
import MedicationsList from './interactions/MedicationsList';
import InteractionResults from './interactions/InteractionResults';
import InteractionNotes from './interactions/InteractionNotes';
import InteractionActions from './interactions/InteractionActions';

interface DrugInteractionsProps {
  importedMedications?: string[];
}

const DrugInteractions = ({ importedMedications = [] }: DrugInteractionsProps) => {
  const [medications, setMedications] = useState<string[]>(
    importedMedications.length > 0 ? importedMedications : ['', '']
  );
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    pharmacist: '',
    notes: ''
  });
  
  const { data: allInteractions = [], isLoading } = useDrugInteractions();
  const createCheck = useCreateInteractionCheck();
  
  const foundInteractions = checkDrugInteractions(
    medications.filter(med => med.trim() !== ''), 
    allInteractions
  );

  const handleSaveCheck = async () => {
    const validMedications = medications.filter(med => med.trim() !== '');
    
    if (validMedications.length < 2) {
      toast.error('Adicione pelo menos 2 medicamentos para verificar interações');
      return;
    }

    try {
      await createCheck.mutateAsync({
        patientName: patientData.name || undefined,
        patientAge: patientData.age || undefined,
        pharmacistName: patientData.pharmacist || undefined,
        medications: validMedications,
        interactionsFound: foundInteractions,
        notes: patientData.notes || undefined,
      });
      
      toast.success('Verificação de interações salva com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar verificação');
      console.error(error);
    }
  };

  const generateReport = () => {
    const validMedications = medications.filter(med => med.trim() !== '');
    
    if (validMedications.length < 2) {
      toast.error('Adicione pelo menos 2 medicamentos para gerar relatório');
      return;
    }

    const reportData = {
      patientData,
      medications: validMedications,
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
        <p>Carregando base de interações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Interações Medicamentosas</h2>
        <p className="text-gray-600">Verificação de interações medicamento-medicamento e medicamento-nutriente</p>
      </div>

      <PatientDataForm 
        patientData={patientData} 
        onUpdate={setPatientData} 
      />

      <MedicationsList 
        medications={medications} 
        onUpdate={setMedications} 
      />

      <InteractionResults interactions={foundInteractions} />

      <InteractionNotes 
        notes={patientData.notes} 
        onUpdate={(notes) => setPatientData(prev => ({ ...prev, notes }))} 
      />

      <InteractionActions 
        onSave={handleSaveCheck}
        onGenerateReport={generateReport}
        isSaving={createCheck.isPending}
      />
    </div>
  );
};

export default DrugInteractions;
