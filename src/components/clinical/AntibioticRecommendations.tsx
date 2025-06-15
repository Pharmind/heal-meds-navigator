
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
    'Meropenem',
    'Vancomicina',
    'Ciprofloxacino',
    'Levofloxacino',
    'Clindamicina',
    'Linezolida'
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

  const generateRecommendations = () => {
    console.log('Gerando recomendações com dados:', { pathogens, currentTherapy, clinicalStatus, infectionSite });
    
    const newRecommendations: Recommendation[] = [];

    pathogens.forEach(pathogen => {
      console.log('Processando patógeno:', pathogen);
      
      // Lógica de escalonamento/descalonamento baseada no patógeno e sensibilidade
      if (pathogen.pathogen === 'Staphylococcus aureus') {
        if (pathogen.antibiotic === 'Oxacilina' && pathogen.result === 'S') {
          // MSSA - pode descalonar de vancomicina para oxacilina
          if (currentTherapy.toLowerCase().includes('vancomicina')) {
            newRecommendations.push({
              type: 'deescalation',
              antibiotic: 'Oxacilina',
              dose: '1-2g q4h',
              route: 'IV',
              reason: 'S. aureus sensível à oxacilina (MSSA) - descalonamento de vancomicina',
              priority: 'high'
            });
          }
        } else if (pathogen.antibiotic === 'Oxacilina' && pathogen.result === 'R') {
          // MRSA - necessita vancomicina ou alternativas
          newRecommendations.push({
            type: 'escalation',
            antibiotic: 'Vancomicina',
            dose: '15-20mg/kg q8-12h',
            route: 'IV',
            reason: 'S. aureus resistente à oxacilina (MRSA)',
            priority: 'high'
          });
          newRecommendations.push({
            type: 'escalation',
            antibiotic: 'Linezolida',
            dose: '600mg q12h',
            route: 'IV/VO',
            reason: 'Alternativa para MRSA (boa penetração pulmonar/SNC)',
            priority: 'medium'
          });
        }
      }

      if (pathogen.pathogen === 'Escherichia coli') {
        if (pathogen.antibiotic === 'Ceftriaxone' && pathogen.result === 'S') {
          // E. coli sensível - pode descalonar de carbapenêmico
          if (currentTherapy.toLowerCase().includes('meropenem') || 
              currentTherapy.toLowerCase().includes('ertapenem')) {
            newRecommendations.push({
              type: 'deescalation',
              antibiotic: 'Ceftriaxone',
              dose: '1-2g q24h',
              route: 'IV',
              reason: 'E. coli sensível à ceftriaxone - descalonamento de carbapenêmico',
              priority: 'high'
            });
          }
        } else if (pathogen.antibiotic === 'Ceftriaxone' && pathogen.result === 'R') {
          // Suspeita de ESBL - necessita carbapenêmico
          newRecommendations.push({
            type: 'escalation',
            antibiotic: 'Meropenem',
            dose: '1g q8h',
            route: 'IV',
            reason: 'E. coli resistente à ceftriaxone - suspeita ESBL',
            priority: 'high'
          });
          newRecommendations.push({
            type: 'escalation',
            antibiotic: 'Ertapenem',
            dose: '1g q24h',
            route: 'IV',
            reason: 'Alternativa para ESBL (sem atividade anti-Pseudomonas)',
            priority: 'medium'
          });
        }
      }

      if (pathogen.pathogen === 'Pseudomonas aeruginosa') {
        if (pathogen.result === 'S') {
          newRecommendations.push({
            type: 'deescalation',
            antibiotic: 'Ceftazidima',
            dose: '2g q8h',
            route: 'IV',
            reason: 'P. aeruginosa sensível - terapia dirigida',
            priority: 'high'
          });
          newRecommendations.push({
            type: 'deescalation',
            antibiotic: 'Cefepime',
            dose: '2g q8h',
            route: 'IV',
            reason: 'Alternativa para P. aeruginosa sensível',
            priority: 'medium'
          });
        } else if (pathogen.result === 'R') {
          newRecommendations.push({
            type: 'escalation',
            antibiotic: 'Colistina',
            dose: '2,5mg/kg q12h',
            route: 'IV',
            reason: 'P. aeruginosa multirresistente - colistina + segundo agente',
            priority: 'high'
          });
        }
      }

      if (pathogen.pathogen === 'Streptococcus pneumoniae') {
        if (pathogen.antibiotic === 'Penicilina G' && pathogen.result === 'S') {
          newRecommendations.push({
            type: 'deescalation',
            antibiotic: 'Penicilina G',
            dose: '2-4 milhões UI q4h',
            route: 'IV',
            reason: 'S. pneumoniae sensível à penicilina',
            priority: 'high'
          });
        } else if (pathogen.antibiotic === 'Penicilina G' && pathogen.result === 'R') {
          newRecommendations.push({
            type: 'maintain',
            antibiotic: 'Ceftriaxone',
            dose: '2g q12h',
            route: 'IV',
            reason: 'S. pneumoniae resistente à penicilina',
            priority: 'high'
          });
        }
      }

      if (pathogen.pathogen === 'Klebsiella pneumoniae') {
        if (pathogen.antibiotic === 'Ceftriaxone' && pathogen.result === 'R') {
          newRecommendations.push({
            type: 'escalation',
            antibiotic: 'Meropenem',
            dose: '1g q8h',
            route: 'IV',
            reason: 'K. pneumoniae resistente - suspeita ESBL ou KPC',
            priority: 'high'
          });
        } else if (pathogen.antibiotic === 'Meropenem' && pathogen.result === 'R') {
          newRecommendations.push({
            type: 'escalation',
            antibiotic: 'Colistina + Meropenem',
            dose: 'Colistina 2,5mg/kg q12h + Meropenem 2g q8h',
            route: 'IV',
            reason: 'K. pneumoniae KPC - terapia combinada',
            priority: 'high'
          });
        }
      }

      if (pathogen.pathogen === 'Enterococcus faecalis') {
        if (pathogen.antibiotic === 'Ampicilina' && pathogen.result === 'S') {
          newRecommendations.push({
            type: 'deescalation',
            antibiotic: 'Ampicilina',
            dose: '2g q4h',
            route: 'IV',
            reason: 'E. faecalis sensível à ampicilina',
            priority: 'high'
          });
        } else if (pathogen.antibiotic === 'Vancomicina' && pathogen.result === 'R') {
          newRecommendations.push({
            type: 'escalation',
            antibiotic: 'Linezolida',
            dose: '600mg q12h',
            route: 'IV/VO',
            reason: 'VRE - Enterococcus resistente à vancomicina',
            priority: 'high'
          });
        }
      }
    });

    // Se não há patógenos ou todos resistentes e paciente está mal clinicamente
    if (clinicalStatus === 'deteriorando' && newRecommendations.length === 0) {
      newRecommendations.push({
        type: 'escalation',
        antibiotic: 'Meropenem + Vancomicina',
        dose: 'Meropenem 1g q8h + Vancomicina 15-20mg/kg q8-12h',
        route: 'IV',
        reason: 'Deterioração clínica sem identificação de patógenos sensíveis',
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

    console.log('Recomendações geradas:', newRecommendations);
    setRecommendations(newRecommendations);
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
              disabled={pathogens.length === 0}
            >
              Gerar Recomendações
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
                      <p className="text-sm text-gray-600">{rec.reason}</p>
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
                  Monitore resposta clínica e laboratorial em 48-72h.
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
