
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, AlertTriangle, CheckCircle, Info, Pill, ArrowRight, Plus, Database } from 'lucide-react';
import { useTherapeuticAlternativesByMedication, useReferenceMedications } from '@/hooks/useTherapeuticAlternatives';
import TherapeuticAlternativesManagement from './TherapeuticAlternativesManagement';

const TherapeuticAlternatives = () => {
  const [searchMedication, setSearchMedication] = useState('');
  const [searchReason, setSearchReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: referenceMedications, isLoading: loadingMedications } = useReferenceMedications();
  const { data: searchResult, isLoading: loadingAlternatives } = useTherapeuticAlternativesByMedication(searchQuery);

  const handleSearch = () => {
    setSearchQuery(searchMedication);
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'disponivel':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Disponível</Badge>;
      case 'indisponivel':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Indisponível</Badge>;
      case 'controlado':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Controlado</Badge>;
      default:
        return null;
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'alergia':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'falta':
        return <Info className="text-blue-500" size={20} />;
      case 'interacao':
        return <AlertTriangle className="text-orange-500" size={20} />;
      default:
        return <Pill className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Alternativas Terapêuticas</h2>
        <p className="text-gray-600">Encontre substitutos seguros para medicamentos em casos de falta, alergia ou interação</p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Buscar Alternativas</TabsTrigger>
          <TabsTrigger value="manage">Gerenciar Base de Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="text-blue-600" size={24} />
                Buscar Alternativas
              </CardTitle>
              <CardDescription>
                Digite o medicamento e o motivo da substituição para encontrar alternativas terapêuticas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="medication">Medicamento</Label>
                  <Input
                    id="medication"
                    value={searchMedication}
                    onChange={(e) => setSearchMedication(e.target.value)}
                    placeholder="Ex: dipirona, omeprazol..."
                  />
                </div>
                <div>
                  <Label>Motivo da Substituição</Label>
                  <Select value={searchReason} onValueChange={setSearchReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="falta">Falta do medicamento</SelectItem>
                      <SelectItem value="alergia">Alergia do paciente</SelectItem>
                      <SelectItem value="interacao">Interação medicamentosa</SelectItem>
                      <SelectItem value="contraindicacao">Contraindicação clínica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full" disabled={loadingAlternatives}>
                    <Search size={16} className="mr-2" />
                    {loadingAlternatives ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </div>

              {searchReason && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  {getReasonIcon(searchReason)}
                  <span className="text-sm text-blue-800">
                    {searchReason === 'falta' && 'Buscando alternativas devido à indisponibilidade do medicamento'}
                    {searchReason === 'alergia' && 'Buscando alternativas seguras para paciente alérgico'}
                    {searchReason === 'interacao' && 'Buscando alternativas sem interação medicamentosa'}
                    {searchReason === 'contraindicacao' && 'Buscando alternativas sem contraindicação clínica'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {searchResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="text-green-600" size={24} />
                  Alternativas para {searchResult.referenceMedication.name}
                </CardTitle>
                <CardDescription>
                  Alternativas terapêuticas encontradas - sempre considere o contexto clínico do paciente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResult.alternatives.map((alternative, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">{alternative.alternative_name}</h3>
                          {getAvailabilityBadge(alternative.availability)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div>
                          <Label className="text-xs text-gray-500">DOSAGEM</Label>
                          <p className="font-medium">{alternative.dosage}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">VIA</Label>
                          <p className="font-medium">{alternative.administration_route}</p>
                        </div>
                        {alternative.equivalent_dose && (
                          <div>
                            <Label className="text-xs text-gray-500">DOSE EQUIVALENTE</Label>
                            <p className="font-medium text-blue-600">{alternative.equivalent_dose}</p>
                          </div>
                        )}
                        <div>
                          <Label className="text-xs text-gray-500">STATUS</Label>
                          <p className="font-medium">
                            {alternative.availability === 'disponivel' && 'Disponível no estoque'}
                            {alternative.availability === 'indisponivel' && 'Não disponível'}
                            {alternative.availability === 'controlado' && 'Medicamento controlado'}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="space-y-2">
                        {alternative.considerations && (
                          <div>
                            <Label className="text-xs text-gray-500">CONSIDERAÇÕES CLÍNICAS</Label>
                            <p className="text-sm text-gray-700">{alternative.considerations}</p>
                          </div>
                        )}
                        {alternative.contraindications && (
                          <div>
                            <Label className="text-xs text-red-500">CONTRAINDICAÇÕES</Label>
                            <p className="text-sm text-red-700">{alternative.contraindications}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {searchQuery && !searchResult && !loadingAlternatives && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Info className="text-yellow-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-yellow-900">Medicamento não encontrado</h3>
                    <p className="text-sm text-yellow-800">
                      Não foram encontradas alternativas para "{searchQuery}". Consulte o farmacêutico clínico para orientações específicas ou adicione este medicamento na base de dados.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Database className="text-blue-700" size={20} />
                Medicamentos Disponíveis na Base de Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMedications ? (
                <p className="text-blue-700">Carregando medicamentos...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {referenceMedications?.slice(0, 15).map((med) => (
                    <div key={med.id} className="text-sm text-blue-700">
                      • {med.name}
                    </div>
                  ))}
                  {referenceMedications && referenceMedications.length > 15 && (
                    <div className="text-sm text-blue-600 italic">
                      ... e mais {referenceMedications.length - 15} medicamentos
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <TherapeuticAlternativesManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapeuticAlternatives;
