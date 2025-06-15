
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Filter, Eye, Edit, Trash2, User, MapPin } from 'lucide-react';
import { useRoundData } from '@/hooks/useRoundData';
import { RoundViewModal } from './components/RoundViewModal';
import { RoundPrintOptions } from './components/RoundPrintOptions';
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const RoundTimeline: React.FC = () => {
  const { rounds, isLoading, deleteRound } = useRoundData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  const [selectedRound, setSelectedRound] = useState<MultiprofessionalRound | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredRounds = useMemo(() => {
    return rounds.filter(round => {
      const matchesSearch = !searchTerm || 
        (round.patient?.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         round.patient?.bed?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'all' || round.round_type === filterType;
      const matchesSector = filterSector === 'all' || round.patient?.sector === filterSector;
      
      return matchesSearch && matchesType && matchesSector;
    });
  }, [rounds, searchTerm, filterType, filterSector]);

  const handleDeleteRound = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este round?')) {
      await deleteRound(id);
    }
  };

  const handleViewRound = (round: MultiprofessionalRound) => {
    setSelectedRound(round);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando rounds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar:</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Nome do paciente ou leito..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Round:</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Adulto">Adulto</SelectItem>
                  <SelectItem value="Neonatal">Neonatal</SelectItem>
                  <SelectItem value="Pediátrica">Pediátrica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Setor:</label>
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  <SelectItem value="UTI Adulto">UTI Adulto</SelectItem>
                  <SelectItem value="UTI Neonatal">UTI Neonatal</SelectItem>
                  <SelectItem value="UTI Pediátrica">UTI Pediátrica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opções de Impressão */}
      <RoundPrintOptions rounds={filteredRounds} />

      {/* Lista de Rounds */}
      <div className="space-y-4">
        {filteredRounds.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum round encontrado
              </h3>
              <p className="text-gray-600">
                {rounds.length === 0 
                  ? 'Ainda não há rounds cadastrados no sistema.'
                  : 'Nenhum round corresponde aos filtros aplicados.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRounds.map((round) => (
            <Card key={round.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-medium">
                        {round.round_type}
                      </Badge>
                      <Badge variant="secondary">
                        {format(new Date(round.round_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-blue-600" />
                          <span className="font-medium text-gray-900">
                            {round.patient?.patient_name || 'Nome não informado'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span>{round.patient?.sector} - Leito {round.patient?.bed}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Próxima avaliação:</span>{' '}
                          {round.next_evaluation 
                            ? format(new Date(round.next_evaluation), 'dd/MM/yyyy', { locale: ptBR })
                            : 'Não definida'
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          Criado em {format(new Date(round.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewRound(round)}
                    >
                      <Eye size={16} className="mr-1" />
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit size={16} className="mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteRound(round.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
                
                {/* Resumo rápido dos status */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    {round.dvas_usage && (
                      <Badge variant="secondary" className="text-xs">DVAs em uso</Badge>
                    )}
                    {round.antibiotic_therapy && (
                      <Badge variant="secondary" className="text-xs">Antibioticoterapia</Badge>
                    )}
                    {round.sedation_analgesia && (
                      <Badge variant="secondary" className="text-xs">Sedoanalgesia</Badge>
                    )}
                    {round.discharge_estimate && (
                      <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                        Estimativa de alta
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Visualização */}
      <RoundViewModal
        round={selectedRound}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedRound(null);
        }}
      />
    </div>
  );
};
