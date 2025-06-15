
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, AlertTriangle, CheckCircle, Info, RotateCcw, Tabs, Pill } from 'lucide-react';

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
  type: 'preferencial' | 'nao-recomendada' | 'possivel' | 'cuidado';
  recommendation: string;
  alternative: string;
}

const AntihypertensiveOptimization = () => {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [currentInteraction, setCurrentInteraction] = useState<Interaction | null>(null);
  const [viewMode, setViewMode] = useState<'classes' | 'medications'>('classes');

  const drugClasses: DrugClass[] = [
    {
      id: 'diureticos-tiazidicos',
      name: 'Diuréticos tiazídicos',
      shortName: 'Tiazídicos',
      representatives: ['Hidroclorotiazida', 'Clortalidona', 'Indapamida'],
      position: { x: 20, y: 20 },
      color: 'bg-yellow-500'
    },
    {
      id: 'diureticos-ansa',
      name: 'Diuréticos de alça',
      shortName: 'Alça',
      representatives: ['Furosemida', 'Bumetanida', 'Torasemida'],
      position: { x: 40, y: 20 },
      color: 'bg-yellow-600'
    },
    {
      id: 'diureticos-poupadores',
      name: 'Diuréticos poupadores de K+',
      shortName: 'Poup. K+',
      representatives: ['Espironolactona', 'Amilorida', 'Eplerenona'],
      position: { x: 60, y: 20 },
      color: 'bg-yellow-400'
    },
    {
      id: 'betabloqueadores',
      name: 'Betabloqueadores',
      shortName: 'BB',
      representatives: ['Propranolol', 'Metoprolol', 'Atenolol', 'Carvedilol', 'Bisoprolol'],
      position: { x: 80, y: 20 },
      color: 'bg-blue-500'
    },
    {
      id: 'bra',
      name: 'Bloqueadores dos receptores da angiotensina',
      shortName: 'BRA',
      representatives: ['Losartana', 'Valsartana', 'Telmisartana', 'Irbesartana'],
      position: { x: 20, y: 40 },
      color: 'bg-green-500'
    },
    {
      id: 'ieca',
      name: 'Inibidores da ECA',
      shortName: 'IECA',
      representatives: ['Enalapril', 'Captopril', 'Lisinopril', 'Ramipril'],
      position: { x: 40, y: 40 },
      color: 'bg-purple-500'
    },
    {
      id: 'bcc-dihidropiridinas',
      name: 'BCC Dihidropiridínicos',
      shortName: 'BCC-DHP',
      representatives: ['Amlodipina', 'Nifedipina', 'Felodipina', 'Lercanidipina'],
      position: { x: 60, y: 40 },
      color: 'bg-red-500'
    },
    {
      id: 'bcc-nao-dihidropiridinas',
      name: 'BCC Não-Dihidropiridínicos',
      shortName: 'BCC-NDHP',
      representatives: ['Verapamil', 'Diltiazem'],
      position: { x: 80, y: 40 },
      color: 'bg-red-600'
    },
    {
      id: 'alfabloqueadores',
      name: 'Alfabloqueadores',
      shortName: 'Alfa-Bloq',
      representatives: ['Doxazosina', 'Prazosina', 'Terazosina'],
      position: { x: 20, y: 60 },
      color: 'bg-orange-500'
    },
    {
      id: 'acao-central',
      name: 'Ação Central',
      shortName: 'Centrais',
      representatives: ['Clonidina', 'Metildopa', 'Moxonidina'],
      position: { x: 40, y: 60 },
      color: 'bg-gray-600'
    },
    {
      id: 'vasodilatadores',
      name: 'Vasodilatadores diretos',
      shortName: 'Vasodil.',
      representatives: ['Hidralazina', 'Minoxidil'],
      position: { x: 60, y: 60 },
      color: 'bg-pink-500'
    },
    {
      id: 'inibidores-renina',
      name: 'Inibidores da renina',
      shortName: 'I-Renina',
      representatives: ['Alisquireno'],
      position: { x: 80, y: 60 },
      color: 'bg-teal-500'
    }
  ];

  // Todos os medicamentos organizados por classe
  const allMedications = drugClasses.reduce((acc, drugClass) => {
    drugClass.representatives.forEach(med => {
      acc[med] = drugClass.id;
    });
    return acc;
  }, {} as Record<string, string>);

  const interactions: Interaction[] = [
    // Combinações PREFERENCIAIS (Primeira linha)
    {
      classes: ['diureticos-tiazidicos', 'ieca'],
      type: 'preferencial',
      recommendation: 'Combinação de primeira linha - excelente sinergia terapêutica e proteção cardiovascular.',
      alternative: 'Manter esta combinação. É considerada padrão-ouro para hipertensão essencial.'
    },
    {
      classes: ['diureticos-tiazidicos', 'bra'],
      type: 'preferencial',
      recommendation: 'Combinação de primeira linha - boa tolerabilidade, menor incidência de tosse.',
      alternative: 'Excelente escolha para pacientes que não toleram IECA.'
    },
    {
      classes: ['bcc-dihidropiridinas', 'ieca'],
      type: 'preferencial',
      recommendation: 'Combinação de primeira linha - proteção cardiovascular e renal.',
      alternative: 'Ideal para pacientes com risco cardiovascular aumentado ou diabéticos.'
    },
    {
      classes: ['bcc-dihidropiridinas', 'bra'],
      type: 'preferencial',
      recommendation: 'Combinação de primeira linha - boa eficácia e tolerabilidade.',
      alternative: 'Especialmente adequada para idosos e pacientes diabéticos.'
    },
    {
      classes: ['diureticos-tiazidicos', 'bcc-dihidropiridinas'],
      type: 'preferencial',
      recommendation: 'Combinação de primeira linha - complementaridade de mecanismos.',
      alternative: 'Boa opção quando IECA/BRA não são tolerados.'
    },
    {
      classes: ['betabloqueadores', 'diureticos-tiazidicos'],
      type: 'possivel',
      recommendation: 'Combinação possível, mas atenção aos efeitos metabólicos (glicemia, lipídios).',
      alternative: 'Monitore glicemia e perfil lipídico. Prefira IECA/BRA + diurético se possível.'
    },
    {
      classes: ['betabloqueadores', 'bcc-dihidropiridinas'],
      type: 'possivel',
      recommendation: 'Combinação aceitável com BCC dihidropiridínicos (amlodipina, nifedipina).',
      alternative: 'Evite verapamil/diltiazem. Prefira amlodipina com betabloqueadores.'
    },
    {
      classes: ['diureticos-poupadores', 'ieca'],
      type: 'possivel',
      recommendation: 'Combinação útil em ICC, mas monitore potássio rigorosamente.',
      alternative: 'Ideal para insuficiência cardíaca. Controle K+ sérico regularmente.'
    },
    {
      classes: ['diureticos-poupadores', 'bra'],
      type: 'possivel',
      recommendation: 'Combinação com risco de hipercalemia - monitoração intensiva necessária.',
      alternative: 'Use apenas se estritamente necessário. Monitore função renal e K+.'
    },
    {
      classes: ['alfabloqueadores', 'diureticos-tiazidicos'],
      type: 'possivel',
      recommendation: 'Combinação de segunda linha para hiperplasia prostática benigna.',
      alternative: 'Útil em homens com HAS e sintomas prostáticos.'
    },
    {
      classes: ['diureticos-ansa', 'ieca'],
      type: 'possivel',
      recommendation: 'Combinação para ICC com sobrecarga hídrica.',
      alternative: 'Reservado para insuficiência cardíaca descompensada.'
    },
    {
      classes: ['diureticos-tiazidicos', 'diureticos-ansa'],
      type: 'cuidado',
      recommendation: 'Dupla diurese - risco de desidratação e distúrbios eletrolíticos.',
      alternative: 'Use apenas em casos específicos (ICC grave). Monitore função renal e eletrólitos.'
    },
    {
      classes: ['betabloqueadores', 'acao-central'],
      type: 'cuidado',
      recommendation: 'Risco de bradicardia excessiva e hipotensão.',
      alternative: 'Monitore FC e PA. Considere reduzir doses ou trocar por outras classes.'
    },
    {
      classes: ['vasodilatadores', 'betabloqueadores'],
      type: 'cuidado',
      recommendation: 'Hidralazina pode causar taquicardia reflexa - BB pode ser protetor.',
      alternative: 'Combinação específica para casos refratários. Inicie BB antes.'
    },
    {
      classes: ['ieca', 'bra'],
      type: 'nao-recomendada',
      recommendation: 'CONTRAINDICADO - Duplo bloqueio do SRAA aumenta risco de hipercalemia e injúria renal.',
      alternative: 'NUNCA combine. Use IECA + BCC dihidropiridínico ou IECA + diurético tiazídico.'
    },
    {
      classes: ['betabloqueadores', 'bcc-nao-dihidropiridinas'],
      type: 'nao-recomendada',
      recommendation: 'CONTRAINDICADO - Verapamil/Diltiazem + BB causam bloqueio cardíaco grave.',
      alternative: 'Substitua por: BB + BCC dihidropiridínico (amlodipina) ou IECA + BCC.'
    },
    {
      classes: ['diureticos-poupadores', 'inibidores-renina'],
      type: 'nao-recomendada',
      recommendation: 'Alto risco de hipercalemia grave.',
      alternative: 'Evite esta combinação. Use diurético tiazídico + inibidor da renina.'
    },
    {
      classes: ['acao-central', 'alfabloqueadores'],
      type: 'nao-recomendada',
      recommendation: 'Risco de hipotensão ortostática grave, especialmente em idosos.',
      alternative: 'Evite. Prefira IECA/BRA + diurético ou BCC.'
    },
    {
      classes: ['diureticos-tiazidicos', 'ieca', 'bcc-dihidropiridinas'],
      type: 'preferencial',
      recommendation: 'TRIPLA TERAPIA IDEAL - Combinação padrão-ouro para casos que não respondem à dupla terapia.',
      alternative: 'Esta é a melhor combinação para tripla terapia. Mantenha as três classes.'
    },
    {
      classes: ['diureticos-tiazidicos', 'ieca', 'bcc-dihidropiridinas', 'diureticos-poupadores'],
      type: 'possivel',
      recommendation: 'QUÁDRUPLA TERAPIA PARA HIPERTENSÃO RESISTENTE - Use apenas em casos refratários com monitoração intensiva.',
      alternative: 'Esta combinação é reservada para hipertensão resistente verdadeira. Monitore função renal, K+ e PA rigorosamente.'
    },
    {
      classes: ['diureticos-tiazidicos', 'bra', 'bcc-dihidropiridinas', 'alfabloqueadores'],
      type: 'possivel',
      recommendation: 'QUÁDRUPLA TERAPIA com alfabloqueador - Útil em homens com HAS resistente e sintomas prostáticos.',
      alternative: 'Monitorize hipotensão ortostática. Considere substituir alfabloqueador por espironolactona se não há indicação prostática.'
    }
  ];

  const handleClassClick = (classId: string) => {
    if (viewMode !== 'classes') return;
    
    let newSelection: string[];
    
    if (selectedClasses.includes(classId)) {
      newSelection = selectedClasses.filter(id => id !== classId);
    } else if (selectedClasses.length < 4) {
      newSelection = [...selectedClasses, classId];
    } else {
      newSelection = [...selectedClasses.slice(1), classId];
    }
    
    setSelectedClasses(newSelection);
    
    if (newSelection.length >= 2) {
      const interaction = findInteraction(newSelection);
      setCurrentInteraction(interaction);
    } else {
      setCurrentInteraction(null);
    }
  };

  const handleMedicationSelect = (medication: string) => {
    if (selectedMedications.includes(medication)) {
      return; // Não permitir selecionar o mesmo medicamento
    }
    
    let newSelection: string[];
    if (selectedMedications.length < 4) {
      newSelection = [...selectedMedications, medication];
    } else {
      newSelection = [...selectedMedications.slice(1), medication];
    }
    
    setSelectedMedications(newSelection);
    
    if (newSelection.length >= 2) {
      // Converter medicamentos para classes e analisar
      const medicationClasses = newSelection.map(med => allMedications[med]).filter(Boolean);
      const uniqueClasses = [...new Set(medicationClasses)];
      
      if (uniqueClasses.length >= 2) {
        const interaction = findInteraction(uniqueClasses);
        setCurrentInteraction(interaction);
      }
    } else {
      setCurrentInteraction(null);
    }
  };

  const removeMedication = (medication: string) => {
    const newSelection = selectedMedications.filter(med => med !== medication);
    setSelectedMedications(newSelection);
    
    if (newSelection.length >= 2) {
      const medicationClasses = newSelection.map(med => allMedications[med]).filter(Boolean);
      const uniqueClasses = [...new Set(medicationClasses)];
      
      if (uniqueClasses.length >= 2) {
        const interaction = findInteraction(uniqueClasses);
        setCurrentInteraction(interaction);
      } else {
        setCurrentInteraction(null);
      }
    } else {
      setCurrentInteraction(null);
    }
  };

  const findInteraction = (classes: string[]): Interaction | null => {
    // Procura por combinação exata
    let interaction = interactions.find(int => 
      int.classes.length === classes.length &&
      int.classes.every(cls => classes.includes(cls))
    );

    if (!interaction && classes.length > 2) {
      for (let i = 0; i < classes.length; i++) {
        for (let j = i + 1; j < classes.length; j++) {
          const pairInteraction = interactions.find(int =>
            int.type === 'nao-recomendada' &&
            int.classes.length === 2 &&
            int.classes.includes(classes[i]) &&
            int.classes.includes(classes[j])
          );
          if (pairInteraction) {
            return {
              classes,
              type: 'nao-recomendada',
              recommendation: `Combinação contém par problemático: ${getDrugClassName(classes[i])} + ${getDrugClassName(classes[j])}. ${pairInteraction.recommendation}`,
              alternative: pairInteraction.alternative
            };
          }
        }
      }

      if (classes.length === 4) {
        return {
          classes,
          type: 'cuidado',
          recommendation: 'QUÁDRUPLA TERAPIA - Reservada para hipertensão resistente verdadeira. Requer investigação de causas secundárias e monitoração intensiva.',
          alternative: 'Confirme adesão, causas secundárias e técnica de medição da PA. Considere consulta com especialista em hipertensão.'
        };
      } else if (classes.length === 3) {
        const standardTriple = ['diureticos-tiazidicos', 'ieca', 'bcc-dihidropiridinas'].every(cls => classes.includes(cls)) ||
                              ['diureticos-tiazidicos', 'bra', 'bcc-dihidropiridinas'].every(cls => classes.includes(cls));
        
        if (standardTriple) {
          return {
            classes,
            type: 'preferencial',
            recommendation: 'TRIPLA TERAPIA PADRÃO - Combinação ideal para casos que não respondem à dupla terapia.',
            alternative: 'Esta é a melhor combinação para tripla terapia. Ajuste doses antes de adicionar 4ª classe.'
          };
        } else {
          return {
            classes,
            type: 'possivel',
            recommendation: 'Tripla terapia não padronizada - considere ajustar para combinação padrão.',
            alternative: 'Prefira: Tiazídico + IECA/BRA + BCC dihidropiridínico como tripla terapia padrão.'
          };
        }
      }

      return {
        classes,
        type: 'cuidado',
        recommendation: 'Combinação múltipla - requer monitoração intensiva de efeitos adversos e interações.',
        alternative: 'Considere simplificar o esquema. Avalie se tripla terapia padrão (Tiazídico + IECA/BRA + BCC-DHP) não seria mais apropriada.'
      };
    }

    if (!interaction && classes.length === 2) {
      return {
        classes,
        type: 'possivel',
        recommendation: 'Combinação não amplamente estudada - usar com cautela e monitoração.',
        alternative: 'Considere usar combinações de primeira linha com mais evidências clínicas.'
      };
    }

    return interaction;
  };

  const getDrugClassName = (classId: string): string => {
    return drugClasses.find(cls => cls.id === classId)?.shortName || classId;
  };

  const resetSelection = () => {
    setSelectedClasses([]);
    setSelectedMedications([]);
    setCurrentInteraction(null);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'preferencial':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'nao-recomendada':
        return <AlertTriangle className="text-red-600" size={20} />;
      case 'cuidado':
        return <AlertTriangle className="text-orange-600" size={20} />;
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
      case 'cuidado':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getInteractionTitle = (type: string) => {
    switch (type) {
      case 'preferencial':
        return 'Combinação Preferencial ✅';
      case 'nao-recomendada':
        return 'Combinação NÃO Recomendada ⛔';
      case 'cuidado':
        return 'Combinação com Cuidado ⚠️';
      default:
        return 'Combinação Possível ℹ️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Otimização Anti-hipertensiva</h2>
        <p className="text-gray-600">Sistema interativo para otimização de combinações de medicamentos anti-hipertensivos</p>
      </div>

      {/* Seletor de modo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tabs className="text-blue-600" size={24} />
            Modo de Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button
              variant={viewMode === 'classes' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('classes');
                setSelectedMedications([]);
                setCurrentInteraction(null);
              }}
              className="flex items-center gap-2"
            >
              <Heart size={16} />
              Por Classes
            </Button>
            <Button
              variant={viewMode === 'medications' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('medications');
                setSelectedClasses([]);
                setCurrentInteraction(null);
              }}
              className="flex items-center gap-2"
            >
              <Pill size={16} />
              Por Medicamentos
            </Button>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'classes' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="text-red-600" size={24} />
              Diagrama de Classes Terapêuticas
            </CardTitle>
            <CardDescription>
              Clique em até 4 classes de medicamentos para verificar a compatibilidade e receber recomendações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-80 border-2 border-gray-200 rounded-lg bg-gray-50 mb-4">
              {/* Grid organizado de classes */}
              <div className="grid grid-cols-4 gap-4 p-6 h-full">
                {drugClasses.map((drugClass) => (
                  <div
                    key={drugClass.id}
                    className="flex items-center justify-center"
                  >
                    <Button
                      variant={selectedClasses.includes(drugClass.id) ? "default" : "outline"}
                      size="sm"
                      className={`
                        ${selectedClasses.includes(drugClass.id) ? drugClass.color + ' text-white' : 'bg-white'}
                        hover:scale-105 transition-all duration-200 text-xs w-full h-16 p-2
                      `}
                      onClick={() => handleClassClick(drugClass.id)}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-[10px] leading-tight">{drugClass.shortName}</div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Linhas de conexão para classes selecionadas */}
              {selectedClasses.length >= 2 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {selectedClasses.map((classId, index) => {
                    if (index === 0) return null;
                    
                    const currentIndex = drugClasses.findIndex(c => c.id === classId);
                    const prevIndex = drugClasses.findIndex(c => c.id === selectedClasses[index - 1]);
                    
                    if (currentIndex === -1 || prevIndex === -1) return null;
                    
                    const currentRow = Math.floor(currentIndex / 4);
                    const currentCol = currentIndex % 4;
                    const prevRow = Math.floor(prevIndex / 4);
                    const prevCol = prevIndex % 4;
                    
                    const x1 = (prevCol * 25) + 12.5;
                    const y1 = (prevRow * 33.33) + 16.67;
                    const x2 = (currentCol * 25) + 12.5;
                    const y2 = (currentRow * 33.33) + 16.67;
                    
                    const color = currentInteraction?.type === 'preferencial' ? '#22c55e' : 
                                 currentInteraction?.type === 'nao-recomendada' ? '#ef4444' : 
                                 currentInteraction?.type === 'cuidado' ? '#f97316' : '#eab308';
                    
                    return (
                      <line
                        key={`${classId}-${index}`}
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray={currentInteraction?.type === 'nao-recomendada' ? '8,4' : 'none'}
                      />
                    );
                  })}
                </svg>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Button onClick={resetSelection} variant="outline" size="sm">
                <RotateCcw size={16} className="mr-2" />
                Limpar Seleção
              </Button>
              <div className="text-sm text-gray-600">
                Selecionadas: {selectedClasses.length}/4 classes
              </div>
            </div>

            {/* Legenda */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-500"></div>
                <span>Preferenciais</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-yellow-500"></div>
                <span>Possíveis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-orange-500"></div>
                <span>Com cuidado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-red-500 border-dashed border border-red-500"></div>
                <span>Não recomendadas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="text-blue-600" size={24} />
              Seleção por Medicamentos Específicos
            </CardTitle>
            <CardDescription>
              Selecione até 4 medicamentos específicos para análise de compatibilidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="space-y-2">
                  <label className="text-sm font-medium">Medicamento {num}:</label>
                  <Select
                    value={selectedMedications[num - 1] || ''}
                    onValueChange={(value) => {
                      if (value && !selectedMedications.includes(value)) {
                        const newSelection = [...selectedMedications];
                        newSelection[num - 1] = value;
                        setSelectedMedications(newSelection.filter(Boolean));
                        handleMedicationSelect(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um medicamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50 max-h-60">
                      {drugClasses.map((drugClass) => (
                        <div key={drugClass.id}>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                            {drugClass.name}
                          </div>
                          {drugClass.representatives.map((med) => (
                            <SelectItem 
                              key={med} 
                              value={med}
                              disabled={selectedMedications.includes(med)}
                            >
                              {med}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {selectedMedications.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Medicamentos Selecionados:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMedications.map((med) => (
                    <Badge 
                      key={med} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeMedication(med)}
                    >
                      {med} ✕
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button onClick={resetSelection} variant="outline" size="sm">
                <RotateCcw size={16} className="mr-2" />
                Limpar Seleção
              </Button>
              <div className="text-sm text-gray-600">
                Selecionados: {selectedMedications.length}/4 medicamentos
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações das classes/medicamentos selecionados */}
      {(selectedClasses.length > 0 || selectedMedications.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {viewMode === 'classes' 
            ? selectedClasses.map(classId => {
                const drugClass = drugClasses.find(c => c.id === classId);
                if (!drugClass) return null;
                
                return (
                  <Card key={classId}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{drugClass.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Representantes:</h4>
                        <div className="flex flex-wrap gap-1">
                          {drugClass.representatives.map(drug => (
                            <Badge key={drug} variant="secondary" className="text-xs">{drug}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            : selectedMedications.map(medication => {
                const classId = allMedications[medication];
                const drugClass = drugClasses.find(c => c.id === classId);
                if (!drugClass) return null;
                
                return (
                  <Card key={medication}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{medication}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Classe:</h4>
                        <Badge variant="outline" className="text-xs">{drugClass.shortName}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          }
        </div>
      )}

      {/* Resultado da análise */}
      {currentInteraction && (
        <Alert className={getInteractionColor(currentInteraction.type)}>
          <div className="flex items-start gap-3">
            {getInteractionIcon(currentInteraction.type)}
            <div className="flex-1">
              <h4 className="font-semibold mb-2">
                {getInteractionTitle(currentInteraction.type)}
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
          <CardTitle className="text-blue-900">Diretrizes de Combinação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>1ª linha (dupla):</strong> IECA/BRA + Tiazídico OU IECA/BRA + BCC-DHP OU Tiazídico + BCC-DHP</p>
            <p>• <strong>1ª linha (tripla):</strong> IECA/BRA + Tiazídico + BCC dihidropiridínico</p>
            <p>• <strong>Quádrupla terapia:</strong> Reservada para hipertensão resistente verdadeira após investigação</p>
            <p>• <strong>EVITAR:</strong> IECA + BRA, BB + Verapamil/Diltiazem, dupla diurese</p>
            <p>• <strong>Monitorar:</strong> Função renal, K+, Na+, frequência cardíaca, pressão arterial</p>
            <p>• <strong>Individualizar:</strong> Considere idade, comorbidades, efeitos adversos e aderência</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AntihypertensiveOptimization;
