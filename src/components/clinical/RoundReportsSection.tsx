
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, Download, Calendar, TrendingUp, PieChart, AlertCircle } from 'lucide-react';
import { useRoundData } from '@/hooks/useRoundData';
import { useRoundReports } from '@/hooks/useRoundReports';
import { RoundReportModal } from '@/components/clinical/round/components/RoundReportModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RoundReportsSection = () => {
  const { rounds, isLoading } = useRoundData();
  const { metrics } = useRoundReports(rounds);
  const [showReportModal, setShowReportModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando dados...</span>
      </div>
    );
  }

  const totalInterventions = Object.values(metrics.interventionsByCategory).reduce((a, b) => a + b, 0);
  const totalClinicalIndicators = Object.values(metrics.clinicalIndicators).reduce((a, b) => a + b, 0);

  // Dados para período específico (últimos 30 dias)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const last30DaysMetrics = useRoundReports(rounds.filter(round => 
    new Date(round.round_date) >= thirtyDaysAgo
  )).metrics;

  // Dados para período específico (últimos 7 dias)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const last7DaysMetrics = useRoundReports(rounds.filter(round => 
    new Date(round.round_date) >= sevenDaysAgo
  )).metrics;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios de Round</h1>
          <p className="text-gray-600">Análise e métricas dos rounds multiprofissionais</p>
        </div>
        <FileText className="h-8 w-8 text-blue-600" />
      </div>

      {rounds.length === 0 ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle size={20} />
              <span>Não há dados de rounds cadastrados para gerar relatórios.</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resumo Geral */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Rounds</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.totalRounds}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Intervenções</p>
                    <p className="text-2xl font-bold text-green-600">{totalInterventions}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Indicadores Clínicos</p>
                    <p className="text-2xl font-bold text-purple-600">{totalClinicalIndicators}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estimativas de Alta</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics.dischargeEstimates}</p>
                  </div>
                  <PieChart className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análise por Período */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Últimos 7 Dias</CardTitle>
                <CardDescription>Atividade recente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rounds</span>
                  <Badge variant="outline">{last7DaysMetrics.totalRounds}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Intervenções</span>
                  <Badge variant="secondary">
                    {Object.values(last7DaysMetrics.interventionsByCategory).reduce((a, b) => a + b, 0)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Últimos 30 Dias</CardTitle>
                <CardDescription>Visão mensal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rounds</span>
                  <Badge variant="outline">{last30DaysMetrics.totalRounds}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Intervenções</span>
                  <Badge variant="secondary">
                    {Object.values(last30DaysMetrics.interventionsByCategory).reduce((a, b) => a + b, 0)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                <CardDescription>Gerar relatórios</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowReportModal(true)}
                  className="w-full flex items-center gap-2"
                >
                  <Download size={16} />
                  Gerar Relatório PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Distribuição por Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Intervenções por Área</CardTitle>
                <CardDescription>Distribuição das intervenções por especialidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metrics.interventionsByCategory).map(([area, count]) => (
                  <div key={area} className="flex items-center justify-between">
                    <span className="capitalize">
                      {area === 'pharmacy' ? 'Farmácia' : 
                       area === 'medicine' ? 'Medicina' :
                       area === 'nursing' ? 'Enfermagem' :
                       area === 'physiotherapy' ? 'Fisioterapia' : 'Nutrição'}
                    </span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicadores Clínicos</CardTitle>
                <CardDescription>Monitoramento de indicadores importantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metrics.clinicalIndicators).map(([indicator, count]) => (
                  <div key={indicator} className="flex items-center justify-between">
                    <span className="text-sm">
                      {indicator === 'dvasUsage' ? 'DVAs em uso' :
                       indicator === 'antibioticTherapy' ? 'Antibioticoterapia' :
                       indicator === 'sedationAnalgesia' ? 'Sedoanalgesia' :
                       indicator === 'tevProphylaxis' ? 'Profilaxia TEV' : 'Profilaxia LAMG'}
                    </span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tipos de Round */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Tipo de Round</CardTitle>
              <CardDescription>Análise dos diferentes tipos de rounds realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(metrics.roundsByType).map(([type, count]) => (
                  <Badge key={type} variant="outline" className="px-3 py-1">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal de Relatório */}
      <RoundReportModal 
        rounds={rounds}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};

export default RoundReportsSection;
