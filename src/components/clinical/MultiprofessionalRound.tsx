
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, UserPlus, History, Calendar, Users } from 'lucide-react';
import { RoundChecklistForm } from './round/RoundChecklistForm';
import { RoundTimeline } from './round/RoundTimeline';
import { useRoundData } from '@/hooks/useRoundData';

const MultiprofessionalRound = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'timeline'>('checklist');
  const { rounds, isLoading } = useRoundData();

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-heal-green-800 mb-3 flex items-center justify-center gap-3">
          <Stethoscope className="text-heal-green-700" size={40} />
          Checklist Round Multiprofissional UTI
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Sistema completo para registro e acompanhamento de rounds multiprofissionais em UTI Adulto, Neonatal e Pediátrica
        </p>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Rounds</p>
                <p className="text-2xl font-bold text-blue-600">{rounds.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-green-600">
                  {rounds.filter(r => r.round_date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-purple-600">
                  {rounds.filter(r => {
                    const roundDate = new Date(r.round_date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return roundDate >= weekAgo;
                  }).length}
                </p>
              </div>
              <Stethoscope className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navegação Principal */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'checklist' | 'timeline')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <UserPlus size={18} />
            Novo Checklist
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <History size={18} />
            Histórico/Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <UserPlus className="text-blue-600" size={28} />
                Checklist Round Multiprofissional UTI
              </CardTitle>
              <CardDescription className="text-base">
                Formulário completo para registro de round multiprofissional com checklist abrangente para UTI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoundChecklistForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <History className="text-green-600" size={28} />
                Histórico de Rounds - Timeline
              </CardTitle>
              <CardDescription className="text-base">
                Visualização cronológica e busca avançada de todos os rounds realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoundTimeline />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiprofessionalRound;
