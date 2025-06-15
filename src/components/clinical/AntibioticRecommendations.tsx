
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowUp, 
  ArrowDown, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAntibioticProtocols } from '@/hooks/useAntibioticProtocols';
import { supabase } from '@/integrations/supabase/client';

interface PathogenResult {
  pathogen: string;
  antibiotic: string;
  result: 'S' | 'I' | 'R';
  mic?: string;
}

interface Recommendation {
  type: 'escalation' | 'deescalation' | 'maintain';
  antibiotic: string;
  dose: string;
  route: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  clinicalConsiderations?: string;
}

const AntibioticRecommendations = () => {
  const [currentTherapy, setCurrentTherapy] = useState('');
  const [pathogens, setPathogens] = useState<PathogenResult[]>([]);
  const [newPathogen, setNewPathogen] = useState({
    pathogen: '',
    antibiotic: '',
    result: 'S' as 'S' | 'I' | 'R',
    mic: ''
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [clinicalStatus, setClinicalStatus] = useState('');
  const [infectionSite, setInfectionSite] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: protocols, isLoading: protocolsLoading } = useAntibioticProtocols();

  const commonPathogens = [
    'Staphylococcus aureus',
    'Streptococcus pneumoniae',
    'Escherichia coli',
    'Klebsiella pneumoniae',
    'Pseudomonas aeruginosa',
    'Acinetobacter baumannii',
    'Enterococcus faecalis',
    'Enterococcus faecium'
  ];

  const commonAntibiotics = [
    'Penicilina G',
    'Oxacilina',
    'Ampicilina',
    'Amoxicilina',
    'Ceftriaxone',
    'Cefepime',
    'Ceftazidima',
    'Meropenem',
    'Ertapenem',
    'Vancomicina',
    'Ciprofloxacino',
    'Levofloxacino',
    'Clindamicina',
    'Linezolida',
    'Colistina'
  ];

  const addPathogenResult = () => {
    if (newPathogen.pathogen && newPathogen.antibiotic) {
      setPathogens([...pathogens, { ...newPathogen }]);
      setNewPathogen({
        pathogen: '',
        antibiotic: '',
        result: 'S',
        mic: ''
      });
    }
  };

  const removePathogenResult = (index: number) => {
    setPathogens(pathogens.filter((_, i) => i !== index));
  };

  const generateRecommendations = async () => {
    if (!protocols) {
      console.error('Protocolos não carregados');
      return;
    }

    setIsGenerating(true);
    console.log('Gerando recomendações com dados:', { pathogens, currentTherapy, clinicalStatus, infectionSite });
    
    const newRecommendations: Recommendation[] = [];

    // Buscar recomendações específicas para cada patógeno no banco de dados
    for (const pathogen of pathogens) {
      console.log('Processando patógeno:', pathogen);
      
      // Buscar protocolos específicos para este patógeno/antibiótico/sensibilidade
      const specificProtocols = protocols.filter(protocol => 
        protocol.pathogen_name === pathogen.pathogen &&
        protocol.antibiotic_tested === pathogen.antibiotic &&
        protocol.sensitivity_result === pathogen.result
      );

      console.log('Protocolos encontrados para', pathogen.pathogen, ':', specificProtocols.length);

      // Adicionar recomendações baseadas nos protocolos encontrados
      specificProtocols.forEach(protocol => {
        const recommendation: Recommendation = {
          type: protocol.recommendation_type,
          antibiotic: protocol.recommended_antibiotic,
          dose: protocol.dose,
          route: protocol.route,
          reason: protocol.reason,
          priority: protocol.priority,
          clinicalConsiderations: protocol.clinical_considerations || undefined
        };
        
        // Verificar se já existe uma recomendação similar para evitar duplicatas
        const exists = newRecommendations.some(rec => 
          rec.antibiotic === recommendation.antibiotic && 
          rec.type === recommendation.type
        );
        
        if (!exists) {
          newRecommendations.push(recommendation);
        }
      });

      // Se não encontrou protocolos específicos, buscar por patógeno genérico
      if (specificProtocols.length === 0) {
        const genericProtocols = protocols.filter(protocol => 
          protocol.pathogen_name === pathogen.pathogen &&
          protocol.sensitivity_result === pathogen.result
        );

        genericProtocols.forEach(protocol => {
          const recommendation: Recommendation = {
            type: protocol.recommendation_type,
            antibiotic: protocol.recommended_antibiotic,
            dose: protocol.dose,
            route: protocol.route,
            reason: `${protocol.reason} (protocolo genérico para ${pathogen.pathogen})`,
            priority: protocol.priority,
            clinicalConsiderations: protocol.clinical_considerations || undefined
          };
          
          const exists = newRecommendations.some(rec => 
            rec.antibiotic === recommendation.antibiotic && 
            rec.type === recommendation.type
          );
          
          if (!exists) {
            newRecommendations.push(recommendation);
          }
        });
      }
    }

    // Lógica adicional baseada no estado clínico
    if (clinicalStatus === 'deteriorando' && newRecommendations.length === 0) {
      newRecommendations.push({
        type: 'escalation',
        antibiotic: 'Meropenem + Vancomicina',
        dose: 'Meropenem 1g q8h + Vancomicina 15-20mg/kg q8-12h',
        route: 'IV',
        reason: 'Deterioração clínica sem identificação de patógenos sensíveis - terapia empírica ampla',
        priority: 'high'
      });
    }

    // Se paciente está melhorando e há sensibilidade, considerar descalonamento
    if (clinicalStatus === 'melhorando' && pathogens.some(p => p.result === 'S')) {
      const sensiblePathogens = pathogens.filter(p => p.result === 'S');
      sensiblePathogens.forEach(pathogen => {
        if (!newRecommendations.some(rec => rec.antibiotic === pathogen.antibiotic)) {
          newRecommendations.push({
            type: 'deescalation',
            antibiotic: pathogen.antibiotic,
            dose: 'Conforme protocolo institucional',
            route: 'IV/VO',
            reason: `Melhora clínica e ${pathogen.pathogen} sensível`,
            priority: 'medium'
          });
        }
      });
    }

    // Ordenar recomendações por prioridade
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    newRecommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    console.log('Recomendações geradas:', newRecommendations);
    setRecommendations(newRecommendations);
    setIsGenerating(false);
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'S':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'I':
        return <Clock className="text-yellow-500" size={16} />;
      case 'R':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'escalation':
        return <ArrowUp className="text-red-500" size={16} />;
      case 'deescalation':
        return <ArrowDown className="text-green-500" size={16} />;
      case 'maintain':
        return <FileText className="text-blue-500" size={16} />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (protocolsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-heal-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando protocolos de antibióticos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações Clínicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Dados Clínicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current-therapy">Terapia Atual</Label>
              <Input
                id="current-therapy"
                placeholder="Ex: Vancomicina + Piperacilina-tazobactam"
                value={currentTherapy}
                onChange={(e) => setCurrentTherapy(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="infection-site">Sítio de Infecção</Label>
              <Select value={infectionSite} onValueChange={setInfectionSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sítio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pneumonia">Pneumonia</SelectItem>
                  <SelectItem value="itu">ITU</SelectItem>
                  <SelectItem value="pele">Pele e Partes Moles</SelectItem>
                  <SelectItem value="intra-abdominal">Intra-abdominal</SelectItem>
                  <SelectItem value="bacteremia">Bacteremia</SelectItem>
                  <SelectItem value="endocardite">Endocardite</SelectItem>
                  <SelectItem value="meningite">Meningite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="clinical-status">Estado Clínico</Label>
            <Select value={clinicalStatus} onValueChange={setClinicalStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado clínico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="melhorando">Melhorando</SelectItem>
                <SelectItem value="estavel">Estável</SelectItem>
                <SelectItem value="deteriorando">Deteriorando</SelectItem>
                <SelectItem value="critico">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inserção de Resultados do Antibiograma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Resultados do Antibiograma
          </CardTitle>
          <CardDescription>
            Insira os resultados de cultura e antibiograma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4 mb-4">
            <div>
              <Label>Microrganismo</Label>
              <Select 
                value={newPathogen.pathogen} 
                onValueChange={(value) => setNewPathogen({...newPathogen, pathogen: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {commonPathogens.map(pathogen => (
                    <SelectItem key={pathogen} value={pathogen}>{pathogen}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Antibiótico</Label>
              <Select 
                value={newPathogen.antibiotic} 
                onValueChange={(value) => setNewPathogen({...newPathogen, antibiotic: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {commonAntibiotics.map(antibiotic => (
                    <SelectItem key={antibiotic} value={antibiotic}>{antibiotic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Resultado</Label>
              <Select 
                value={newPathogen.result} 
                onValueChange={(value: 'S' | 'I' | 'R') => setNewPathogen({...newPathogen, result: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">S (Sensível)</SelectItem>
                  <SelectItem value="I">I (Intermediário)</SelectItem>
                  <SelectItem value="R">R (Resistente)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>MIC (opcional)</Label>
              <Input
                placeholder="Ex: ≤0.5"
                value={newPathogen.mic}
                onChange={(e) => setNewPathogen({...newPathogen, mic: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addPathogenResult} className="w-full">
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de Resultados Adicionados */}
          {pathogens.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Resultados Inseridos:</h4>
              {pathogens.map((pathogen, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getResultIcon(pathogen.result)}
                    <span className="font-medium">{pathogen.pathogen}</span>
                    <span className="text-gray-600">{pathogen.antibiotic}</span>
                    <Badge variant={pathogen.result === 'S' ? 'default' : pathogen.result === 'I' ? 'secondary' : 'destructive'}>
                      {pathogen.result}
                    </Badge>
                    {pathogen.mic && <span className="text-sm text-gray-500">MIC: {pathogen.mic}</span>}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removePathogenResult(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <Button 
              onClick={generateRecommendations} 
              className="w-full"
              disabled={pathogens.length === 0 || isGenerating}
            >
              {isGenerating ? 'Gerando...' : 'Gerar Recomendações'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recomendações Geradas */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} />
              Recomendações de Antimicrobioterapia
              <Badge variant="outline">{recommendations.length} recomendação(ões)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start gap-3">
                    {getRecommendationIcon(rec.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{rec.antibiotic}</h4>
                        <Badge variant={rec.type === 'escalation' ? 'destructive' : rec.type === 'deescalation' ? 'default' : 'secondary'}>
                          {rec.type === 'escalation' ? 'Escalonamento' : rec.type === 'deescalation' ? 'Descalonamento' : 'Manter'}
                        </Badge>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}>
                          {rec.priority === 'high' ? 'Alta Prioridade' : rec.priority === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Dose:</strong> {rec.dose} ({rec.route})
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                      {rec.clinicalConsiderations && (
                        <p className="text-sm text-blue-600 italic">
                          <strong>Considerações:</strong> {rec.clinicalConsiderations}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {clinicalStatus && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Lembrete:</strong> Sempre considere o estado clínico do paciente, função renal/hepática, 
                  alergias e fatores de risco específicos antes de implementar as recomendações. 
                  Monitore resposta clínica e laboratorial em 48-72h. Os protocolos são baseados em diretrizes 
                  clínicas e devem ser adaptados ao contexto individual do paciente.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AntibioticRecommendations;
