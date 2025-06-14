
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type FlowStep = 
  | 'start'
  | 'stable-24h'
  | 'oral-function'
  | 'absorption'
  | 'contraindications'
  | 'success'
  | 'maintain-iv'
  | 'clinical-evaluation';

const SequentialTherapyFlowchart = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('start');
  const [history, setHistory] = useState<FlowStep[]>(['start']);

  const goToStep = (step: FlowStep) => {
    setCurrentStep(step);
    setHistory(prev => [...prev, step]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentStep(newHistory[newHistory.length - 1]);
    }
  };

  const restart = () => {
    setCurrentStep('start');
    setHistory(['start']);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'start':
        return (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="text-center">
              <CardTitle className="text-blue-800 flex items-center justify-center gap-2">
                <AlertCircle className="text-blue-600" size={24} />
                Início da Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-blue-700 font-medium">
                Paciente em uso de medicamento endovenoso (IV) há mais de 48-72 horas
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => goToStep('stable-24h')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Iniciar Avaliação
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'stable-24h':
        return (
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader className="text-center">
              <CardTitle className="text-yellow-800">Estabilidade Clínica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-yellow-700 font-medium">
                Paciente clinicamente estável nas últimas 24 horas?
              </p>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Critérios de estabilidade:</strong>
                </p>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• Sinais vitais estáveis</li>
                  <li>• Ausência de febre ou febre controlada</li>
                  <li>• Melhora do quadro clínico</li>
                  <li>• Exames laboratoriais em melhora</li>
                </ul>
              </div>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => goToStep('oral-function')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Sim
                </Button>
                <Button 
                  onClick={() => goToStep('maintain-iv')}
                  variant="destructive"
                >
                  <XCircle className="mr-2" size={16} />
                  Não
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'oral-function':
        return (
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="text-center">
              <CardTitle className="text-purple-800">Função do Trato Gastrointestinal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-purple-700 font-medium">
                Trato gastrointestinal funcionante?
              </p>
              <div className="bg-purple-100 p-3 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Avalie:</strong>
                </p>
                <ul className="text-sm text-purple-700 mt-2 space-y-1">
                  <li>• Capacidade de deglutição</li>
                  <li>• Ausência de náuseas/vômitos</li>
                  <li>• Peristaltismo presente</li>
                  <li>• Ausência de íleo paralítico</li>
                </ul>
              </div>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => goToStep('absorption')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Sim
                </Button>
                <Button 
                  onClick={() => goToStep('maintain-iv')}
                  variant="destructive"
                >
                  <XCircle className="mr-2" size={16} />
                  Não
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'absorption':
        return (
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="text-center">
              <CardTitle className="text-orange-800">Absorção do Medicamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-orange-700 font-medium">
                Medicamento tem boa absorção por via oral?
              </p>
              <div className="bg-orange-100 p-3 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Considere:</strong>
                </p>
                <ul className="text-sm text-orange-700 mt-2 space-y-1">
                  <li>• Biodisponibilidade oral ≥ 80%</li>
                  <li>• Ausência de interação com alimentos</li>
                  <li>• Formulação oral disponível</li>
                  <li>• Bioequivalência comprovada</li>
                </ul>
              </div>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => goToStep('contraindications')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Sim
                </Button>
                <Button 
                  onClick={() => goToStep('maintain-iv')}
                  variant="destructive"
                >
                  <XCircle className="mr-2" size={16} />
                  Não
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'contraindications':
        return (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <CardTitle className="text-red-800">Contraindicações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-red-700 font-medium">
                Existem contraindicações para conversão IV → VO?
              </p>
              <div className="bg-red-100 p-3 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Contraindicações:</strong>
                </p>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  <li>• Meningite ou endocardite</li>
                  <li>• Osteomielite</li>
                  <li>• Neutropenia grave</li>
                  <li>• Síndrome compartimental</li>
                  <li>• Necessidade de altas concentrações séricas</li>
                </ul>
              </div>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => goToStep('success')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Não há contraindicações
                </Button>
                <Button 
                  onClick={() => goToStep('maintain-iv')}
                  variant="destructive"
                >
                  <XCircle className="mr-2" size={16} />
                  Sim, há contraindicações
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'success':
        return (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <CardTitle className="text-green-800 flex items-center justify-center gap-2">
                <CheckCircle className="text-green-600" size={24} />
                Terapia Sequencial Indicada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                  CONVERTER IV → VO
                </Badge>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-sm text-green-800 font-semibold mb-2">
                  Próximos passos:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Consultar tabela de conversões IV → VO</li>
                  <li>• Ajustar dose conforme necessário</li>
                  <li>• Monitorar resposta clínica</li>
                  <li>• Avaliar adesão ao tratamento</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 'maintain-iv':
        return (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <CardTitle className="text-red-800 flex items-center justify-center gap-2">
                <XCircle className="text-red-600" size={24} />
                Manter Terapia IV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  NÃO CONVERTER
                </Badge>
              </div>
              <div className="bg-red-100 p-4 rounded-lg">
                <p className="text-sm text-red-800 font-semibold mb-2">
                  Recomendações:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Manter via endovenosa</li>
                  <li>• Reavaliar diariamente</li>
                  <li>• Aguardar estabilização clínica</li>
                  <li>• Considerar outros fatores limitantes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 'clinical-evaluation':
        return (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="text-center">
              <CardTitle className="text-blue-800">Avaliação Clínica Contínua</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-blue-700 font-medium">
                Reavalie as condições do paciente periodicamente
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => goToStep('stable-24h')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Nova Avaliação
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {history.length > 1 && (
            <Button 
              onClick={goBack}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="mr-1" size={14} />
              Voltar
            </Button>
          )}
          <Button 
            onClick={restart}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="mr-1" size={14} />
            Reiniciar
          </Button>
        </div>
        <Badge variant="secondary">
          Passo {history.length}
        </Badge>
      </div>

      {renderStep()}

      <div className="text-center text-sm text-gray-500">
        <p>Clique nas opções para navegar pelo fluxograma de decisão</p>
      </div>
    </div>
  );
};

export default SequentialTherapyFlowchart;
