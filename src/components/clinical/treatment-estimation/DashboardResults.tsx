
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardResultsProps {
  dailyTotalConsumption: number;
  daysRemaining: number;
  stockCoverageDays: number;
  stockUnit: string;
  activePatients: number;
  dosePerPatient: number;
  currentStock: number;
  estimatedDays: number;
  alertLevel: string;
}

const DashboardResults = ({
  dailyTotalConsumption,
  daysRemaining,
  stockCoverageDays,
  stockUnit,
  activePatients,
  dosePerPatient,
  currentStock,
  estimatedDays,
  alertLevel
}: DashboardResultsProps) => {
  const weeklyConsumption = dailyTotalConsumption * 7;
  const monthlyConsumption = dailyTotalConsumption * 30;
  const totalNeededForTreatment = dailyTotalConsumption * estimatedDays;
  const shortage = Math.max(0, totalNeededForTreatment - currentStock);

  const getAlertIcon = () => {
    switch (alertLevel) {
      case 'crítico': return <AlertTriangle className="text-red-600" size={24} />;
      case 'baixo': return <Clock className="text-orange-600" size={24} />;
      default: return <CheckCircle className="text-green-600" size={24} />;
    }
  };

  const getStatusColor = () => {
    switch (alertLevel) {
      case 'crítico': return 'bg-red-500 text-white';
      case 'baixo': return 'bg-orange-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="space-y-4">
      {/* Card Principal de Status */}
      <Card className={`border-2 ${alertLevel === 'crítico' ? 'border-red-300' : 
                                    alertLevel === 'baixo' ? 'border-orange-300' : 
                                    'border-green-300'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getAlertIcon()}
              <span>Status do Estoque</span>
            </div>
            <Badge className={getStatusColor()}>
              {daysRemaining.toFixed(1)} dias restantes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Consumo Diário</p>
              <p className="text-2xl font-bold text-blue-600">{dailyTotalConsumption.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500">{stockUnit}</p>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Pacientes Ativos</p>
              <p className="text-2xl font-bold text-purple-600">{activePatients}</p>
              <p className="text-xs text-gray-500">em tratamento</p>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${alertLevel === 'crítico' ? 'bg-red-50' : 
                                                          alertLevel === 'baixo' ? 'bg-orange-50' : 
                                                          'bg-green-50'}`}>
              <p className="text-sm text-gray-600">Cobertura</p>
              <p className={`text-2xl font-bold ${alertLevel === 'crítico' ? 'text-red-600' : 
                                                  alertLevel === 'baixo' ? 'text-orange-600' : 
                                                  'text-green-600'}`}>
                {stockCoverageDays}
              </p>
              <p className="text-xs text-gray-500">dias completos</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Estoque Total</p>
              <p className="text-2xl font-bold text-gray-700">{currentStock.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500">{stockUnit}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projeções de Consumo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Projeções de Consumo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Semanal (7 dias)</p>
              <p className="text-xl font-bold text-blue-600">{weeklyConsumption.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500">{stockUnit}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Mensal (30 dias)</p>
              <p className="text-xl font-bold text-purple-600">{monthlyConsumption.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500">{stockUnit}</p>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-600">Tratamento Completo</p>
              <p className="text-xl font-bold text-indigo-600">{totalNeededForTreatment.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500">{stockUnit} em {estimatedDays} dias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      {alertLevel === 'crítico' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="text-red-800 font-semibold">
                🚨 ESTOQUE CRÍTICO - AÇÃO IMEDIATA NECESSÁRIA!
              </div>
              <div className="text-red-700 space-y-1">
                <p>• Estoque atual durará apenas <strong>{daysRemaining.toFixed(1)} dias</strong></p>
                <p>• Consumo diário atual: <strong>{dailyTotalConsumption.toLocaleString('pt-BR')} {stockUnit}</strong></p>
                {shortage > 0 && (
                  <p>• Déficit para tratamento completo: <strong>{shortage.toLocaleString('pt-BR')} {stockUnit}</strong></p>
                )}
                <p className="font-semibold">📞 CONTATE A FARMÁCIA IMEDIATAMENTE!</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {alertLevel === 'baixo' && (
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>⚠️ Estoque Baixo:</strong> Providencie reposição em breve. 
            Estoque atual durará {daysRemaining.toFixed(1)} dias.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DashboardResults;
