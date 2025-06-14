
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from 'recharts';
import { TreatmentEstimation } from '@/hooks/useTreatmentEstimations';
import { TrendingUp, AlertTriangle, Users, Package, Activity, BarChart3 } from 'lucide-react';

interface EstimationDashboardProps {
  estimations: TreatmentEstimation[];
  selectedUnit: string;
}

const EstimationDashboard = ({ estimations, selectedUnit }: EstimationDashboardProps) => {
  // Cores para os gráficos
  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    indigo: '#6366f1'
  };

  // Dados para gráfico de pacientes por antimicrobiano
  const patientsByAntimicrobial = React.useMemo(() => {
    const grouped = estimations.reduce((acc, est) => {
      const existing = acc.find(item => item.name === est.antimicrobialName);
      if (existing) {
        existing.pacientes += est.activePatients;
        existing.consumoDiario += est.dailyTotalConsumption;
      } else {
        acc.push({
          name: est.antimicrobialName.length > 15 ? est.antimicrobialName.substring(0, 15) + '...' : est.antimicrobialName,
          fullName: est.antimicrobialName,
          pacientes: est.activePatients,
          consumoDiario: est.dailyTotalConsumption,
          estoque: est.currentStock,
          dias: est.daysRemaining
        });
      }
      return acc;
    }, [] as any[]).sort((a, b) => b.pacientes - a.pacientes);
    
    return grouped.slice(0, 8); // Top 8 antimicrobianos
  }, [estimations]);

  // Dados para gráfico de pizza - status de alerta
  const alertStatusData = React.useMemo(() => {
    const statusCount = estimations.reduce((acc, est) => {
      acc[est.alertLevel] = (acc[est.alertLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Normal', value: statusCount['normal'] || 0, color: colors.success },
      { name: 'Baixo', value: statusCount['baixo'] || 0, color: colors.warning },
      { name: 'Crítico', value: statusCount['crítico'] || 0, color: colors.danger }
    ].filter(item => item.value > 0);
  }, [estimations]);

  // Dados para gráfico de linha - dias restantes
  const daysRemainingData = React.useMemo(() => {
    return estimations
      .map(est => ({
        name: est.antimicrobialName.length > 12 ? est.antimicrobialName.substring(0, 12) + '...' : est.antimicrobialName,
        dias: parseFloat(est.daysRemaining.toFixed(1)),
        alerta: est.alertLevel
      }))
      .sort((a, b) => a.dias - b.dias)
      .slice(0, 10);
  }, [estimations]);

  // Métricas principais
  const metrics = React.useMemo(() => {
    const totalPacientes = estimations.reduce((sum, est) => sum + est.activePatients, 0);
    const totalAntimicrobianos = new Set(estimations.map(est => est.antimicrobialName)).size;
    const criticos = estimations.filter(est => est.alertLevel === 'crítico').length;
    const baixos = estimations.filter(est => est.alertLevel === 'baixo').length;
    const mediaDias = estimations.length > 0 ? 
      estimations.reduce((sum, est) => sum + est.daysRemaining, 0) / estimations.length : 0;

    return { totalPacientes, totalAntimicrobianos, criticos, baixos, mediaDias };
  }, [estimations]);

  if (estimations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Nenhum dado disponível para gerar gráficos.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Users className="mx-auto mb-2 text-blue-600" size={24} />
            <div className="text-2xl font-bold text-blue-700">{metrics.totalPacientes}</div>
            <div className="text-sm text-blue-600">Total Pacientes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Package className="mx-auto mb-2 text-purple-600" size={24} />
            <div className="text-2xl font-bold text-purple-700">{metrics.totalAntimicrobianos}</div>
            <div className="text-sm text-purple-600">Antimicrobianos</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Activity className="mx-auto mb-2 text-green-600" size={24} />
            <div className="text-2xl font-bold text-green-700">{metrics.mediaDias.toFixed(1)}</div>
            <div className="text-sm text-green-600">Dias Médios</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 text-orange-600" size={24} />
            <div className="text-2xl font-bold text-orange-700">{metrics.baixos}</div>
            <div className="text-sm text-orange-600">Estoque Baixo</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 text-center">
            <BarChart3 className="mx-auto mb-2 text-red-600" size={24} />
            <div className="text-2xl font-bold text-red-700">{metrics.criticos}</div>
            <div className="text-sm text-red-600">Estoque Crítico</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Pacientes por Antimicrobiano */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={20} />
              Pacientes por Antimicrobiano
            </CardTitle>
            <CardDescription>
              Top antimicrobianos com maior número de pacientes ativos no setor {selectedUnit}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientsByAntimicrobial} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      `${value} ${name === 'pacientes' ? 'pacientes' : 'mg/dia'}`,
                      name === 'pacientes' ? 'Pacientes Ativos' : 'Consumo Diário'
                    ]}
                    labelFormatter={(label, payload) => {
                      const item = patientsByAntimicrobial.find(p => p.name === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Bar dataKey="pacientes" fill={colors.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Status de Alerta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-green-600" size={20} />
              Status dos Estoques
            </CardTitle>
            <CardDescription>
              Distribuição dos antimicrobianos por nível de alerta de estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {alertStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`${value} medicamentos`, `Status ${name}`]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Linha - Dias Restantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="text-purple-600" size={20} />
            Dias Restantes de Estoque
          </CardTitle>
          <CardDescription>
            Antimicrobianos ordenados por urgência de reposição (menor número de dias restantes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daysRemainingData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis label={{ value: 'Dias', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value} dias`, 'Dias Restantes']}
                />
                <Line 
                  type="monotone" 
                  dataKey="dias" 
                  stroke={colors.purple} 
                  strokeWidth={3}
                  dot={{ fill: colors.purple, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: colors.indigo }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Análise Rápida */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="text-indigo-700">📊 Análise Rápida dos Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Indicadores Positivos:</h4>
              <ul className="space-y-1 text-gray-600">
                {metrics.criticos === 0 && (
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Nenhum medicamento em estado crítico
                  </li>
                )}
                {metrics.mediaDias > 7 && (
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Média de estoque acima de 7 dias
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">ℹ</span>
                  {metrics.totalPacientes} pacientes sendo atendidos
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Pontos de Atenção:</h4>
              <ul className="space-y-1 text-gray-600">
                {metrics.criticos > 0 && (
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    {metrics.criticos} medicamento(s) em estado crítico
                  </li>
                )}
                {metrics.baixos > 0 && (
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500">⚠</span>
                    {metrics.baixos} medicamento(s) com estoque baixo
                  </li>
                )}
                {metrics.mediaDias < 3 && (
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    Média de estoque abaixo de 3 dias
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstimationDashboard;
