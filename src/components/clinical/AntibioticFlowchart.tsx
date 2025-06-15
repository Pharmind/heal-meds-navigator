
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  ArrowRight,
  Microscope
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

  // Matriz de espectro baseada na imagem
  const antibioticMatrix: AntibioticMatrix = {
    // Cocos Gram Positivos
    'Staphylococcus aureus': {
      'Penicilina': 'resistant',
      'Oxacilina': 'variable',
      'Ampicilina': 'resistant',
      'Cefazolina': 'variable',
      'Ceftriaxone': 'variable',
      'Vancomicina': 'sensitive',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive'
    },
    'Streptococcus pneumoniae': {
      'Penicilina': 'variable',
      'Ampicilina': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Vancomicina': 'sensitive',
      'Levofloxacino': 'variable',
      'Azitromicina': 'variable'
    },
    'Enterococcus faecalis': {
      'Penicilina': 'resistant',
      'Ampicilina': 'sensitive',
      'Vancomicina': 'variable',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive'
    },
    // Bacilos Gram Positivos
    'Listeria monocytogenes': {
      'Penicilina': 'sensitive',
      'Ampicilina': 'sensitive',
      'Ceftriaxone': 'resistant',
      'Vancomicina': 'resistant',
      'SMX-TMP': 'sensitive'
    },
    // BGN não enterobactérias
    'Pseudomonas aeruginosa': {
      'Ceftazidima': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'variable',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable',
      'Colistina': 'sensitive'
    },
    'Acinetobacter baumannii': {
      'Ampicilina-Sulbactam': 'variable',
      'Meropenem': 'variable',
      'Amicacina': 'variable',
      'Colistina': 'sensitive',
      'Doxiciclina': 'variable'
    },
    // BGN fermentadoras
    'Escherichia coli': {
      'Ampicilina': 'variable',
      'Cefazolina': 'variable',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable'
    },
    'Klebsiella pneumoniae': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'variable',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'variable',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable'
    }
  };

  const pathogens = Object.keys(antibioticMatrix);
  const antibiotics = selectedPathogen ? Object.keys(antibioticMatrix[selectedPathogen] || {}) : [];

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
      title: "1. Identificação do Patógeno",
      description: "Selecione o patógeno identificado ou suspeito",
      component: (
        <Select value={selectedPathogen} onValueChange={setSelectedPathogen}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o patógeno" />
          </SelectTrigger>
          <SelectContent>
            {pathogens.map((pathogen) => (
              <SelectItem key={pathogen} value={pathogen}>{pathogen}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          <SelectContent>
            {antibiotics.map((antibiotic) => (
              <SelectItem key={antibiotic} value={antibiotic}>{antibiotic}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      title: "3. Análise de Sensibilidade",
      description: "Visualize a matriz de sensibilidade",
      component: selectedPathogen && (
        <div className="space-y-3">
          <h4 className="font-semibold">Perfil de sensibilidade para {selectedPathogen}:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(antibioticMatrix[selectedPathogen] || {}).map(([antibiotic, sensitivity]) => (
              <div 
                key={antibiotic}
                className={`p-2 rounded-lg border flex items-center justify-between ${getSensitivityColor(sensitivity)} ${
                  antibiotic === selectedAntibiotic ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                <span className="font-medium text-sm">{antibiotic}</span>
                <div className="flex items-center gap-1">
                  {getSensitivityIcon(sensitivity)}
                  <span className="text-xs capitalize">{sensitivity}</span>
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
            Fluxograma Interativo - Matriz de Sensibilidade
          </CardTitle>
          <CardDescription>
            Sistema baseado no espectro de ação dos antimicrobianos para guiar decisões terapêuticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Legenda */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Info size={16} />
                Legenda
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-sm">Sensível - Ação excelente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-sm">Variável - Ação moderada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span className="text-sm">Resistente - Ação insuficiente</span>
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
