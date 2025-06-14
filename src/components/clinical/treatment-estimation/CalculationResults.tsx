
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, TrendingUp, Package, Clock, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const weeklyConsumption = dailyConsumption * 7;
  const monthlyConsumption = dailyConsumption * 30;
  const shortageAmount = Math.max(0, treatmentConsumption - currentStock);

  return (
    <div className="space-y-4">
      {/* Main Results Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              <span>Resultados dos Cálculos</span>
            </div>
            <Badge className={stockStatus.color}>
              {isStockSufficient ? <CheckCircle size={14} className="mr-1" /> : <AlertTriangle size={14} className="mr-1" />}
              {stockStatus.text}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-blue-600" size={16} />
                <p className="text-sm font-medium text-gray-600">Consumo Diário</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{dailyConsumption.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-gray-500">{stockUnit}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Package className="text-purple-600" size={16} />
                <p className="text-sm font-medium text-gray-600">Total do Tratamento</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{treatmentConsumption.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-gray-500">{stockUnit} em {averageTreatmentDays} dias</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className={`${isStockSufficient ? 'text-green-600' : 'text-red-600'}`} size={16} />
                <p className="text-sm font-medium text-gray-600">Cobertura</p>
              </div>
              <p className={`text-2xl font-bold ${isStockSufficient ? 'text-green-600' : 'text-red-600'}`}>
                {stockCoverageDays}
              </p>
              <p className="text-sm text-gray-500">dias de estoque</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-gray-600" size={16} />
                <p className="text-sm font-medium text-gray-600">Dose Unitária</p>
              </div>
              <p className="text-lg font-semibold text-gray-700">{totalPatientsUsing} × {dailyDosePerPatient}</p>
              <p className="text-sm text-gray-500">{stockUnit}/paciente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Projeções de Consumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Semanal</p>
              <p className="text-xl font-bold text-blue-600">{weeklyConsumption.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500">{stockUnit}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Mensal</p>
              <p className="text-xl font-bold text-purple-600">{monthlyConsumption.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500">{stockUnit}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Estoque Atual</p>
              <p className="text-xl font-bold text-gray-700">{currentStock.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500">{stockUnit}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Alerts */}
      {!isStockSufficient && currentStock > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-800 font-semibold">
                <strong>⚠️ Atenção: Estoque Insuficiente!</strong>
              </div>
              <div className="text-red-700 space-y-1">
                <p>• O estoque atual durará apenas <strong>{stockCoverageDays} dias</strong></p>
                <p>• O tratamento completo requer <strong>{averageTreatmentDays} dias</strong></p>
                <p>• É necessário repor <strong>{shortageAmount.toLocaleString('pt-BR')} {stockUnit}</strong> adicionais</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {stockCoverageDays > 0 && stockCoverageDays < 3 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>Alerta:</strong> Estoque baixo - considere fazer reposição em breve.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CalculationResults;
