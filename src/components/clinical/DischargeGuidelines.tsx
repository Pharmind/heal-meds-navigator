
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Printer, ClipboardCheck, Heart, Activity, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PatientInfo {
  name: string;
  age: string;
}

interface PharmacistInfo {
  name: string;
  crf: string;
}

interface Pathology {
  id: string;
  name: string;
  description: string;
  basicInfo: string;
  curiosity: string;
  therapeutic: string;
  icon: any;
}

const DischargeGuidelines = () => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    age: ''
  });

  const [pharmacistInfo, setPharmacistInfo] = useState<PharmacistInfo>({
    name: '',
    crf: ''
  });

  const [selectedPathologies, setSelectedPathologies] = useState<string[]>([]);

  const pathologies: Pathology[] = [
    {
      id: 'hypertension',
      name: 'Hipertensão Arterial',
      description: 'Pressão arterial elevada de forma persistente',
      basicInfo: 'A hipertensão arterial é uma condição crônica caracterizada pela elevação persistente da pressão arterial acima de 140/90 mmHg. É conhecida como "assassina silenciosa" pois geralmente não apresenta sintomas nas fases iniciais.',
      curiosity: '💡 Curiosidade: O coração de uma pessoa hipertensa trabalha até 2 vezes mais para bombear sangue, sendo equivalente a carregar uma mochila de 10kg durante todo o dia!',
      therapeutic: 'O controle adequado da pressão arterial através dos medicamentos prescritos reduz em até 40% o risco de AVC e 25% o risco de infarto. Nunca interrompa os medicamentos sem orientação médica, mesmo que se sinta bem.',
      icon: Heart
    },
    {
      id: 'diabetes',
      name: 'Diabetes Mellitus',
      description: 'Elevação dos níveis de glicose no sangue',
      basicInfo: 'O diabetes é uma doença crônica que afeta a forma como o corpo processa a glicose (açúcar) no sangue. Pode ser tipo 1 (falta de insulina) ou tipo 2 (resistência à insulina).',
      curiosity: '💡 Curiosidade: Uma pessoa com diabetes pode ter uma vida completamente normal! Muitos atletas olímpicos são diabéticos e mantêm excelente controle da doença.',
      therapeutic: 'O uso correto dos medicamentos para diabetes previne complicações graves como cegueira, problemas renais e amputações. O controle rigoroso da glicemia pode adicionar anos de vida saudável.',
      icon: Activity
    },
    {
      id: 'cardiac',
      name: 'Problemas Cardíacos',
      description: 'Doenças que afetam o coração e circulação',
      basicInfo: 'As doenças cardíacas incluem condições como insuficiência cardíaca, arritmias e doença coronariana. Afetam a capacidade do coração de bombear sangue eficientemente.',
      curiosity: '💡 Curiosidade: O coração bate aproximadamente 100.000 vezes por dia! Cuidar bem dele significa garantir que continue trabalhando perfeitamente por muitos anos.',
      therapeutic: 'Os medicamentos cardíacos ajudam o coração a trabalhar de forma mais eficiente e previnem eventos graves como infartos. A adesão ao tratamento pode melhorar significativamente a qualidade de vida.',
      icon: Zap
    },
    {
      id: 'respiratory',
      name: 'Problemas Respiratórios',
      description: 'Condições que afetam pulmões e vias respiratórias',
      basicInfo: 'Incluem asma, DPOC (doença pulmonar obstrutiva crônica) e outras condições que dificultam a respiração e reduzem a capacidade pulmonar.',
      curiosity: '💡 Curiosidade: Em repouso, respiramos cerca de 20.000 vezes por dia! Cuidar dos pulmões garante que cada respiração seja eficiente.',
      therapeutic: 'Os medicamentos respiratórios ajudam a manter as vias aéreas abertas e reduzem a inflamação. O uso correto previne crises graves e hospitalizações.',
      icon: Activity
    },
    {
      id: 'thyroid',
      name: 'Problemas da Tireoide',
      description: 'Alterações no funcionamento da glândula tireoide',
      basicInfo: 'A tireoide regula o metabolismo do corpo. Pode funcionar demais (hipertireoidismo) ou de menos (hipotireoidismo), afetando energia, peso e humor.',
      curiosity: '💡 Curiosidade: A tireoide, apesar de pequena, controla o metabolismo de todas as células do corpo! É como o "termostato" do organismo.',
      therapeutic: 'Os medicamentos para tireoide normalizam o metabolismo e previnem complicações cardíacas e ósseas. É importante tomar sempre no mesmo horário e em jejum.',
      icon: Zap
    },
    {
      id: 'mental-health',
      name: 'Saúde Mental',
      description: 'Condições que afetam humor, pensamento e comportamento',
      basicInfo: 'Incluem depressão, ansiedade e outras condições que afetam o bem-estar emocional e mental. São tão importantes quanto as doenças físicas.',
      curiosity: '💡 Curiosidade: O cérebro consome 20% de toda a energia do corpo! Cuidar da saúde mental é cuidar do órgão mais importante do organismo.',
      therapeutic: 'Os medicamentos psiquiátricos ajudam a reequilibrar substâncias químicas do cérebro. A continuidade do tratamento é fundamental para manter a estabilidade emocional.',
      icon: Heart
    }
  ];

  const handlePathologyToggle = (pathologyId: string) => {
    if (selectedPathologies.includes(pathologyId)) {
      setSelectedPathologies(selectedPathologies.filter(id => id !== pathologyId));
    } else if (selectedPathologies.length < 3) {
      setSelectedPathologies([...selectedPathologies, pathologyId]);
    }
  };

  const generateGuidelines = () => {
    console.log('Gerando orientações:', { patientInfo, selectedPathologies, pharmacistInfo });
  };

  const downloadGuidelines = () => {
    console.log('Download das orientações');
  };

  const printGuidelines = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2">Orientações Farmacêuticas de Alta Hospitalar</h2>
        <p className="text-gray-600">Crie orientações personalizadas para pacientes em alta hospitalar</p>
      </div>

      {/* Dados do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="text-blue-600" size={24} />
            Informações do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Nome do Paciente</Label>
              <Input
                id="patientName"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                placeholder="Nome completo do paciente"
              />
            </div>
            <div>
              <Label htmlFor="patientAge">Idade</Label>
              <Input
                id="patientAge"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                placeholder="Idade do paciente"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Patologias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="text-red-600" size={24} />
              Patologias para Orientação
            </span>
            <Badge variant="outline">
              {selectedPathologies.length}/3 selecionadas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Selecione até 3 patologias para incluir nas orientações (máximo por folha A4):
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pathologies.map((pathology) => {
              const Icon = pathology.icon;
              const isSelected = selectedPathologies.includes(pathology.id);
              const isDisabled = !isSelected && selectedPathologies.length >= 3;
              
              return (
                <div
                  key={pathology.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-heal-green-400 bg-heal-green-50' 
                      : isDisabled 
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-heal-green-300 hover:bg-heal-green-25'
                  }`}
                  onClick={() => !isDisabled && handlePathologyToggle(pathology.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={isSelected}
                      disabled={isDisabled}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={20} className="text-heal-green-600" />
                        <h4 className="font-semibold text-gray-800">{pathology.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{pathology.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {selectedPathologies.length > 0 && (
            <div className="mt-6 p-4 bg-heal-green-50 rounded-lg">
              <h4 className="font-semibold text-heal-green-800 mb-3">Patologias Selecionadas:</h4>
              <div className="space-y-3">
                {selectedPathologies.map(pathologyId => {
                  const pathology = pathologies.find(p => p.id === pathologyId);
                  if (!pathology) return null;
                  
                  return (
                    <div key={pathologyId} className="bg-white p-3 rounded border">
                      <h5 className="font-medium text-gray-800 mb-2">{pathology.name}</h5>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p><strong>Informações básicas:</strong> {pathology.basicInfo}</p>
                        <p className="text-blue-600">{pathology.curiosity}</p>
                        <p><strong>Importância terapêutica:</strong> {pathology.therapeutic}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dados do Farmacêutico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="text-green-600" size={24} />
            Dados do Farmacêutico Responsável
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pharmacistName">Nome do Farmacêutico</Label>
              <Input
                id="pharmacistName"
                value={pharmacistInfo.name}
                onChange={(e) => setPharmacistInfo({...pharmacistInfo, name: e.target.value})}
                placeholder="Nome completo do farmacêutico"
              />
            </div>
            <div>
              <Label htmlFor="pharmacistCrf">CRF</Label>
              <Input
                id="pharmacistCrf"
                value={pharmacistInfo.crf}
                onChange={(e) => setPharmacistInfo({...pharmacistInfo, crf: e.target.value})}
                placeholder="Número do CRF"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={generateGuidelines}
          className="bg-heal-green-600 hover:bg-heal-green-700"
          size="lg"
          disabled={!patientInfo.name || selectedPathologies.length === 0 || !pharmacistInfo.name || !pharmacistInfo.crf}
        >
          <ClipboardCheck size={20} className="mr-2" />
          Gerar Orientações
        </Button>
        <Button 
          onClick={downloadGuidelines}
          variant="outline"
          size="lg"
          className="border-heal-green-600 text-heal-green-600 hover:bg-heal-green-50"
        >
          <Download size={20} className="mr-2" />
          Baixar PDF
        </Button>
        <Button 
          onClick={printGuidelines}
          variant="outline"
          size="lg"
          className="border-heal-green-600 text-heal-green-600 hover:bg-heal-green-50"
        >
          <Printer size={20} className="mr-2" />
          Imprimir
        </Button>
      </div>
    </div>
  );
};

export default DischargeGuidelines;
