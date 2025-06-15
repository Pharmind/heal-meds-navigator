
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, FileBarChart, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useMultiprofessionalRounds } from '@/hooks/useMultiprofessionalRounds';
import { useRoundReports } from '@/hooks/useRoundReports';
import { generateRoundReportPDF } from '@/utils/pdfGenerators/roundReportPDF';
import { toast } from 'sonner';

const RoundReportsSection = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [generating, setGenerating] = useState(false);
  
  const { rounds } = useMultiprofessionalRounds();
  const { generateMetrics } = useRoundReports(rounds);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Selecione as datas de início e fim do relatório');
      return;
    }

    if (startDate > endDate) {
      toast.error('A data de início deve ser anterior à data de fim');
      return;
    }

    try {
      setGenerating(true);
      
      const metrics = generateMetrics(startDate, endDate);
      
      if (metrics.totalRounds === 0) {
        toast.warning('Nenhum round encontrado no período selecionado');
        return;
      }

      await generateRoundReportPDF(metrics, startDate, endDate);
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  const totalRounds = rounds.length;
  const currentMetrics = generateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios de Round Multiprofissional</h1>
          <p className="text-gray-600">Gere relatórios detalhados com análises e métricas dos rounds</p>
        </div>
        <FileBarChart className="h-8 w-8 text-blue-600" />
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalRounds}</div>
            <p className="text-xs text-muted-foreground">Total de Rounds</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{currentMetrics.interventionsByCategory.pharmacy}</div>
            <p className="text-xs text-muted-foreground">Intervenções Farmacêuticas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{currentMetrics.dischargeEstimates}</div>
            <p className="text-xs text-muted-foreground">Estimativas de Alta</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{currentMetrics.averageRoundsPerDay.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Média Rounds/Dia</p>
          </CardContent>
        </Card>
      </div>

      {/* Geração de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatório Personalizado</CardTitle>
          <CardDescription>
            Selecione o período para gerar um relatório detalhado em PDF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button 
            onClick={handleGenerateReport}
            disabled={generating || !startDate || !endDate}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            {generating ? 'Gerando Relatório...' : 'Gerar Relatório PDF'}
          </Button>
        </CardContent>
      </Card>

      {/* Prévia das Métricas */}
      {startDate && endDate && (
        <Card>
          <CardHeader>
            <CardTitle>Prévia do Período Selecionado</CardTitle>
            <CardDescription>
              {format(startDate, "dd/MM/yyyy", { locale: ptBR })} até {format(endDate, "dd/MM/yyyy", { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(() => {
                const periodMetrics = generateMetrics(startDate, endDate);
                return (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{periodMetrics.totalRounds}</div>
                      <p className="text-sm text-muted-foreground">Rounds</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{periodMetrics.interventionsByCategory.pharmacy}</div>
                      <p className="text-sm text-muted-foreground">Intervenções Farmácia</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{periodMetrics.interventionsByCategory.medicine}</div>
                      <p className="text-sm text-muted-foreground">Intervenções Medicina</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{periodMetrics.dischargeEstimates}</div>
                      <p className="text-sm text-muted-foreground">Estimativas Alta</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoundReportsSection;
