
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, AlertTriangle, CheckCircle, Info, RotateCcw } from 'lucide-react';

interface DrugClass {
  id: string;
  name: string;
  shortName: string;
  representatives: string[];
  position: { x: number; y: number };
  color: string;
}

interface Interaction {
  classes: string[];
  type: 'preferencial' | 'nao-recomendada' | 'possivel';
  recommendation: string;
  alternative: string;
}

const AntihypertensiveOptimization = () => {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [currentInteraction, setCurrentInteraction] = useState<Interaction | null>(null);

  const drugClasses: DrugClass[] = [
    {
      id: 'diureticos',
      name: 'Diuréticos tiazídicos',
      shortName: 'Diuréticos',
      representatives: ['Hidroclorotiazida', 'Clortalidona', 'Indapamida'],
      position: { x: 50, y: 10 },
      color: 'bg-yellow-500'
    },
    {
      id: 'betabloqueadores',
      name: 'Betabloqueadores',
      shortName: 'BB',
      representatives: ['Propranolol', 'Metoprolol', 'Atenolol', 'Carvedilol'],
      position: { x: 10, y: 50 },
      color: 'bg-blue-500'
    },
    {
      id: 'bra',
      name: 'Bloqueadores dos receptores da angiotensina',
      shortName: 'BRA',
      representatives: ['Losartana', 'Valsartana', 'Telmisartana'],
      position: { x: 90, y: 30 },
      color: 'bg-green-500'
    },
    {
      id: 'ieca',
      name: 'Inibidores da ECA',
      shortName: 'IECA',
      representatives: ['Enalapril', 'Captopril', 'Lisinopril'],
      position: { x: 50, y: 90 },
      color: 'bg-purple-500'
    },
    {
      id: 'calcio',
      name: 'Bloqueadores dos canais de cálcio',
      shortName: 'BCC',
      representatives: ['Amlodipina', 'Nifedipina', 'Verapamil', 'Diltiazem'],
      position: { x: 90, y: 70 },
      color: 'bg-red-500'
    },
    {
      id: 'outros',
      name: 'Outros anti-hipertensivos',
      shortName: 'Outros',
      representatives: ['Clonidina', 'Doxazosina', 'Hidralazina'],
      position: { x: 10, y: 90 },
      color: 'bg-gray-500'
    }
  ];

  const interactions: Interaction[] = [
    // Combinações preferenciais
    {
      classes: ['diureticos', 'ieca'],
      type: 'preferencial',
      recommendation: 'Combinação preferencial - excelente sinergia terapêutica.',
      alternative: 'Manter esta combinação, considerada primeira linha.'
    },
    {
      classes: ['diureticos', 'bra'],
      type: 'preferencial',
      recommendation: 'Combinação preferencial - boa tolerabilidade e eficácia.',
      alternative: 'Manter esta combinação, adequada para hipertensão essencial.'
    },
    {
      classes: ['calcio', 'ieca'],
      type: 'preferencial',
      recommendation: 'Combinação preferencial - proteção cardiovascular.',
      alternative: 'Excelente para pacientes com risco cardiovascular aumentado.'
    },
    {
      classes: ['calcio', 'bra'],
      type: 'preferencial',
      recommendation: 'Combinação preferencial - boa eficácia anti-hipertensiva.',
      alternative: 'Adequada especialmente para idosos e diabéticos.'
    },
    
    // Combinações não recomendadas
    {
      classes: ['ieca', 'bra'],
      type: 'nao-recomendada',
      recommendation: 'Combinação não recomendada - risco de hipercalemia e piora da função renal.',
      alternative: 'Substitua por: IECA + Bloqueador de canal de cálcio ou IECA + Diurético tiazídico.'
    },
    {
      classes: ['betabloqueadores', 'calcio'],
      type: 'nao-recomendada',
      recommendation: 'Combinação não recomendada com verapamil/diltiazem - risco de bloqueio cardíaco.',
      alternative: 'Use Betabloqueador + Amlodipina (di-hidropiridínico) ou substitua por IECA/BRA.'
    },
    
    // Combinações possíveis mas menos testadas
    {
      classes: ['betabloqueadores', 'diureticos'],
      type: 'possivel',
      recommendation: 'Combinação possível, mas atenção aos efeitos metabólicos.',
      alternative: 'Monitore glicemia e perfil lipídico. Considere IECA + Diurético se houver alterações.'
    },
    {
      classes: ['outros', 'diureticos'],
      type: 'possivel',
      recommendation: 'Combinação de segunda linha - pode ser usada em casos específicos.',
      alternative: 'Prefira combinações de primeira linha quando possível.'
    }
  ];

  const handleClassClick = (classId: string) => {
    let newSelection: string[];
    
    if (selectedClasses.includes(classId)) {
      newSelection = selectedClasses.filter(id => id !== classId);
    } else if (selectedClasses.length < 2) {
      newSelection = [...selectedClasses, classId];
    } else {
      newSelection = [selectedClasses[1], classId];
    }
    
    setSelectedClasses(newSelection);
    
    if (newSelection.length === 2) {
      const interaction = findInteraction(newSelection);
      setCurrentInteraction(interaction);
    } else {
      setCurrentInteraction(null);
    }
  };

  const findInteraction = (classes: string[]): Interaction | null => {
    return interactions.find(interaction => 
      interaction.classes.length === classes.length &&
      interaction.classes.every(cls => classes.includes(cls))
    ) || {
      classes,
      type: 'possivel',
      recommendation: 'Combinação não amplamente estudada - usar com cautela.',
      alternative: 'Considere usar combinações de primeira linha com mais evidências.'
    };
  };

  const resetSelection = () => {
    setSelectedClasses([]);
    setCurrentInteraction(null);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'preferencial':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'nao-recomendada':
        return <AlertTriangle className="text-red-600" size={20} />;
      default:
        return <Info className="text-yellow-600" size={20} />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'preferencial':
        return 'border-green-200 bg-green-50';
      case 'nao-recomendada':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Otimização Anti-hipertensiva</h2>
        <p className="text-gray-600">Sistema interativo para otimização de combinações de medicamentos anti-hipertensivos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-red-600" size={24} />
            Diagrama Interativo de Combinações
          </CardTitle>
          <CardDescription>
            Clique em duas classes de medicamentos para verificar a compatibilidade e receber recomendações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 border-2 border-gray-200 rounded-lg bg-gray-50 mb-4">
            {/* Hexágono central representativo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-gray-300 rounded-lg rotate-45 opacity-20"></div>
            </div>
            
            {/* Classes de medicamentos */}
            {drugClasses.map((drugClass) => (
              <div
                key={drugClass.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${drugClass.position.x}%`,
                  top: `${drugClass.position.y}%`
                }}
              >
                <Button
                  variant={selectedClasses.includes(drugClass.id) ? "default" : "outline"}
                  size="sm"
                  className={`
                    ${selectedClasses.includes(drugClass.id) ? drugClass.color + ' text-white' : 'bg-white'}
                    hover:scale-105 transition-all duration-200 text-xs min-w-24 h-12
                  `}
                  onClick={() => handleClassClick(drugClass.id)}
                >
                  <div className="text-center">
                    <div className="font-semibold">{drugClass.shortName}</div>
                  </div>
                </Button>
              </div>
            ))}

            {/* Linhas de conexão para classes selecionadas */}
            {selectedClasses.length === 2 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {(() => {
                  const class1 = drugClasses.find(c => c.id === selectedClasses[0]);
                  const class2 = drugClasses.find(c => c.id === selectedClasses[1]);
                  if (!class1 || !class2) return null;
                  
                  const x1 = (class1.position.x / 100) * 100;
                  const y1 = (class1.position.y / 100) * 100;
                  const x2 = (class2.position.x / 100) * 100;
                  const y2 = (class2.position.y / 100) * 100;
                  
                  const color = currentInteraction?.type === 'preferencial' ? '#22c55e' : 
                               currentInteraction?.type === 'nao-recomendada' ? '#ef4444' : '#eab308';
                  
                  return (
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke={color}
                      strokeWidth="3"
                      strokeDasharray={currentInteraction?.type === 'nao-recomendada' ? '8,4' : 'none'}
                    />
                  );
                })()}
              </svg>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Button onClick={resetSelection} variant="outline" size="sm">
              <RotateCcw size={16} className="mr-2" />
              Limpar Seleção
            </Button>
            <div className="text-sm text-gray-600">
              Selecionadas: {selectedClasses.length}/2 classes
            </div>
          </div>

          {/* Legenda */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-green-500"></div>
              <span>Combinações preferenciais</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-500 border-dashed border border-red-500"></div>
              <span>Combinações não recomendadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-yellow-500"></div>
              <span>Combinações possíveis</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações das classes selecionadas */}
      {selectedClasses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedClasses.map(classId => {
            const drugClass = drugClasses.find(c => c.id === classId);
            if (!drugClass) return null;
            
            return (
              <Card key={classId}>
                <CardHeader>
                  <CardTitle className="text-lg">{drugClass.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Representantes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {drugClass.representatives.map(drug => (
                        <Badge key={drug} variant="secondary">{drug}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Resultado da análise */}
      {currentInteraction && (
        <Alert className={getInteractionColor(currentInteraction.type)}>
          <div className="flex items-start gap-3">
            {getInteractionIcon(currentInteraction.type)}
            <div className="flex-1">
              <h4 className="font-semibold mb-2">
                {currentInteraction.type === 'preferencial' && 'Combinação Preferencial'}
                {currentInteraction.type === 'nao-recomendada' && 'Combinação Não Recomendada'}
                {currentInteraction.type === 'possivel' && 'Combinação Possível'}
              </h4>
              <AlertDescription className="mb-3">
                {currentInteraction.recommendation}
              </AlertDescription>
              <Separator className="my-3" />
              <div>
                <h5 className="font-semibold mb-1">Recomendação:</h5>
                <p className="text-sm">{currentInteraction.alternative}</p>
              </div>
            </div>
          </div>
        </Alert>
      )}

      {/* Informações adicionais */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Diretrizes Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Primeira linha:</strong> IECA/BRA + Diurético tiazídico + Bloqueador de canal de cálcio</p>
            <p>• <strong>Evitar:</strong> IECA + BRA (risco renal), BB + Verapamil/Diltiazem (risco cardíaco)</p>
            <p>• <strong>Monitorar:</strong> Função renal, eletrólitos, frequência cardíaca</p>
            <p>• <strong>Individualizar:</strong> Considere comorbidades, idade e tolerabilidade</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AntihypertensiveOptimization;
