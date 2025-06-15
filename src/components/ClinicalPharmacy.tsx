
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, Heart } from 'lucide-react';
import PictogramPrescription from './clinical/PictogramPrescription';
import DischargeGuidelines from './clinical/DischargeGuidelines';
import DrugInteractions from './clinical/DrugInteractions';
import TreatmentEstimation from './clinical/TreatmentEstimation';
import TherapeuticAlternatives from './clinical/TherapeuticAlternatives';

interface ClinicalPharmacyProps {
  activeTab: 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation' | 'therapeutic-alternatives';
}

const ClinicalPharmacy = ({ activeTab }: ClinicalPharmacyProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'therapeutic-alternatives':
        return <TherapeuticAlternatives />;
        
      case 'treatment-estimation':
        return <TreatmentEstimation />;
        
      case 'drug-interactions':
        return <DrugInteractions />;
        
      case 'pictogram':
        return <PictogramPrescription />;
        
      case 'discharge-guidelines':
        return <DischargeGuidelines />;

      case 'pharmacovigilance':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Farmacovigilância</h2>
              <p className="text-gray-600">Monitoramento e notificação de reações adversas</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="text-purple-600" size={24} />
                  Sistema de Farmacovigilância
                </CardTitle>
                <CardDescription>
                  Monitoramento e notificação de reações adversas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Como Notificar Reações Adversas:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Identificar a reação adversa suspeita</li>
                      <li>Avaliar a causalidade (provável, possível, improvável)</li>
                      <li>Preencher formulário de notificação</li>
                      <li>Enviar para ANVISA via sistema NOTIVISA</li>
                    </ol>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Critérios de Gravidade:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Resulta em morte</li>
                      <li>Ameaça à vida</li>
                      <li>Requer hospitalização</li>
                      <li>Resulta em incapacidade persistente</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'cft':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Comissão de Farmácia e Terapêutica</h2>
              <p className="text-gray-600">Atividades e diretrizes da CFT</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-green-600" size={24} />
                  CFT - HEAL
                </CardTitle>
                <CardDescription>
                  Atividades e diretrizes da Comissão de Farmácia e Terapêutica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Funções da CFT:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Elaboração de protocolos clínicos</li>
                        <li>Avaliação de novas tecnologias</li>
                        <li>Padronização de medicamentos</li>
                        <li>Educação continuada</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Reuniões:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Frequência: Mensal</li>
                        <li>Data: Primeira quinta-feira</li>
                        <li>Horário: 14h às 16h</li>
                        <li>Local: Sala de reuniões administrativas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'protocols':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Protocolos Clínicos</h2>
              <p className="text-gray-600">Protocolos institucionais para condições específicas</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-red-600" size={24} />
                  Protocolos Institucionais
                </CardTitle>
                <CardDescription>
                  Protocolos clínicos padronizados do HEAL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Protocolo de Sepse</h4>
                    <p className="text-sm text-gray-600 mb-2">Manejo inicial da sepse e choque séptico</p>
                    <Badge>Em desenvolvimento</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Protocolo de Dor</h4>
                    <p className="text-sm text-gray-600 mb-2">Avaliação e tratamento da dor aguda e crônica</p>
                    <Badge variant="secondary">Aprovado</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Protocolo de Anticoagulação</h4>
                    <p className="text-sm text-gray-600 mb-2">Diretrizes para uso seguro de anticoagulantes</p>
                    <Badge variant="secondary">Aprovado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
};

export default ClinicalPharmacy;
