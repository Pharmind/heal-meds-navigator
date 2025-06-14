
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TreatmentEstimation } from '@/hooks/useTreatmentEstimations';

interface SavedEstimationsProps {
  savedEstimations: TreatmentEstimation[];
  hospitalUnit: string;
}

const SavedEstimations = ({ savedEstimations, hospitalUnit }: SavedEstimationsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimativas Salvas Hoje - {hospitalUnit}</CardTitle>
        <CardDescription>{savedEstimations.length} antimicrobiano(s) registrado(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {savedEstimations.map((estimation) => (
            <div key={estimation.id} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">{estimation.antimicrobialName}</h4>
                <Badge className={estimation.isStockSufficient ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {estimation.isStockSufficient ? 'Suficiente' : 'Insuficiente'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                <span>Pacientes: {estimation.totalPatientsUsing}</span>
                <span>Consumo diário: {estimation.dailyConsumption} {estimation.stockUnit}</span>
                <span>Cobertura: {estimation.stockCoverageDays} dias</span>
                <span>Estoque: {estimation.currentStock} {estimation.stockUnit}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedEstimations;
