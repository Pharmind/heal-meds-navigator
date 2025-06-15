
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';
import { useRoundReports } from '@/hooks/useRoundReports';
import { generateRoundReportPDF } from '@/utils/pdfGenerators/roundReportPDF';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RoundReportModalProps {
  rounds: MultiprofessionalRound[];
  isOpen: boolean;
  onClose: () => void;
}

export const RoundReportModal: React.FC<RoundReportModalProps> = ({
  rounds,
  isOpen,
  onClose
}) => {
  const [reportType, setReportType] = useState<'complete' | 'period' | 'summary'>('complete');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { metrics, generateMetrics } = useRoundReports(rounds);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      let reportMetrics = metrics;
      
      if (reportType === 'period' && startDate && endDate) {
        reportMetrics = generateMetrics(new Date(startDate), new Date(endDate));
      }

      const pdf = generateRoundReportPDF({
        metrics: reportMetrics,
        reportType,
        period: startDate && endDate ? { start: startDate, end: endDate } : null,
        generationDate: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })
      });

      pdf.save(`relatorio-rounds-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalInterventions = Object.values(metrics.interventionsByCategory).reduce((a, b) => a + b, 0);
  const totalClinicalIndicators = Object.values(metrics.clinicalIndicators).reduce((a, b) => a + b, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={24} />
            Relatório de Intervenções - Rounds Multiprofissionais
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configurações do Relatório */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações do Relatório</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Relatório</Label>
                  <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complete">Relatório Completo</SelectItem>
                      <SelectItem value="period">Por Período</SelectItem>
                      <SelectItem value="summary">Resumo Executivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {reportType === 'period' && (
                  <>
                    <div className="space-y-2">
                      <Label>Data Inicial</Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data Final</Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview das Métricas */}
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
                    <p className="text-sm font-medium text-gray-600">Intervenções</p>
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
                    <p className="text-sm font-medium text-gray-600">Indicadores</p>
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
                    <p className="text-sm font-medium text-gray-600">Est. Alta</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics.dischargeEstimates}</p>
                  </div>
                  <PieChart className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo por Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Intervenções por Área</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metrics.interventionsByCategory).map(([area, count]) => (
                  <div key={area} className="flex items-center justify-between">
                    <span className="capitalize">{area === 'pharmacy' ? 'Farmácia' : 
                                                  area === 'medicine' ? 'Medicina' :
                                                  area === 'nursing' ? 'Enfermagem' :
                                                  area === 'physiotherapy' ? 'Fisioterapia' : 'Nutrição'}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicadores Clínicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metrics.clinicalIndicators).map(([indicator, count]) => (
                  <div key={indicator} className="flex items-center justify-between">
                    <span className="text-sm">{
                      indicator === 'dvasUsage' ? 'DVAs em uso' :
                      indicator === 'antibioticTherapy' ? 'Antibioticoterapia' :
                      indicator === 'sedationAnalgesia' ? 'Sedoanalgesia' :
                      indicator === 'tevProphylaxis' ? 'Profilaxia TEV' : 'Profilaxia LAMG'
                    }</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Rounds por Tipo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Tipo de Round</CardTitle>
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

          {/* Botão de Geração */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateReport}
              disabled={isGenerating || (reportType === 'period' && (!startDate || !endDate))}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              {isGenerating ? 'Gerando...' : 'Gerar Relatório PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
