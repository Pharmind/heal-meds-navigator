
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Calendar, User, MapPin, Eye, Edit, Download, Trash2 } from 'lucide-react';
import { useRoundData } from '@/hooks/useRoundData';
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';

export const RoundTimeline: React.FC = () => {
  const { rounds, isLoading, deleteRound } = useRoundData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedRound, setSelectedRound] = useState<MultiprofessionalRound | null>(null);

  const filteredRounds = useMemo(() => {
    return rounds.filter(round => {
      const matchesSearch = searchTerm === '' || 
        round.patient?.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        round.patient?.bed.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = sectorFilter === '' || round.patient?.sector === sectorFilter;
      
      const matchesDate = dateFilter === '' || round.round_date === dateFilter;

      return matchesSearch && matchesSector && matchesDate;
    });
  }, [rounds, searchTerm, sectorFilter, dateFilter]);

  const getStatusIcon = (round: MultiprofessionalRound) => {
    // Lógica simplificada para determinar status
    const hasProblems = round.active_problems && round.active_problems.length > 0;
    const hasCriticalIssues = round.severe_drug_interaction || round.drug_allergy;
    
    if (hasCriticalIssues) return '🔴';
    if (hasProblems) return '🟡';
    return '🟢';
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este round?')) {
      await deleteRound(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar paciente/leito:</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome do paciente ou leito"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Setor:</label>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os setores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os setores</SelectItem>
                  <SelectItem value="UTI Adulto">UTI Adulto</SelectItem>
                  <SelectItem value="UTI Neonatal">UTI Neonatal</SelectItem>
                  <SelectItem value="UTI Pediátrica">UTI Pediátrica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data:</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ações:</label>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSectorFilter('');
                  setDateFilter('');
                }} 
                variant="outline" 
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline dos Rounds */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando rounds...</p>
          </div>
        ) : filteredRounds.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum round encontrado</h3>
              <p className="text-gray-600">
                {searchTerm || sectorFilter || dateFilter 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Ainda não há rounds registrados'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRounds.map((round) => (
            <Card key={round.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getStatusIcon(round)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {round.patient?.patient_name || 'Paciente não identificado'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {round.patient?.sector} - Leito {round.patient?.bed}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(round.round_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline">{round.round_type}</Badge>
                      {round.antibiotic_therapy && (
                        <Badge variant="secondary">Antibioticoterapia</Badge>
                      )}
                      {round.sedation_analgesia && (
                        <Badge variant="secondary">Sedoanalgesia</Badge>
                      )}
                      {round.discharge_estimate && (
                        <Badge variant="default">Alta programada</Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><strong>Profissionais:</strong> {round.present_professionals || 'Não informado'}</p>
                      {round.active_problems && round.active_problems.length > 0 && (
                        <p><strong>Problemas ativos:</strong> {round.active_problems.length}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRound(round)}
                        >
                          <Eye size={14} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Detalhes do Round - {round.patient?.patient_name}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedRound && (
                          <div className="space-y-4">
                            {/* Aqui você pode adicionar um componente de visualização detalhada */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Data:</strong> {new Date(selectedRound.round_date).toLocaleDateString('pt-BR')}
                              </div>
                              <div>
                                <strong>Tipo:</strong> {selectedRound.round_type}
                              </div>
                              <div>
                                <strong>Setor:</strong> {selectedRound.patient?.sector}
                              </div>
                              <div>
                                <strong>Leito:</strong> {selectedRound.patient?.bed}
                              </div>
                            </div>
                            
                            {selectedRound.pharmacy_actions && (
                              <div>
                                <strong>Ações Farmácia:</strong>
                                <p className="mt-1 text-sm">{selectedRound.pharmacy_actions}</p>
                              </div>
                            )}
                            
                            {selectedRound.active_problems && selectedRound.active_problems.length > 0 && (
                              <div>
                                <strong>Problemas Ativos:</strong>
                                <div className="mt-2 space-y-2">
                                  {selectedRound.active_problems.map((problem, index) => (
                                    <div key={index} className="border rounded p-2 text-sm">
                                      <p><strong>Problema:</strong> {problem.problem_description}</p>
                                      {problem.status && (
                                        <p><strong>Status:</strong> {problem.status}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm">
                      <Download size={14} />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(round.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
