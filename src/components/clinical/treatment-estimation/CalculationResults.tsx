
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface CalculationResultsProps {
  dailyConsumption: number;
  treatmentConsumption: number;
  stockCoverageDays: number;
  isStockSufficient: boolean;
  stockUnit: string;
  totalPatientsUsing: number;
  dailyDosePerPatient: number;
  currentStock: number;
  averageTreatmentDays: number;
  stockStatus: {
    color: string;
    text: string;
  };
}

const CalculationResults = ({
  dailyConsumption,
  treatmentConsumption,
  stockCoverageDays,
  isStockSufficient,
  stockUnit,
  totalPatientsUsing,
  dailyDosePerPatient,
  currentStock,
  averageTreatmentDays,
  stockStatus
}: CalculationResultsProps) => {
  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resultados Automáticos</span>
          <Badge className={stockStatus.color}>
            {isStockSufficient ? <CheckCircle size={14} className="mr-1" /> : <AlertTriangle size={14} className="mr-1" />}
            {stockStatus.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Consumo Diário Total</p>
            <p className="text-xl font-bold text-blue-600">{dailyConsumption} {stockUnit}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Consumo Total do Tratamento</p>
            <p className="text-xl font-bold text-purple-600">{treatmentConsumption} {stockUnit}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Cobertura do Estoque</p>
            <p className={`text-xl font-bold ${isStockSufficient ? 'text-green-600' : 'text-red-600'}`}>
              {stockCoverageDays} dias
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pacientes × Dose</p>
            <p className="text-lg font-semibold text-gray-700">
              {totalPatientsUsing} × {dailyDosePerPatient} {stockUnit}
            </p>
          </div>
        </div>

        {!isStockSufficient && currentStock > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle size={16} />
              <strong>Atenção: Estoque Insuficiente!</strong>
            </div>
            <p className="text-red-700 mt-1">
              O estoque atual durará apenas {stockCoverageDays} dias, mas o tratamento requer {averageTreatmentDays} dias.
              É necessário repor {Math.ceil(treatmentConsumption - currentStock)} {stockUnit} adicionais.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculationResults;
