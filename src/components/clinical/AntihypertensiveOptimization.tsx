import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, AlertTriangle, CheckCircle, Info, RotateCcw, Settings, Pill, Activity, Target, Shield, BookOpen, Zap } from 'lucide-react';

interface DrugClass {
  id: string;
  name: string;
  shortName: string;
  representatives: string[];
  position: { x: number; y: number };
  color: string;
  mechanism: string;
  adverseEffects: string[];
  contraindications: string[];
}

interface Interaction {
  classes: string[];
  type: 'preferencial' | 'nao-recomendada' | 'possivel' | 'cuidado';
  recommendation: string;
  alternative: string;
}

interface Guideline {
  id: string;
  name: string;
  description: string;
  combinations: {
    classes: string[];
    medications: string[];
    description: string;
    evidence: string;
  }[];
}

const AntihypertensiveOptimization = () => {
  // All hooks must be called at the top level, before any conditional logic
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [currentInteraction, setCurrentInteraction] = useState<Interaction | null>(null);
  const [viewMode, setViewMode] = useState<'classes' | 'medications' | 'guidelines'>('classes');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedGuideline, setSelectedGuideline] = useState<string>('');
  const [selectedGuidelineCombination, setSelectedGuidelineCombination] = useState<number | null>(null);

  const drugClasses: DrugClass[] = [
    {
      id: 'diureticos-tiazidicos',
      name: 'Diuréticos tiazídicos',
      shortName: 'Tiazídicos',
      representatives: ['Hidroclorotiazida', 'Clortalidona', 'Indapamida'],
      position: { x: 20, y: 20 },
      color: 'bg-yellow-500',
      mechanism: 'Bloqueiam cotransportador Na⁺/Cl⁻ no túbulo contorcido distal, aumentando excreção de sódio e água',
      adverseEffects: ['Hipocalemia', 'Hiponatremia', 'Hiperglicemia', 'Hiperuricemia', 'Dislipidemia'],
      contraindications: ['Anúria', 'Insuficiência renal grave', 'Alergia a sulfonamidas']
    },
    {
      id: 'diureticos-ansa',
      name: 'Diuréticos de alça',
      shortName: 'Alça',
      representatives: ['Furosemida', 'Bumetanida', 'Torasemida'],
      position: { x: 40, y: 20 },
      color: 'bg-yellow-600',
      mechanism: 'Bloqueiam cotransportador Na⁺/K⁺/2Cl⁻ na alça de Henle, causando diurese potente',
      adverseEffects: ['Hipocalemia grave', 'Hiponatremia', 'Ototoxicidade', 'Nefrotoxicidade'],
      contraindications: ['Anúria', 'Depleção severa de eletrólitos', 'Estado comatoso hepático']
    },
    {
      id: 'diureticos-poupadores',
      name: 'Diuréticos poupadores de K+',
      shortName: 'Poup. K+',
      representatives: ['Espironolactona', 'Amilorida', 'Eplerenona'],
      position: { x: 60, y: 20 },
      color: 'bg-yellow-400',
      mechanism: 'Bloqueiam canais de sódio (amilorida) ou receptores mineralocorticoides (espironolactona)',
      adverseEffects: ['Hipercalemia', 'Ginecomastia (espironolactona)', 'Disfunção erétil'],
      contraindications: ['Hipercalemia', 'Insuficiência renal severa', 'Doença de Addison']
    },
    {
      id: 'betabloqueadores',
      name: 'Betabloqueadores',
      shortName: 'BB',
      representatives: ['Propranolol', 'Metoprolol', 'Atenolol', 'Carvedilol', 'Bisoprolol'],
      position: { x: 80, y: 20 },
      color: 'bg-blue-500',
      mechanism: 'Bloqueiam receptores β-adrenérgicos, reduzindo frequência cardíaca e contractilidade',
      adverseEffects: ['Bradicardia', 'Broncoespasmo', 'Fadiga', 'Disfunção erétil', 'Mascaramento de hipoglicemia'],
      contraindications: ['Asma', 'DPOC grave', 'Bloqueio AV', 'ICC descompensada', 'Bradicardia severa']
    },
    {
      id: 'bra',
      name: 'Bloqueadores dos receptores da angiotensina',
      shortName: 'BRA',
      representatives: ['Losartana', 'Valsartana', 'Telmisartana', 'Irbesartana'],
      position: { x: 20, y: 40 },
      color: 'bg-green-500',
      mechanism: 'Bloqueiam receptores AT1 da angiotensina II, causando vasodilatação',
      adverseEffects: ['Hipercalemia', 'Hipotensão', 'Angioedema (raro)', 'Tosse (rara)'],
      contraindications: ['Estenose bilateral da artéria renal', 'Gravidez', 'Angioedema prévio']
    },
    {
      id: 'ieca',
      name: 'Inibidores da ECA',
      shortName: 'IECA',
      representatives: ['Enalapril', 'Captopril', 'Lisinopril', 'Ramipril'],
      position: { x: 40, y: 40 },
      color: 'bg-purple-500',
      mechanism: 'Inibem enzima conversora de angiotensina, reduzindo formação de angiotensina II',
      adverseEffects: ['Tosse seca (10-15%)', 'Hipercalemia', 'Angioedema', 'Disgeusia'],
      contraindications: ['Angioedema prévio', 'Estenose bilateral da artéria renal', 'Gravidez']
    },
    {
      id: 'bcc-dihidropiridinas',
      name: 'BCC Dihidropiridínicos',
      shortName: 'BCC-DHP',
      representatives: ['Amlodipina', 'Nifedipina', 'Felodipina', 'Lercanidipina'],
      position: { x: 60, y: 40 },
      color: 'bg-red-500',
      mechanism: 'Bloqueiam canais de cálcio tipo L, causando vasodilatação arteriolar',
      adverseEffects: ['Edema periférico', 'Rubor facial', 'Taquicardia reflexa', 'Cefaleia'],
      contraindications: ['Choque cardiogênico', 'Estenose aórtica severa', 'Hipotensão']
    },
    {
      id: 'bcc-nao-dihidropiridinas',
      name: 'BCC Não-Dihidropiridínicos',
      shortName: 'BCC-NDHP',
      representatives: ['Verapamil', 'Diltiazem'],
      position: { x: 80, y: 40 },
      color: 'bg-red-600',
      mechanism: 'Bloqueiam canais de cálcio, com efeito cronotrópico e inotrópico negativo',
      adverseEffects: ['Bradicardia', 'Bloqueio AV', 'Constipação', 'Depressão miocárdica'],
      contraindications: ['Síndrome do nó sinusal', 'Bloqueio AV 2º/3º grau', 'ICC severa']
    },
    {
      id: 'alfabloqueadores',
      name: 'Alfabloqueadores',
      shortName: 'Alfa-Bloq',
      representatives: ['Doxazosina', 'Prazosina', 'Terazosina'],
      position: { x: 20, y: 60 },
      color: 'bg-orange-500',
      mechanism: 'Bloqueiam receptores α1-adrenérgicos, causando vasodilatação',
      adverseEffects: ['Hipotensão ortostática', 'Tontura', 'Edema', 'Taquicardia reflexa'],
      contraindications: ['Hipotensão ortostática', 'Sincope de causa desconhecida']
    },
    {
      id: 'acao-central',
      name: 'Ação Central',
      shortName: 'Centrais',
      representatives: ['Clonidina', 'Metildopa', 'Moxonidina'],
      position: { x: 40, y: 60 },
      color: 'bg-gray-600',
      mechanism: 'Ativam receptores α2 centrais ou reduzem atividade simpática central',
      adverseEffects: ['Sedação', 'Boca seca', 'Fadiga', 'Depressão', 'Efeito rebote'],
      contraindications: ['Depressão severa', 'Doença cerebrovascular ativa']
    },
    {
      id: 'vasodilatadores',
      name: 'Vasodilatadores diretos',
      shortName: 'Vasodil.',
      representatives: ['Hidralazina', 'Minoxidil'],
      position: { x: 60, y: 60 },
      color: 'bg-pink-500',
      mechanism: 'Relaxamento direto da musculatura lisa vascular',
      adverseEffects: ['Taquicardia reflexa', 'Retenção hídrica', 'Síndrome lúpus-like (hidralazina)'],
      contraindications: ['Doença coronariana', 'Aneurisma aórtico', 'Mitral valve regurgitation']
    },
    {
      id: 'inibidores-renina',
      name: 'Inibidores da renina',
      shortName: 'I-Renina',
      representatives: ['Alisquireno'],
      position: { x: 80, y: 60 },
      color: 'bg-teal-500',
      mechanism: 'Inibem diretamente a renina, bloqueando formação de angiotensina I',
      adverseEffects: ['Diarreia', 'Hipercalemia', 'Angioedema', 'Tosse'],
      contraindications: ['Gravidez', 'Combinação com IECA/BRA em diabéticos']
    }
  ];

  const guidelines: Guideline[] = [
    {
      id: 'aha-acc-2017',
      name: 'AHA/ACC 2017',
      description: 'Diretrizes da American Heart Association e American College of Cardiology',
      combinations: [
        {
          classes: ['diureticos-tiazidicos', 'ieca'],
          medications: ['Clortalidona', 'Lisinopril'],
          description: 'Combinação de primeira linha para maioria dos pacientes',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['diureticos-tiazidicos', 'bra'],
          medications: ['Clortalidona', 'Losartana'],
          description: 'Alternativa quando IECA não é tolerado',
          evidence: 'Classe I, Nível de Evidência B'
        },
        {
          classes: ['bcc-dihidropiridinas', 'ieca'],
          medications: ['Amlodipina', 'Lisinopril'],
          description: 'Excelente para pacientes com doença coronariana',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['diureticos-tiazidicos', 'ieca', 'bcc-dihidropiridinas'],
          medications: ['Clortalidona', 'Lisinopril', 'Amlodipina'],
          description: 'Tripla terapia padrão-ouro',
          evidence: 'Classe I, Nível de Evidência A'
        }
      ]
    },
    {
      id: 'esc-esh-2018',
      name: 'ESC/ESH 2018',
      description: 'Diretrizes da European Society of Cardiology e European Society of Hypertension',
      combinations: [
        {
          classes: ['ieca', 'bcc-dihidropiridinas'],
          medications: ['Enalapril', 'Amlodipina'],
          description: 'Combinação preferencial inicial',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['bra', 'bcc-dihidropiridinas'],
          medications: ['Valsartana', 'Amlodipina'],
          description: 'Alternativa com menor incidência de tosse',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['ieca', 'diureticos-tiazidicos'],
          medications: ['Enalapril', 'Indapamida'],
          description: 'Combinação clássica com evidência robusta',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['ieca', 'bcc-dihidropiridinas', 'diureticos-tiazidicos'],
          medications: ['Enalapril', 'Amlodipina', 'Indapamida'],
          description: 'Tripla terapia em dose fixa preferencial',
          evidence: 'Classe I, Nível de Evidência A'
        }
      ]
    },
    {
      id: 'sbc-2020',
      name: 'SBC 2020',
      description: 'Diretrizes da Sociedade Brasileira de Cardiologia',
      combinations: [
        {
          classes: ['diureticos-tiazidicos', 'ieca'],
          medications: ['Hidroclorotiazida', 'Enalapril'],
          description: 'Dupla terapia de escolha no Brasil',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['diureticos-tiazidicos', 'bra'],
          medications: ['Hidroclorotiazida', 'Losartana'],
          description: 'Alternativa nacional bem estabelecida',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['bcc-dihidropiridinas', 'ieca'],
          medications: ['Anlodipino', 'Enalapril'],
          description: 'Boa opção para idosos brasileiros',
          evidence: 'Classe IIa, Nível de Evidência B'
        },
        {
          classes: ['diureticos-tiazidicos', 'ieca', 'bcc-dihidropiridinas'],
          medications: ['Hidroclorotiazida', 'Enalapril', 'Anlodipino'],
          description: 'Tripla terapia adaptada ao perfil brasileiro',
          evidence: 'Classe I, Nível de Evidência B'
        }
      ]
    },
    {
      id: 'resistente',
      name: 'Hipertensão Resistente',
      description: 'Abordagem para hipertensão resistente verdadeira',
      combinations: [
        {
          classes: ['diureticos-tiazidicos', 'ieca', 'bcc-dihidropiridinas', 'diureticos-poupadores'],
          medications: ['Clortalidona', 'Lisinopril', 'Amlodipina', 'Espironolactona'],
          description: 'Quádrupla terapia com espironolactona',
          evidence: 'Classe I, Nível de Evidência B'
        },
        {
          classes: ['diureticos-tiazidicos', 'bra', 'bcc-dihidropiridinas', 'alfabloqueadores'],
          medications: ['Indapamida', 'Telmisartana', 'Amlodipina', 'Doxazosina'],
          description: 'Alternativa com alfabloqueador para hiperplasia prostática',
          evidence: 'Classe IIa, Nível de Evidência C'
        },
        {
          classes: ['diureticos-ansa', 'ieca', 'bcc-dihidropiridinas', 'betabloqueadores'],
          medications: ['Furosemida', 'Ramipril', 'Amlodipina', 'Carvedilol'],
          description: 'Para pacientes com insuficiência cardíaca associada',
          evidence: 'Classe IIa, Nível de Evidência B'
        }
      ]
    },
    {
      id: 'diabetes',
      name: 'Diabetes Mellitus',
      description: 'Combinações específicas para pacientes diabéticos',
      combinations: [
        {
          classes: ['ieca', 'diureticos-tiazidicos'],
          medications: ['Ramipril', 'Indapamida'],
          description: 'Proteção renal e cardiovascular em diabéticos',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['bra', 'bcc-dihidropiridinas'],
          medications: ['Irbesartana', 'Amlodipina'],
          description: 'Alternativa com menor risco metabólico',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['ieca', 'bcc-dihidropiridinas', 'diureticos-poupadores'],
          medications: ['Enalapril', 'Amlodipina', 'Espironolactona'],
          description: 'Tripla terapia para diabéticos com microalbuminúria',
          evidence: 'Classe IIa, Nível de Evidência B'
        }
      ]
    },
    {
      id: 'idosos',
      name: 'Pacientes Idosos',
      description: 'Abordagem específica para pacientes ≥65 anos',
      combinations: [
        {
          classes: ['diureticos-tiazidicos', 'bcc-dihidropiridinas'],
          medications: ['Indapamida', 'Amlodipina'],
          description: 'Combinação bem tolerada em idosos',
          evidence: 'Classe I, Nível de Evidência A'
        },
        {
          classes: ['bra', 'diureticos-tiazidicos'],
          medications: ['Telmisartana', 'Indapamida'],
          description: 'Menor risco de tosse e angioedema',
          evidence: 'Classe I, Nível de Evidência B'
        },
        {
          classes: ['bcc-dihidropiridinas', 'ieca'],
          medications: ['Lercanidipina', 'Enalapril'],
          description: 'BCC de longa ação para idosos',
          evidence: 'Classe IIa, Nível de Evidência B'
        }
      ]
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
    // Only process if in classes mode
    if (viewMode !== 'classes') {
      return;
    }
    
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

  const handleGuidelineSelect = (guidelineId: string) => {
    setSelectedGuideline(guidelineId);
    setSelectedGuidelineCombination(null);
    setSelectedClasses([]);
    setSelectedMedications([]);
    setCurrentInteraction(null);
  };

  const handleGuidelineCombinationSelect = (combinationIndex: number) => {
    const guideline = guidelines.find(g => g.id === selectedGuideline);
    if (!guideline) return;
    
    const combination = guideline.combinations[combinationIndex];
    setSelectedGuidelineCombination(combinationIndex);
    setSelectedClasses(combination.classes);
    setSelectedMedications(combination.medications);
    
    // Analisar a combinação
    const interaction = findInteraction(combination.classes);
    setCurrentInteraction(interaction);
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
    setSelectedGuideline('');
    setSelectedGuidelineCombination(null);
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
            <Settings className="text-blue-600" size={24} />
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
                setSelectedGuideline('');
                setSelectedGuidelineCombination(null);
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
                setSelectedGuideline('');
                setSelectedGuidelineCombination(null);
                setCurrentInteraction(null);
              }}
              className="flex items-center gap-2"
            >
              <Pill size={16} />
              Por Medicamentos
            </Button>
            <Button
              variant={viewMode === 'guidelines' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('guidelines');
                setSelectedClasses([]);
                setSelectedMedications([]);
                setCurrentInteraction(null);
              }}
              className="flex items-center gap-2"
            >
              <BookOpen size={16} />
              Por Diretrizes
            </Button>
            <Button
              variant={showDetails ? 'default' : 'outline'}
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2"
            >
              <Activity size={16} />
              {showDetails ? 'Ocultar' : 'Mostrar'} Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modo de Diretrizes */}
      {viewMode === 'guidelines' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="text-purple-600" size={24} />
              Seleção por Diretrizes Clínicas
            </CardTitle>
            <CardDescription>
              Escolha uma diretriz específica e o sistema mostrará as combinações recomendadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecione a Diretriz:</label>
              <Select value={selectedGuideline} onValueChange={handleGuidelineSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma diretriz" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {guidelines.map((guideline) => (
                    <SelectItem key={guideline.id} value={guideline.id}>
                      {guideline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedGuideline && (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    {guidelines.find(g => g.id === selectedGuideline)?.name}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {guidelines.find(g => g.id === selectedGuideline)?.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Combinações Recomendadas:</label>
                  <div className="grid gap-3">
                    {guidelines.find(g => g.id === selectedGuideline)?.combinations.map((combination, index) => (
                      <Card 
                        key={index} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedGuidelineCombination === index ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => handleGuidelineCombinationSelect(index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm">
                              {combination.classes.map(classId => 
                                getDrugClassName(classId)
                              ).join(' + ')}
                            </h5>
                            <Badge variant="outline" className="text-xs">
                              {combination.evidence}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{combination.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {combination.medications.map(med => (
                              <Badge key={med} variant="secondary" className="text-xs">
                                {med}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
      ) : viewMode === 'medications' ? (
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
      ) : null}

      {/* Informações detalhadas das classes (quando showDetails está ativo) */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-purple-600" size={24} />
              Informações Detalhadas das Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {drugClasses.map((drugClass) => (
                <div key={drugClass.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-4 h-4 rounded ${drugClass.color}`}></div>
                    <h4 className="font-semibold">{drugClass.name}</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2 flex items-center gap-1">
                        <Activity size={14} />
                        Mecanismo de Ação:
                      </h5>
                      <p className="text-gray-700">{drugClass.mechanism}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-2 flex items-center gap-1">
                        <AlertTriangle size={14} />
                        Efeitos Adversos:
                      </h5>
                      <ul className="list-disc list-inside text-gray-700">
                        {drugClass.adverseEffects.map((effect, index) => (
                          <li key={index}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-2 flex items-center gap-1">
                        <Shield size={14} />
                        Contraindicações:
                      </h5>
                      <ul className="list-disc list-inside text-gray-700">
                        {drugClass.contraindications.map((contraindication, index) => (
                          <li key={index}>{contraindication}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="font-semibold mb-2">Representantes:</h5>
                    <div className="flex flex-wrap gap-1">
                      {drugClass.representatives.map(drug => (
                        <Badge key={drug} variant="outline" className="text-xs">{drug}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações das classes/medicamentos selecionados */}
      {(selectedClasses.length > 0 || selectedMedications.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {viewMode === 'classes' || viewMode === 'guidelines'
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

      {/* Nova seção: Considerações Especiais */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <Shield size={20} />
            Considerações Especiais por População
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-800">
            <div>
              <h4 className="font-semibold mb-2">Idosos (≥65 anos):</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Iniciar com doses menores (50% da dose usual)</li>
                <li>Atenção especial à hipotensão ortostática</li>
                <li>Evitar alfabloqueadores como primeira escolha</li>
                <li>Monitorar função renal e eletrólitos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Diabéticos:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>IECA/BRA são primeira escolha (proteção renal)</li>
                <li>Evitar betabloqueadores não-seletivos</li>
                <li>Cuidado com tiazídicos em altas doses</li>
                <li>Meta pressórica mais rigorosa (&lt;130/80)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Insuficiência Cardíaca:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>IECA/BRA + betabloqueador + diurético</li>
                <li>Adicionar espironolactona se FE reduzida</li>
                <li>Evitar BCC não-dihidropiridínicos</li>
                <li>Monitorar K+ com duplo bloqueio SRAA</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Doença Renal Crônica:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>IECA/BRA para proteção renal</li>
                <li>Ajustar doses conforme clearance</li>
                <li>Monitorar K+ e creatinina semanalmente</li>
                <li>Evitar duplo bloqueio do SRAA</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AntihypertensiveOptimization;
