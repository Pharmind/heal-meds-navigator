
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  CheckCircle,
  ArrowRight,
  Microscope
} from 'lucide-react';

import { antibioticMatrix } from './antibiotic-flowchart/antibioticMatrix';
import { getRecommendation } from './antibiotic-flowchart/utils';
import PathogenSearch from './antibiotic-flowchart/PathogenSearch';
import AntibioticSelection from './antibiotic-flowchart/AntibioticSelection';
import SensitivityAnalysis from './antibiotic-flowchart/SensitivityAnalysis';
import StatisticsCards from './antibiotic-flowchart/StatisticsCards';
import LegendSection from './antibiotic-flowchart/LegendSection';
import { FlowStep, SensitivityResult } from './antibiotic-flowchart/types';

const AntibioticFlowchart = () => {
  const [selectedPathogen, setSelectedPathogen] = useState('');
  const [selectedAntibiotic, setSelectedAntibiotic] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const pathogens = Object.keys(antibioticMatrix);
  const antibiotics = selectedPathogen ? Object.keys(antibioticMatrix[selectedPathogen] || {}) : [];

  // Filtrar patógenos baseado na busca
  const filteredPathogens = pathogens.filter(pathogen => 
    pathogen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const flowSteps: FlowStep[] = [
    {
      title: "1. Busca e Identificação do Patógeno",
      description: "Busque e selecione o patógeno identificado ou suspeito",
      component: (
        <PathogenSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedPathogen={selectedPathogen}
          setSelectedPathogen={setSelectedPathogen}
          filteredPathogens={filteredPathogens}
        />
      )
    },
    {
      title: "2. Seleção do Antibiótico",
      description: "Escolha o antibiótico atual ou em consideração",
      component: (
        <AntibioticSelection
          selectedAntibiotic={selectedAntibiotic}
          setSelectedAntibiotic={setSelectedAntibiotic}
          antibiotics={antibiotics}
          disabled={!selectedPathogen}
        />
      )
    },
    {
      title: "3. Análise de Sensibilidade",
      description: "Visualize a matriz de sensibilidade completa",
      component: selectedPathogen && (
        <SensitivityAnalysis
          selectedPathogen={selectedPathogen}
          selectedAntibiotic={selectedAntibiotic}
          pathogenData={antibioticMatrix[selectedPathogen] || {}}
        />
      )
    }
  ];

  const getRecommendationForSelection = () => {
    if (!selectedPathogen || !selectedAntibiotic) return null;

    const pathogenData = antibioticMatrix[selectedPathogen];
    if (!pathogenData) return null;

    const sensitivity = pathogenData[selectedAntibiotic] as SensitivityResult;
    if (!sensitivity) return null;

    return getRecommendation(sensitivity);
  };

  const recommendation = getRecommendationForSelection();

  // Calculate statistics
  const totalPathogens = Object.keys(antibioticMatrix).length;
  const availableAntibiotics = selectedPathogen ? Object.keys(antibioticMatrix[selectedPathogen] || {}).length : 0;
  const totalCombinations = Object.values(antibioticMatrix).reduce((total, pathogen) => total + Object.keys(pathogen).length, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-heal-green-600" size={24} />
            Fluxograma Interativo - Matriz de Sensibilidade Hospitalar Expandida
          </CardTitle>
          <CardDescription>
            Sistema abrangente com mais de 60 patógenos e 80+ antibióticos de importância hospitalar, incluindo antimicrobianos de reserva e controle de infecção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Estatísticas */}
            <StatisticsCards
              totalPathogens={totalPathogens}
              availableAntibiotics={availableAntibiotics}
              totalCombinations={totalCombinations}
              filteredPathogens={filteredPathogens.length}
            />

            {/* Legenda expandida */}
            <LegendSection />

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
