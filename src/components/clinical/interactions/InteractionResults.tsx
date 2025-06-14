
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { DrugInteraction } from '@/hooks/useDrugInteractions';

interface InteractionResultsProps {
  interactions: DrugInteraction[];
}

const InteractionResults = ({ interactions }: InteractionResultsProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'leve': return 'bg-green-100 text-green-800';
      case 'moderada': return 'bg-yellow-100 text-yellow-800';
      case 'grave': return 'bg-red-100 text-red-800';
      case 'contraindicada': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="text-orange-600" size={24} />
          Interações Encontradas ({interactions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {interactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma interação encontrada na base de dados.</p>
            <p className="text-sm mt-2">Isso não garante ausência total de interações. Sempre consulte literatura atualizada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction, index) => (
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
  );
};

export default InteractionResults;
