
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TreatmentEstimation } from '@/hooks/useTreatmentEstimations';
import { BarChart3, Users, Package, Calendar } from 'lucide-react';

interface EstimationSummaryProps {
  estimations: TreatmentEstimation[];
  selectedUnit: string;
}

interface SummaryData {
  antimicrobialName: string;
  totalPatients: number;
  totalDailyConsumption: number;
  totalStock: number;
  averageDaysRemaining: number;
  stockUnit: string;
  alertLevel: 'normal' | 'baixo' | 'crítico';
  estimationsCount: number;
}

const EstimationSummary = ({ estimations, selectedUnit }: EstimationSummaryProps) => {
  // Agrupar estimativas por antimicrobiano
  const summaryByAntimicrobial = React.useMemo(() => {
    const grouped = estimations.reduce((acc, estimation) => {
      const key = estimation.antimicrobialName;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(estimation);
      return acc;
    }, {} as Record<string, TreatmentEstimation[]>);

    return Object.entries(grouped).map(([antimicrobialName, estims]): SummaryData => {
      const totalPatients = estims.reduce((sum, e) => sum + e.activePatients, 0);
      const totalDailyConsumption = estims.reduce((sum, e) => sum + e.dailyTotalConsumption, 0);
      const totalStock = estims.reduce((sum, e) => sum + e.currentStock, 0);
      const averageDaysRemaining = estims.reduce((sum, e) => sum + e.daysRemaining, 0) / estims.length;
      
      // Determinar nível de alerta baseado na média de dias restantes
      let alertLevel: 'normal' | 'baixo' | 'crítico' = 'normal';
      if (averageDaysRemaining <= 2) alertLevel = 'crítico';
      else if (averageDaysRemaining <= 5) alertLevel = 'baixo';

      return {
        antimicrobialName,
        totalPatients,
        totalDailyConsumption,
        totalStock,
        averageDaysRemaining,
        stockUnit: estims[0]?.stockUnit || 'mg',
        alertLevel,
        estimationsCount: estims.length
      };
    });
  }, [estimations]);

  // Totais gerais do setor
  const sectorTotals = React.useMemo(() => {
    return {
      totalPatients: estimations.reduce((sum, e) => sum + e.activePatients, 0),
      totalEstimations: estimations.length,
      criticalMedications: summaryByAntimicrobial.filter(s => s.alertLevel === 'crítico').length,
      lowStockMedications: summaryByAntimicrobial.filter(s => s.alertLevel === 'baixo').length
    };
  }, [estimations, summaryByAntimicrobial]);

  if (estimations.length === 0) {
    return null;
  }

  const getAlertBadgeColor = (level: string) => {
    switch (level) {
      case 'crítico': return 'bg-red-500 text-white';
      case 'baixo': return 'bg-orange-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo do Setor */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={20} />
            Resumo Consolidado - {selectedUnit}
          </CardTitle>
          <CardDescription>
            Soma automática de todas as estimativas cadastradas no setor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <Users className="mx-auto mb-2 text-blue-600" size={24} />
              <div className="text-2xl font-bold text-blue-700">{sectorTotals.totalPatients}</div>
              <div className="text-sm text-gray-600">Pacientes Total</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <Package className="mx-auto mb-2 text-green-600" size={24} />
              <div className="text-2xl font-bold text-green-700">{sectorTotals.totalEstimations}</div>
              <div className="text-sm text-gray-600">Antimicrobianos</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <Calendar className="mx-auto mb-2 text-orange-600" size={24} />
              <div className="text-2xl font-bold text-orange-700">{sectorTotals.lowStockMedications}</div>
              <div className="text-sm text-gray-600">Estoque Baixo</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <BarChart3 className="mx-auto mb-2 text-red-600" size={24} />
              <div className="text-2xl font-bold text-red-700">{sectorTotals.criticalMedications}</div>
              <div className="text-sm text-gray-600">Estoque Crítico</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela Resumo por Antimicrobiano */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Antimicrobiano</CardTitle>
          <CardDescription>
            Soma consolidada de pacientes, consumo e estoque por medicamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Antimicrobiano</TableHead>
                  <TableHead className="text-center">Pacientes</TableHead>
                  <TableHead className="text-center">Consumo Diário</TableHead>
                  <TableHead className="text-center">Estoque Total</TableHead>
                  <TableHead className="text-center">Dias Médios</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Estimativas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryByAntimicrobial.map((summary) => (
                  <TableRow key={summary.antimicrobialName}>
                    <TableCell className="font-semibold">
                      {summary.antimicrobialName}
                    </TableCell>
                    <TableCell className="text-center">
                      {summary.totalPatients}
                    </TableCell>
                    <TableCell className="text-center">
                      {summary.totalDailyConsumption.toLocaleString('pt-BR')} {summary.stockUnit}
                    </TableCell>
                    <TableCell className="text-center">
                      {summary.totalStock.toLocaleString('pt-BR')} {summary.stockUnit}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={summary.alertLevel === 'crítico' ? 'text-red-700 font-bold' : 
                                     summary.alertLevel === 'baixo' ? 'text-orange-700 font-bold' : 
                                     'text-green-700'}>
                        {summary.averageDaysRemaining.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getAlertBadgeColor(summary.alertLevel)}>
                        {summary.alertLevel === 'crítico' ? '🚨 CRÍTICO' : 
                         summary.alertLevel === 'baixo' ? '⚠️ BAIXO' : 
                         '✅ NORMAL'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{summary.estimationsCount}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstimationSummary;
