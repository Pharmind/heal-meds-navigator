
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Eye, Users, FileText, Shield, Heart } from 'lucide-react';

const ClinicalPharmacy = () => {
  const [activeSubTab, setActiveSubTab] = useState('intoxicacao');

  const intoxicationData = [
    {
      toxin: "Paracetamol",
      antidote: "N-acetilcisteína",
      dose: "150mg/kg em 200ml de glicose 5% EV em 15min",
      mechanism: "Reposição de glutationa"
    },
    {
      toxin: "Warfarina",
      antidote: "Vitamina K",
      dose: "10mg EV ou VO",
      mechanism: "Reversão da anticoagulação"
    },
    {
      toxin: "Benzodiazepínicos",
      antidote: "Flumazenil",
      dose: "0,2mg EV, repetir até 2mg",
      mechanism: "Antagonista competitivo"
    }
  ];

  const highAlertMedications = [
    {
      category: "Anticoagulantes",
      medications: ["Heparina", "Warfarina", "Dabigatrana"],
      risks: "Hemorragia grave"
    },
    {
      category: "Insulinas",
      medications: ["Insulina Regular", "Insulina NPH", "Insulina Glargina"],
      risks: "Hipoglicemia severa"
    },
    {
      category: "Quimioterápicos",
      medications: ["Metotrexato", "5-Fluorouracil", "Cisplatina"],
      risks: "Toxicidade sistêmica"
    }
  ];

  const elderlyInappropriate = [
    {
      medication: "Diazepam",
      reason: "Meia-vida longa, risco de quedas",
      alternative: "Lorazepam"
    },
    {
      medication: "Amitriptilina",
      reason: "Efeitos anticolinérgicos",
      alternative: "Sertralina"
    },
    {
      medication: "Indometacina",
      reason: "Toxicidade no SNC",
      alternative: "Ibuprofeno"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Farmácia Clínica</h2>
        <p className="text-gray-600">Ferramentas e recursos para prática clínica segura</p>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="intoxicacao" className="text-xs lg:text-sm">
            <AlertTriangle size={16} className="mr-1" />
            Intoxicação
          </TabsTrigger>
          <TabsTrigger value="alta-vigilancia" className="text-xs lg:text-sm">
            <Eye size={16} className="mr-1" />
            Alta Vigilância
          </TabsTrigger>
          <TabsTrigger value="idosos" className="text-xs lg:text-sm">
            <Users size={16} className="mr-1" />
            Idosos
          </TabsTrigger>
          <TabsTrigger value="farmacovigilancia" className="text-xs lg:text-sm">
            <Shield size={16} className="mr-1" />
            Farmacovigilância
          </TabsTrigger>
          <TabsTrigger value="cft" className="text-xs lg:text-sm">
            <FileText size={16} className="mr-1" />
            CFT
          </TabsTrigger>
          <TabsTrigger value="protocolos" className="text-xs lg:text-sm">
            <Heart size={16} className="mr-1" />
            Protocolos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intoxicacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-red-600" size={24} />
                Intoxicações e Antídotos
              </CardTitle>
              <CardDescription>
                Principais intoxicações e seus respectivos antídotos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {intoxicationData.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{item.toxin}</h4>
                      <Badge variant="destructive">Urgente</Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-heal-green-700">Antídoto: </span>
                        {item.antidote}
                      </div>
                      <div>
                        <span className="font-medium text-heal-green-700">Dose: </span>
                        {item.dose}
                      </div>
                      <div>
                        <span className="font-medium text-heal-green-700">Mecanismo: </span>
                        {item.mechanism}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alta-vigilancia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="text-orange-600" size={24} />
                Medicamentos de Alta Vigilância
              </CardTitle>
              <CardDescription>
                Medicamentos que requerem monitorização especial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {highAlertMedications.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-lg">{category.category}</h4>
                      <Badge variant="secondary">Alta Vigilância</Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-heal-green-700">Medicamentos: </span>
                        {category.medications.join(", ")}
                      </div>
                      <div>
                        <span className="font-medium text-heal-green-700">Principais Riscos: </span>
                        {category.risks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="idosos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-blue-600" size={24} />
                Medicamentos Potencialmente Inapropriados para Idosos
              </CardTitle>
              <CardDescription>
                Baseado nos Critérios de Beers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {elderlyInappropriate.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{item.medication}</h4>
                      <Badge variant="outline">Evitar em Idosos</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-heal-green-700">Motivo: </span>
                        {item.reason}
                      </div>
                      <div>
                        <span className="font-medium text-heal-green-700">Alternativa: </span>
                        {item.alternative}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farmacovigilancia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-purple-600" size={24} />
                Farmacovigilância
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
        </TabsContent>

        <TabsContent value="cft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-green-600" size={24} />
                Comissão de Farmácia e Terapêutica
              </CardTitle>
              <CardDescription>
                Atividades e diretrizes da CFT
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
        </TabsContent>

        <TabsContent value="protocolos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="text-red-600" size={24} />
                Protocolos Clínicos
              </CardTitle>
              <CardDescription>
                Protocolos institucionais para condições específicas
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicalPharmacy;
