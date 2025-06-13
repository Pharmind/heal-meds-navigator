
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Trash2, FileText, Download } from 'lucide-react';
import { useDrugInteractions, useCreateInteractionCheck, checkDrugInteractions } from '@/hooks/useDrugInteractions';
import { generateInteractionReportPDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

interface DrugInteractionsProps {
  importedMedications?: string[];
}

const DrugInteractions = ({ importedMedications = [] }: DrugInteractionsProps) => {
  const [medications, setMedications] = useState<string[]>(importedMedications.length > 0 ? importedMedications : ['', '']);
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

  const addMedicationField = () => {
    if (medications.length < 20) {
      setMedications([...medications, '']);
    }
  };

  const removeMedicationField = (index: number) => {
    if (medications.length > 2) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, value: string) => {
    const updated = [...medications];
    updated[index] = value;
    setMedications(updated);
  };

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'leve': return 'bg-green-100 text-green-800';
      case 'moderada': return 'bg-yellow-100 text-yellow-800';
      case 'grave': return 'bg-red-100 text-red-800';
      case 'contraindicada': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
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

      {/* Dados do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Paciente e Farmacêutico</CardTitle>
          <CardDescription>Informações opcionais para o relatório</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patient-name">Nome do Paciente</Label>
              <Input
                id="patient-name"
                value={patientData.name}
                onChange={(e) => setPatientData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo do paciente"
              />
            </div>
            <div>
              <Label htmlFor="patient-age">Idade</Label>
              <Input
                id="patient-age"
                value={patientData.age}
                onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Idade do paciente"
              />
            </div>
            <div>
              <Label htmlFor="pharmacist">Farmacêutico Responsável</Label>
              <Input
                id="pharmacist"
                value={patientData.pharmacist}
                onChange={(e) => setPatientData(prev => ({ ...prev, pharmacist: e.target.value }))}
                placeholder="Nome do farmacêutico"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Medicamentos em Uso
            <Button onClick={addMedicationField} disabled={medications.length >= 20} size="sm">
              <Plus size={16} className="mr-1" />
              Adicionar
            </Button>
          </CardTitle>
          <CardDescription>
            Adicione de 2 a 20 medicamentos para verificar interações (máximo: {medications.length}/20)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medications.map((medication, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1">
                  <Label htmlFor={`med-${index}`}>Medicamento {index + 1}</Label>
                  <Input
                    id={`med-${index}`}
                    value={medication}
                    onChange={(e) => updateMedication(index, e.target.value)}
                    placeholder="Nome do medicamento ou princípio ativo"
                  />
                </div>
                {medications.length > 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMedicationField(index)}
                    className="mt-6"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resultados das Interações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={24} />
            Interações Encontradas ({foundInteractions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {foundInteractions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma interação encontrada na base de dados.</p>
              <p className="text-sm mt-2">Isso não garante ausência total de interações. Sempre consulte literatura atualizada.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {foundInteractions.map((interaction, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">
                      {interaction.drug1Name} × {interaction.drug2Name}
                    </h4>
                    <div className="flex gap-2">
                      <Badge className={getSeverityColor(interaction.severityLevel)}>
                        {interaction.severityLevel}
                      </Badge>
                      <Badge variant="outline">
                        {interaction.interactionType === 'drug-drug' ? 'Medicamento-Medicamento' : 'Medicamento-Nutriente'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <strong>Efeito Clínico:</strong>
                      <p className="text-gray-700">{interaction.clinicalEffect}</p>
                    </div>
                    
                    <div>
                      <strong>Mecanismo:</strong>
                      <p className="text-gray-700">{interaction.mechanism}</p>
                    </div>
                    
                    <div>
                      <strong>Conduta:</strong>
                      <p className="text-gray-700">{interaction.management}</p>
                    </div>
                    
                    {interaction.bibliography && (
                      <div>
                        <strong>Bibliografia:</strong>
                        <p className="text-gray-600 text-sm">{interaction.bibliography}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={patientData.notes}
            onChange={(e) => setPatientData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Observações adicionais sobre o paciente ou as interações encontradas..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-4 justify-center">
        <Button onClick={handleSaveCheck} disabled={createCheck.isPending}>
          <FileText size={16} className="mr-2" />
          Salvar Verificação
        </Button>
        
        <Button onClick={generateReport} variant="outline">
          <Download size={16} className="mr-2" />
          Gerar Relatório PDF
        </Button>
      </div>
    </div>
  );
};

export default DrugInteractions;
