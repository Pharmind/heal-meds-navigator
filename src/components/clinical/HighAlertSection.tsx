
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

const HighAlertSection = () => {
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Medicamentos de Alta Vigilância</h2>
        <p className="text-gray-600">Medicamentos que requerem monitorização especial</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="text-orange-600" size={24} />
            Lista de Medicamentos de Alta Vigilância
          </CardTitle>
          <CardDescription>
            Medicamentos que requerem cuidados especiais e monitorização contínua
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
    </div>
  );
};

export default HighAlertSection;
