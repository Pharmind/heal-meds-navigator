
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, AlertTriangle } from 'lucide-react';

const HighAlertSection = () => {
  const highAlertMedications = [
    {
      type: "Anticoagulantes",
      activeIngredient: "Heparina"
    },
    {
      type: "Anticoagulantes",
      activeIngredient: "Warfarina"
    },
    {
      type: "Anticoagulantes",
      activeIngredient: "Dabigatrana"
    },
    {
      type: "Insulinas",
      activeIngredient: "Insulina Regular"
    },
    {
      type: "Insulinas",
      activeIngredient: "Insulina NPH"
    },
    {
      type: "Insulinas",
      activeIngredient: "Insulina Glargina"
    },
    {
      type: "Quimioterápicos",
      activeIngredient: "Metotrexato"
    },
    {
      type: "Quimioterápicos",
      activeIngredient: "5-Fluorouracil"
    },
    {
      type: "Quimioterápicos",
      activeIngredient: "Cisplatina"
    },
    {
      type: "Opioides",
      activeIngredient: "Morfina"
    },
    {
      type: "Opioides",
      activeIngredient: "Fentanil"
    },
    {
      type: "Bloqueadores Neuromusculares",
      activeIngredient: "Atracúrio"
    },
    {
      type: "Bloqueadores Neuromusculares",
      activeIngredient: "Succinilcolina"
    },
    {
      type: "Soluções Eletrolíticas Concentradas",
      activeIngredient: "Cloreto de Potássio 19,1%"
    },
    {
      type: "Soluções Eletrolíticas Concentradas",
      activeIngredient: "Cloreto de Sódio 20%"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Medicamentos de Alta Vigilância</h2>
        <p className="text-gray-600">Medicamentos que requerem monitorização especial devido ao alto risco de causar danos significativos</p>
      </div>

      {/* Explicação sobre medicamentos de alta vigilância */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Medicamentos de Alta Vigilância (MAV)</strong> são aqueles que possuem risco aumentado de provocar danos significativos aos pacientes quando utilizados incorretamente. 
          Estes medicamentos requerem medidas especiais de segurança, incluindo dupla checagem, protocolos específicos de preparo e administração, 
          e monitorização contínua para prevenir erros de medicação e minimizar eventos adversos graves.
        </AlertDescription>
      </Alert>

      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Eye className="text-red-600" size={24} />
            Lista de Medicamentos de Alta Vigilância - HEAL
          </CardTitle>
          <CardDescription className="text-red-700">
            Medicamentos que requerem cuidados especiais e protocolos de segurança rigorosos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border border-red-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-red-100">
                <TableRow className="hover:bg-red-100">
                  <TableHead className="font-semibold text-red-800 border-r border-red-200">
                    Tipo de Medicamento
                  </TableHead>
                  <TableHead className="font-semibold text-red-800">
                    Princípio Ativo
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highAlertMedications.map((medication, index) => (
                  <TableRow key={index} className="hover:bg-red-50 border-red-100">
                    <TableCell className="font-medium text-red-800 border-r border-red-100">
                      {medication.type}
                    </TableCell>
                    <TableCell className="text-red-700">
                      {medication.activeIngredient}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">Medidas de Segurança Obrigatórias:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              <li>Dupla checagem independente por dois profissionais</li>
              <li>Cálculos de dose verificados por dois profissionais</li>
              <li>Rotulagem clara e diferenciada</li>
              <li>Armazenamento em local específico e controlado</li>
              <li>Monitorização contínua durante administração</li>
              <li>Documentação detalhada de todos os procedimentos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HighAlertSection;
