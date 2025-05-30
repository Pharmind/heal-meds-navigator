
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const IntoxicationSection = () => {
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Intoxicações e Antídotos</h2>
        <p className="text-gray-600">Principais intoxicações e seus respectivos antídotos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={24} />
            Protocolos de Antídotos
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
    </div>
  );
};

export default IntoxicationSection;
