
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TreatmentEstimation, useDeleteTreatmentEstimation } from '@/hooks/useTreatmentEstimations';
import { Upload, Trash2, Clock, TrendingUp } from 'lucide-react';

interface SavedEstimationsProps {
  savedEstimations: TreatmentEstimation[];
  hospitalUnit: string;
  onLoadEstimation?: (estimation: TreatmentEstimation) => void;
}

const SavedEstimations = ({ savedEstimations, hospitalUnit, onLoadEstimation }: SavedEstimationsProps) => {
  const deleteMutation = useDeleteTreatmentEstimation();

  const handleDelete = (id: string, antimicrobialName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a estimativa de ${antimicrobialName}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isStockSufficient = (estimation: TreatmentEstimation) => {
    return estimation.daysRemaining > 0 && estimation.alertLevel !== 'crítico';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-green-600" size={20} />
          Estimativas Salvas Hoje - {hospitalUnit}
        </CardTitle>
        <CardDescription>
          {savedEstimations.length} antimicrobiano(s) registrado(s) • 
          Última atualização: {savedEstimations.length > 0 ? formatTime(savedEstimations[0].updatedAt) : '--'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {savedEstimations.map((estimation) => (
            <div key={estimation.id} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg text-gray-800">{estimation.antimicrobialName}</h4>
                    <Badge className={isStockSufficient(estimation) ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                      {isStockSufficient(estimation) ? '✅ Suficiente' : '⚠️ Insuficiente'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <Clock size={12} />
                    Atualizado às {formatTime(estimation.updatedAt)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {onLoadEstimation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadEstimation(estimation)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Upload size={14} className="mr-1" />
                      Carregar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(estimation.id, estimation.antimicrobialName)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-white p-2 rounded border border-blue-100">
                  <span className="text-gray-600 block text-xs">Pacientes</span>
                  <span className="font-semibold text-blue-700">{estimation.activePatients}</span>
                </div>
                <div className="bg-white p-2 rounded border border-purple-100">
                  <span className="text-gray-600 block text-xs">Consumo diário</span>
                  <span className="font-semibold text-purple-700">{estimation.dailyTotalConsumption.toLocaleString('pt-BR')} {estimation.stockUnit}</span>
                </div>
                <div className="bg-white p-2 rounded border border-green-100">
                  <span className="text-gray-600 block text-xs">Cobertura</span>
                  <span className={`font-semibold ${isStockSufficient(estimation) ? 'text-green-700' : 'text-red-700'}`}>
                    {estimation.stockCoverageDays} dias
                  </span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-100">
                  <span className="text-gray-600 block text-xs">Estoque</span>
                  <span className="font-semibold text-gray-700">{estimation.currentStock.toLocaleString('pt-BR')} {estimation.stockUnit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {savedEstimations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp size={48} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma estimativa salva para esta unidade hoje.</p>
            <p className="text-sm">Preencha o formulário acima para começar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedEstimations;
