
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Printer, ClipboardCheck, Heart, Activity, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePathologies } from '@/hooks/usePathologies';
import PathologyForm from './PathologyForm';
import { generateDischargeGuidelinesPDF } from '@/utils/pdfGenerator';

interface PatientInfo {
  name: string;
  age: string;
}

interface PharmacistInfo {
  name: string;
  crf: string;
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
  const { data: pathologies = [], refetch } = usePathologies();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Activity': return Activity;
      case 'Zap': return Zap;
      default: return Heart;
    }
  };

  const handlePathologyToggle = (pathologyId: string) => {
    if (selectedPathologies.includes(pathologyId)) {
      setSelectedPathologies(selectedPathologies.filter(id => id !== pathologyId));
    } else if (selectedPathologies.length < 3) {
      setSelectedPathologies([...selectedPathologies, pathologyId]);
    }
  };

  const generateGuidelines = () => {
    const selectedPathologyData = pathologies
      .filter(p => selectedPathologies.includes(p.id))
      .map(p => ({
        name: p.name,
        basicInfo: p.basicInfo,
        curiosity: p.curiosity,
        therapeutic: p.therapeutic
      }));

    const pdfData = {
      patientInfo,
      pharmacistInfo,
      pathologies: selectedPathologyData
    };

    const doc = generateDischargeGuidelinesPDF(pdfData);
    
    // Open PDF in new window
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const downloadGuidelines = () => {
    const selectedPathologyData = pathologies
      .filter(p => selectedPathologies.includes(p.id))
      .map(p => ({
        name: p.name,
        basicInfo: p.basicInfo,
        curiosity: p.curiosity,
        therapeutic: p.therapeutic
      }));

    const pdfData = {
      patientInfo,
      pharmacistInfo,
      pathologies: selectedPathologyData
    };

    const doc = generateDischargeGuidelinesPDF(pdfData);
    doc.save(`orientacoes_alta_${patientInfo.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const printGuidelines = () => {
    const selectedPathologyData = pathologies
      .filter(p => selectedPathologies.includes(p.id))
      .map(p => ({
        name: p.name,
        basicInfo: p.basicInfo,
        curiosity: p.curiosity,
        therapeutic: p.therapeutic
      }));

    const pdfData = {
      patientInfo,
      pharmacistInfo,
      pathologies: selectedPathologyData
    };

    const doc = generateDischargeGuidelinesPDF(pdfData);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handlePathologyFormSuccess = () => {
    refetch();
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

      {/* Formulário para nova patologia */}
      <PathologyForm onSuccess={handlePathologyFormSuccess} />

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
              const Icon = getIconComponent(pathology.iconName);
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
          disabled={!patientInfo.name || selectedPathologies.length === 0 || !pharmacistInfo.name || !pharmacistInfo.crf}
        >
          <Download size={20} className="mr-2" />
          Baixar PDF
        </Button>
        <Button 
          onClick={printGuidelines}
          variant="outline"
          size="lg"
          className="border-heal-green-600 text-heal-green-600 hover:bg-heal-green-50"
          disabled={!patientInfo.name || selectedPathologies.length === 0 || !pharmacistInfo.name || !pharmacistInfo.crf}
        >
          <Printer size={20} className="mr-2" />
          Imprimir
        </Button>
      </div>
    </div>
  );
};

export default DischargeGuidelines;
