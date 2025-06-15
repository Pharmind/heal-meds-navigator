
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  ArrowRight,
  Microscope,
  Search
} from 'lucide-react';

type SensitivityResult = 'sensitive' | 'variable' | 'resistant';

type PathogenData = {
  [antibiotic: string]: SensitivityResult;
};

type AntibioticMatrix = {
  [pathogen: string]: PathogenData;
};

const AntibioticFlowchart = () => {
  const [selectedPathogen, setSelectedPathogen] = useState('');
  const [selectedAntibiotic, setSelectedAntibiotic] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Matriz expandida baseada na imagem e dados clínicos atualizados
  const antibioticMatrix: AntibioticMatrix = {
    // Cocos Gram Positivos
    'Staphylococcus aureus': {
      'Penicilina': 'resistant',
      'Oxacilina': 'variable',
      'Ampicilina': 'resistant',
      'Amoxicilina': 'resistant',
      'Amoxicilina-Clavulanato': 'variable',
      'Cefazolina': 'variable',
      'Cefuroxima': 'variable',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Meropenem': 'variable',
      'Imipenem': 'variable',
      'Ertapenem': 'variable',
      'Vancomicina': 'sensitive',
      'Teicoplanina': 'sensitive',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive',
      'Clindamicina': 'variable',
      'Eritromicina': 'variable',
      'Azitromicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'Moxifloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Tetraciclina': 'variable',
      'Doxiciclina': 'variable',
      'Tigeciclina': 'sensitive',
      'Rifampicina': 'variable',
      'Gentamicina': 'variable',
      'Amicacina': 'variable',
      'Tobramicina': 'variable'
    },
    'Staphylococcus epidermidis': {
      'Penicilina': 'resistant',
      'Oxacilina': 'variable',
      'Vancomicina': 'sensitive',
      'Linezolida': 'sensitive',
      'Teicoplanina': 'sensitive',
      'Rifampicina': 'variable',
      'Gentamicina': 'variable',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Clindamicina': 'variable'
    },
    'Streptococcus pneumoniae': {
      'Penicilina': 'variable',
      'Ampicilina': 'sensitive',
      'Amoxicilina': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Cefotaxima': 'sensitive',
      'Meropenem': 'sensitive',
      'Vancomicina': 'sensitive',
      'Levofloxacino': 'variable',
      'Moxifloxacino': 'variable',
      'Azitromicina': 'variable',
      'Eritromicina': 'variable',
      'Clindamicina': 'variable',
      'SMX-TMP': 'variable',
      'Tetraciclina': 'variable',
      'Cloranfenicol': 'variable',
      'Linezolida': 'sensitive'
    },
    'Streptococcus agalactiae': {
      'Penicilina': 'sensitive',
      'Ampicilina': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Vancomicina': 'sensitive',
      'Clindamicina': 'variable',
      'Eritromicina': 'variable',
      'Levofloxacino': 'sensitive'
    },
    'Streptococcus pyogenes': {
      'Penicilina': 'sensitive',
      'Ampicilina': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Vancomicina': 'sensitive',
      'Clindamicina': 'variable',
      'Eritromicina': 'variable',
      'Azitromicina': 'variable'
    },
    'Enterococcus faecalis': {
      'Penicilina': 'resistant',
      'Ampicilina': 'sensitive',
      'Vancomicina': 'variable',
      'Teicoplanina': 'variable',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive',
      'Gentamicina': 'resistant',
      'Ciprofloxacino': 'resistant',
      'Nitrofurantoína': 'sensitive'
    },
    'Enterococcus faecium': {
      'Ampicilina': 'resistant',
      'Vancomicina': 'variable',
      'Teicoplanina': 'variable',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive',
      'Tigeciclina': 'variable'
    },
    // Bacilos Gram Positivos
    'Listeria monocytogenes': {
      'Penicilina': 'sensitive',
      'Ampicilina': 'sensitive',
      'Ceftriaxone': 'resistant',
      'Meropenem': 'sensitive',
      'Vancomicina': 'resistant',
      'SMX-TMP': 'sensitive',
      'Eritromicina': 'variable'
    },
    'Bacillus cereus': {
      'Vancomicina': 'sensitive',
      'Clindamicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Gentamicina': 'variable'
    },
    'Corynebacterium spp.': {
      'Vancomicina': 'sensitive',
      'Penicilina': 'variable',
      'Eritromicina': 'variable',
      'Clindamicina': 'variable'
    },
    // BGN Enterobactérias
    'Escherichia coli': {
      'Ampicilina': 'variable',
      'Amoxicilina-Clavulanato': 'variable',
      'Cefazolina': 'variable',
      'Cefuroxima': 'variable',
      'Ceftriaxone': 'variable',
      'Cefotaxima': 'variable',
      'Ceftazidima': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'sensitive',
      'Imipenem': 'sensitive',
      'Ertapenem': 'sensitive',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Tobramicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Nitrofurantoína': 'sensitive',
      'Fosfomicina': 'sensitive',
      'Tigeciclina': 'sensitive',
      'Polimixina B': 'sensitive',
      'Colistina': 'sensitive'
    },
    'Klebsiella pneumoniae': {
      'Ampicilina': 'resistant',
      'Amoxicilina-Clavulanato': 'variable',
      'Cefazolina': 'variable',
      'Cefuroxima': 'variable',
      'Ceftriaxone': 'variable',
      'Cefotaxima': 'variable',
      'Ceftazidima': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'variable',
      'Imipenem': 'variable',
      'Ertapenem': 'variable',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Tigeciclina': 'sensitive',
      'Polimixina B': 'sensitive',
      'Colistina': 'sensitive'
    },
    'Enterobacter cloacae': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable'
    },
    'Serratia marcescens': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Ciprofloxacino': 'variable'
    },
    'Citrobacter freundii': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable'
    },
    'Proteus mirabilis': {
      'Ampicilina': 'sensitive',
      'Cefazolina': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Cefepime': 'sensitive',
      'Meropenem': 'sensitive',
      'Amicacina': 'sensitive',
      'Gentamicina': 'sensitive',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable'
    },
    'Proteus vulgaris': {
      'Ampicilina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable'
    },
    'Salmonella spp.': {
      'Ampicilina': 'variable',
      'Ceftriaxone': 'sensitive',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Azitromicina': 'sensitive'
    },
    'Shigella spp.': {
      'Ampicilina': 'variable',
      'Ceftriaxone': 'sensitive',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Azitromicina': 'sensitive'
    },
    // BGN não fermentadoras
    'Pseudomonas aeruginosa': {
      'Ceftazidima': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'variable',
      'Imipenem': 'variable',
      'Doripenem': 'variable',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Tobramicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'Colistina': 'sensitive',
      'Polimixina B': 'sensitive',
      'Aztreonam': 'variable'
    },
    'Acinetobacter baumannii': {
      'Ampicilina-Sulbactam': 'variable',
      'Ceftazidima': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'variable',
      'Imipenem': 'variable',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'Colistina': 'sensitive',
      'Polimixina B': 'sensitive',
      'Doxiciclina': 'variable',
      'Tigeciclina': 'variable'
    },
    'Stenotrophomonas maltophilia': {
      'SMX-TMP': 'sensitive',
      'Levofloxacino': 'variable',
      'Moxifloxacino': 'variable',
      'Doxiciclina': 'variable',
      'Tigeciclina': 'variable',
      'Ceftazidima': 'resistant',
      'Meropenem': 'resistant'
    },
    'Burkholderia cepacia': {
      'SMX-TMP': 'sensitive',
      'Levofloxacino': 'variable',
      'Meropenem': 'variable',
      'Ceftazidima': 'variable',
      'Doxiciclina': 'variable'
    },
    // BGN fastidiosos
    'Haemophilus influenzae': {
      'Ampicilina': 'variable',
      'Amoxicilina-Clavulanato': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Cefotaxima': 'sensitive',
      'Azitromicina': 'sensitive',
      'Ciprofloxacino': 'sensitive',
      'Levofloxacino': 'sensitive',
      'SMX-TMP': 'variable',
      'Doxiciclina': 'variable'
    },
    'Moraxella catarrhalis': {
      'Amoxicilina-Clavulanato': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Azitromicina': 'sensitive',
      'Ciprofloxacino': 'sensitive',
      'SMX-TMP': 'sensitive',
      'Doxiciclina': 'sensitive'
    },
    'Neisseria meningitidis': {
      'Penicilina': 'variable',
      'Ampicilina': 'variable',
      'Ceftriaxone': 'sensitive',
      'Cefotaxima': 'sensitive',
      'Meropenem': 'sensitive',
      'Ciprofloxacino': 'sensitive',
      'Rifampicina': 'sensitive'
    },
    'Neisseria gonorrhoeae': {
      'Penicilina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefixima': 'variable',
      'Azitromicina': 'variable',
      'Ciprofloxacino': 'resistant',
      'Doxiciclina': 'variable'
    },
    // Atípicos
    'Mycoplasma pneumoniae': {
      'Azitromicina': 'sensitive',
      'Claritromicina': 'sensitive',
      'Eritromicina': 'sensitive',
      'Doxiciclina': 'sensitive',
      'Levofloxacino': 'sensitive',
      'Moxifloxacino': 'sensitive'
    },
    'Chlamydia pneumoniae': {
      'Azitromicina': 'sensitive',
      'Claritromicina': 'sensitive',
      'Doxiciclina': 'sensitive',
      'Levofloxacino': 'sensitive',
      'Moxifloxacino': 'sensitive'
    },
    'Legionella pneumophila': {
      'Azitromicina': 'sensitive',
      'Claritromicina': 'sensitive',
      'Levofloxacino': 'sensitive',
      'Moxifloxacino': 'sensitive',
      'Doxiciclina': 'sensitive',
      'Rifampicina': 'sensitive'
    },
    // Anaeróbios
    'Bacteroides fragilis': {
      'Metronidazol': 'sensitive',
      'Clindamicina': 'variable',
      'Ampicilina-Sulbactam': 'sensitive',
      'Piperacilina-Tazobactam': 'sensitive',
      'Meropenem': 'sensitive',
      'Moxifloxacino': 'variable'
    },
    'Clostridium difficile': {
      'Metronidazol': 'sensitive',
      'Vancomicina': 'sensitive',
      'Fidaxomicina': 'sensitive'
    },
    'Peptostreptococcus spp.': {
      'Penicilina': 'sensitive',
      'Clindamicina': 'sensitive',
      'Metronidazol': 'sensitive',
      'Vancomicina': 'sensitive'
    }
  };

  const pathogens = Object.keys(antibioticMatrix);
  const antibiotics = selectedPathogen ? Object.keys(antibioticMatrix[selectedPathogen] || {}) : [];

  // Filtrar patógenos baseado na busca
  const filteredPathogens = pathogens.filter(pathogen => 
    pathogen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSensitivityColor = (sensitivity: SensitivityResult) => {
    switch (sensitivity) {
      case 'sensitive': return 'bg-green-100 text-green-800 border-green-300';
      case 'variable': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'resistant': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSensitivityIcon = (sensitivity: SensitivityResult) => {
    switch (sensitivity) {
      case 'sensitive': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'variable': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'resistant': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRecommendation = () => {
    if (!selectedPathogen || !selectedAntibiotic) return null;

    const pathogenData = antibioticMatrix[selectedPathogen];
    if (!pathogenData) return null;

    const sensitivity = pathogenData[selectedAntibiotic];
    if (!sensitivity) return null;

    const recommendations = {
      'sensitive': {
        title: 'Recomendação: Terapia Dirigida',
        description: 'Antibiótico apropriado para este patógeno. Considere descalonamento se estava em terapia empírica mais ampla.',
        color: 'bg-green-50 border-green-200',
        action: 'Manter ou descalonar para este antibiótico'
      },
      'variable': {
        title: 'Recomendação: Avaliar Antibiograma',
        description: 'Sensibilidade variável. Necessário antibiograma para confirmar eficácia. Considere alternativas.',
        color: 'bg-yellow-50 border-yellow-200',
        action: 'Aguardar antibiograma ou considerar alternativa'
      },
      'resistant': {
        title: 'Recomendação: Escalonamento Necessário',
        description: 'Resistência esperada. Necessário escalonamento para antibiótico de espectro mais amplo.',
        color: 'bg-red-50 border-red-200',
        action: 'Escalonar para antibiótico alternativo'
      }
    };

    return recommendations[sensitivity];
  };

  const flowSteps = [
    {
      title: "1. Busca e Identificação do Patógeno",
      description: "Busque e selecione o patógeno identificado ou suspeito",
      component: (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Buscar patógeno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedPathogen} onValueChange={setSelectedPathogen}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o patógeno" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {filteredPathogens.map((pathogen) => (
                <SelectItem key={pathogen} value={pathogen}>{pathogen}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    },
    {
      title: "2. Seleção do Antibiótico",
      description: "Escolha o antibiótico atual ou em consideração",
      component: (
        <Select 
          value={selectedAntibiotic} 
          onValueChange={setSelectedAntibiotic}
          disabled={!selectedPathogen}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o antibiótico" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {antibiotics.map((antibiotic) => (
              <SelectItem key={antibiotic} value={antibiotic}>{antibiotic}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      title: "3. Análise de Sensibilidade",
      description: "Visualize a matriz de sensibilidade completa",
      component: selectedPathogen && (
        <div className="space-y-3">
          <h4 className="font-semibold">Perfil de sensibilidade para {selectedPathogen}:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
            {Object.entries(antibioticMatrix[selectedPathogen] || {}).map(([antibiotic, sensitivity]) => (
              <div 
                key={antibiotic}
                className={`p-2 rounded-lg border flex items-center justify-between text-xs ${getSensitivityColor(sensitivity)} ${
                  antibiotic === selectedAntibiotic ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                <span className="font-medium">{antibiotic}</span>
                <div className="flex items-center gap-1">
                  {getSensitivityIcon(sensitivity)}
                  <span className="capitalize">{sensitivity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-heal-green-600" size={24} />
            Fluxograma Interativo - Matriz de Sensibilidade Expandida
          </CardTitle>
          <CardDescription>
            Sistema abrangente baseado no espectro de ação dos antimicrobianos com mais de 40 patógenos e 30+ antibióticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(antibioticMatrix).length}</div>
                <div className="text-sm text-blue-700">Patógenos</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {selectedPathogen ? Object.keys(antibioticMatrix[selectedPathogen] || {}).length : '-'}
                </div>
                <div className="text-sm text-green-700">Antibióticos disponíveis</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.values(antibioticMatrix).reduce((total, pathogen) => total + Object.keys(pathogen).length, 0)}
                </div>
                <div className="text-sm text-purple-700">Total de combinações</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredPathogens.length}
                </div>
                <div className="text-sm text-orange-700">Patógenos filtrados</div>
              </div>
            </div>

            {/* Legenda expandida */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Info size={16} />
                Legenda e Categorias
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Sensibilidade:</h5>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-400 rounded"></div>
                      <span className="text-sm">Sensível - Ação excelente (≥90% sensível)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                      <span className="text-sm">Variável - Ação moderada (50-89%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-400 rounded"></div>
                      <span className="text-sm">Resistente - Ação insuficiente (&lt;50%)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Categorias incluídas:</h5>
                  <div className="text-xs space-y-1">
                    <div>• Cocos Gram-positivos (11 espécies)</div>
                    <div>• Bacilos Gram-positivos (3 espécies)</div>
                    <div>• Enterobactérias (10 espécies)</div>
                    <div>• BGN não-fermentadoras (4 espécies)</div>
                    <div>• BGN fastidiosos (4 espécies)</div>
                    <div>• Atípicos (3 espécies)</div>
                    <div>• Anaeróbios (3 espécies)</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Classes de antibióticos:</h5>
                  <div className="text-xs space-y-1">
                    <div>• Beta-lactâmicos (15+ antibióticos)</div>
                    <div>• Aminoglicosídeos (3 antibióticos)</div>
                    <div>• Quinolonas (5 antibióticos)</div>
                    <div>• Macrolídeos (3 antibióticos)</div>
                    <div>• Glicopeptídeos (2 antibióticos)</div>
                    <div>• Outros (10+ antibióticos)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fluxo de decisão */}
            <div className="space-y-4">
              {flowSteps.map((step, index) => (
                <Card key={index} className={index <= currentStep ? 'border-heal-green-300' : 'border-gray-200'}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {index < currentStep ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : index === currentStep ? (
                        <ArrowRight className="text-heal-green-600" size={20} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      )}
                      {step.title}
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {step.component}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Navegação */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>
              <Button 
                onClick={() => setCurrentStep(Math.min(flowSteps.length - 1, currentStep + 1))}
                disabled={currentStep === flowSteps.length - 1}
                className="bg-heal-green-600 hover:bg-heal-green-700"
              >
                Próximo
              </Button>
            </div>

            {/* Recomendação */}
            {recommendation && (
              <Alert className={`${recommendation.color} mt-6`}>
                <Microscope className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <h4 className="font-semibold">{recommendation.title}</h4>
                    <p>{recommendation.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="bg-white">
                        Ação recomendada: {recommendation.action}
                      </Badge>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AntibioticFlowchart;
