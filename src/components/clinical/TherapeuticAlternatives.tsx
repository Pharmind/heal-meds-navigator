
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, AlertTriangle, CheckCircle, Info, Pill, ArrowRight } from 'lucide-react';

interface Alternative {
  name: string;
  dosage: string;
  route: string;
  equivalentDose: string;
  considerations: string;
  contraindications?: string;
  availability: 'disponivel' | 'indisponivel' | 'controlado';
}

interface TherapeuticGroup {
  name: string;
  alternatives: Alternative[];
}

const TherapeuticAlternatives = () => {
  const [searchMedication, setSearchMedication] = useState('');
  const [searchReason, setSearchReason] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<TherapeuticGroup | null>(null);

  // Dados simulados de alternativas terapêuticas
  const therapeuticGroups: Record<string, TherapeuticGroup> = {
    'dipirona': {
      name: 'Analgésicos/Antipiréticos - Alternativas à Dipirona',
      alternatives: [
        {
          name: 'Paracetamol',
          dosage: '500-1000mg 6/6h',
          route: 'VO/IV',
          equivalentDose: '750mg = 500mg dipirona',
          considerations: 'Hepatotoxicidade em doses elevadas. Máximo 4g/dia.',
          availability: 'disponivel'
        },
        {
          name: 'Ibuprofeno',
          dosage: '400-600mg 8/8h',
          route: 'VO',
          equivalentDose: '400mg = 500mg dipirona',
          considerations: 'AINE - cuidado em cardiopatas e nefropatas.',
          contraindications: 'Úlcera péptica ativa, ICC descompensada',
          availability: 'disponivel'
        },
        {
          name: 'Cetoprofeno',
          dosage: '100mg 12/12h',
          route: 'VO/IV',
          equivalentDose: '100mg = 500mg dipirona',
          considerations: 'AINE - monitorar função renal.',
          availability: 'disponivel'
        }
      ]
    },
    'omeprazol': {
      name: 'Inibidores da Bomba de Prótons - Alternativas ao Omeprazol',
      alternatives: [
        {
          name: 'Pantoprazol',
          dosage: '40mg 1x/dia',
          route: 'VO/IV',
          equivalentDose: '40mg = 20mg omeprazol',
          considerations: 'Menor interação medicamentosa que omeprazol.',
          availability: 'disponivel'
        },
        {
          name: 'Esomeprazol',
          dosage: '40mg 1x/dia',
          route: 'VO/IV',
          equivalentDose: '40mg = 20mg omeprazol',
          considerations: 'Enantiômero ativo do omeprazol.',
          availability: 'controlado'
        },
        {
          name: 'Ranitidina',
          dosage: '150mg 12/12h',
          route: 'VO/IV',
          equivalentDose: '150mg = 20mg omeprazol',
          considerations: 'Antagonista H2 - menor potência que IBP.',
          availability: 'indisponivel'
        }
      ]
    },
    'amoxicilina': {
      name: 'Antibióticos β-lactâmicos - Alternativas à Amoxicilina',
      alternatives: [
        {
          name: 'Cefalexina',
          dosage: '500mg 6/6h',
          route: 'VO',
          equivalentDose: '500mg = 500mg amoxicilina',
          considerations: 'Cefalosporina de 1ª geração. Espectro similar.',
          contraindications: 'Alergia a cefalosporinas',
          availability: 'disponivel'
        },
        {
          name: 'Azitromicina',
          dosage: '500mg 1x/dia',
          route: 'VO/IV',
          equivalentDose: '500mg = 500mg amoxicilina',
          considerations: 'Macrolídeo - alternativa em alérgicos a β-lactâmicos.',
          availability: 'disponivel'
        },
        {
          name: 'Clindamicina',
          dosage: '300mg 8/8h',
          route: 'VO/IV',
          equivalentDose: '300mg = 500mg amoxicilina',
          considerations: 'Boa penetração óssea. Risco de colite pseudomembranosa.',
          availability: 'disponivel'
        }
      ]
    }
  };

  const handleSearch = () => {
    const medication = searchMedication.toLowerCase().trim();
    if (therapeuticGroups[medication]) {
      setSelectedGroup(therapeuticGroups[medication]);
    } else {
      setSelectedGroup(null);
    }
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
              <Button onClick={handleSearch} className="w-full">
                <Search size={16} className="mr-2" />
                Buscar
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

      {selectedGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="text-green-600" size={24} />
              {selectedGroup.name}
            </CardTitle>
            <CardDescription>
              Alternativas terapêuticas encontradas - sempre considere o contexto clínico do paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedGroup.alternatives.map((alternative, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{alternative.name}</h3>
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
                      <p className="font-medium">{alternative.route}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">DOSE EQUIVALENTE</Label>
                      <p className="font-medium text-blue-600">{alternative.equivalentDose}</p>
                    </div>
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
                    <div>
                      <Label className="text-xs text-gray-500">CONSIDERAÇÕES CLÍNICAS</Label>
                      <p className="text-sm text-gray-700">{alternative.considerations}</p>
                    </div>
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

      {searchMedication && !selectedGroup && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Info className="text-yellow-600" size={24} />
              <div>
                <h3 className="font-semibold text-yellow-900">Medicamento não encontrado</h3>
                <p className="text-sm text-yellow-800">
                  Não foram encontradas alternativas para "{searchMedication}". Consulte o farmacêutico clínico para orientações específicas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Medicamentos Disponíveis na Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Analgésicos</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Dipirona</li>
                <li>• Paracetamol</li>
                <li>• Ibuprofeno</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Gastroprotetores</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Omeprazol</li>
                <li>• Pantoprazol</li>
                <li>• Ranitidina</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Antibióticos</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Amoxicilina</li>
                <li>• Cefalexina</li>
                <li>• Azitromicina</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapeuticAlternatives;
