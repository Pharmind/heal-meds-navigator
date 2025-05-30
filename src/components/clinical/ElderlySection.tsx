
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const ElderlySection = () => {
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
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Medicamentos Inapropriados para Idosos</h2>
        <p className="text-gray-600">Baseado nos Critérios de Beers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-blue-600" size={24} />
            Critérios de Beers
          </CardTitle>
          <CardDescription>
            Medicamentos potencialmente inapropriados para pacientes idosos
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
    </div>
  );
};

export default ElderlySection;
