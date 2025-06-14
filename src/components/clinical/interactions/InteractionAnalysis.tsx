
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DrugInteraction } from '@/hooks/useDrugInteractions';

interface InteractionAnalysisProps {
  interactions: DrugInteraction[];
  medicationCount: number;
  onGenerateReport: () => void;
}

const InteractionAnalysis = ({ interactions, medicationCount, onGenerateReport }: InteractionAnalysisProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'leve': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderada': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'grave': return 'bg-red-100 text-red-800 border-red-300';
      case 'contraindicada': return 'bg-red-200 text-red-900 border-red-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'grave':
      case 'contraindicada':
        return '🔴';
      case 'moderada':
        return '🟡';
      case 'leve':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getInteractionSummary = () => {
    const summary = {
      medicamento: interactions.filter(i => i.interactionType === 'drug-drug').length,
      nutriente: interactions.filter(i => i.interactionType === 'drug-nutrient').length,
      grave: interactions.filter(i => i.severityLevel === 'grave' || i.severityLevel === 'contraindicada').length,
      moderada: interactions.filter(i => i.severityLevel === 'moderada').length,
      leve: interactions.filter(i => i.severityLevel === 'leve').length,
    };
    return summary;
  };

  const summary = getInteractionSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-purple-600" size={24} />
            <span className="text-purple-800">Resultados da Análise de Interações</span>
          </div>
          {medicationCount >= 2 && (
            <Button onClick={onGenerateReport} variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Gerar Relatório
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {medicationCount < 2 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Selecione pelo menos 2 medicamentos</p>
            <p className="text-sm">Para realizar a análise de interações medicamentosas</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo das interações */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-800">Resumo da Análise:</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{summary.medicamento}</div>
                  <div className="text-gray-600">Medicamento-Medicamento</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{summary.nutriente}</div>
                  <div className="text-gray-600">Medicamento-Nutriente</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{summary.grave}</div>
                  <div className="text-gray-600">Graves</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{summary.moderada}</div>
                  <div className="text-gray-600">Moderadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{summary.leve}</div>
                  <div className="text-gray-600">Leves</div>
                </div>
              </div>
            </div>

            {/* Lista de interações */}
            {interactions.length === 0 ? (
              <div className="text-center py-8 bg-green-50 rounded-lg">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-lg font-medium text-green-800">Nenhuma interação encontrada</p>
                <p className="text-sm text-green-600 mt-2">
                  Isso não garante ausência total de interações. Sempre consulte literatura atualizada.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Interações Encontradas ({interactions.length}):</h4>
                {interactions.map((interaction, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-lg text-gray-800">
                        {getSeverityIcon(interaction.severityLevel)} {interaction.drug1Name} × {interaction.drug2Name}
                      </h5>
                      <div className="flex gap-2">
                        <Badge className={`${getSeverityColor(interaction.severityLevel)} border`}>
                          {interaction.severityLevel.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {interaction.interactionType === 'drug-drug' ? 'Medicamento-Medicamento' : 'Medicamento-Nutriente'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-red-600">Efeito Clínico:</strong>
                        <p className="text-gray-700 mt-1">{interaction.clinicalEffect}</p>
                      </div>
                      
                      <div>
                        <strong className="text-blue-600">Mecanismo:</strong>
                        <p className="text-gray-700 mt-1">{interaction.mechanism}</p>
                      </div>
                    </div>
                    
                    <div>
                      <strong className="text-green-600">Conduta Recomendada:</strong>
                      <p className="text-gray-700 mt-1">{interaction.management}</p>
                    </div>
                    
                    {interaction.bibliography && (
                      <div>
                        <strong className="text-purple-600">Bibliografia:</strong>
                        <p className="text-gray-600 text-xs mt-1">{interaction.bibliography}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractionAnalysis;
