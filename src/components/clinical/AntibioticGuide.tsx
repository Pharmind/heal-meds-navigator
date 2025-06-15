
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Microscope, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  AlertTriangle, 
  Info,
  Target,
  Clock,
  Shield,
  Activity
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AntibioticGuide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedPathogen, setSelectedPathogen] = useState('');

  // Dados dos antibióticos organizados por classe
  const antibioticClasses = [
    {
      name: 'Beta-lactâmicos',
      icon: Shield,
      color: 'bg-blue-50 border-blue-200',
      antibiotics: [
        {
          name: 'Penicilina G',
          spectrum: 'Streptococcus spp., Pneumococcus sensível',
          dose: '2-4 milhões UI q4-6h',
          route: 'IV',
          use: 'Endocardite estreptocócica, sífilis'
        },
        {
          name: 'Amoxicilina',
          spectrum: 'Gram-positivos + E. coli, Proteus',
          dose: '500-875mg q8-12h',
          route: 'VO',
          use: 'ITU não complicada, pneumonia leve'
        },
        {
          name: 'Piperacilina-Tazobactam',
          spectrum: 'Amplo incluindo Pseudomonas, anaeróbios',
          dose: '4,5g q6-8h',
          route: 'IV',
          use: 'Pneumonia nosocomial, infecção intra-abdominal'
        }
      ]
    },
    {
      name: 'Cefalosporinas',
      icon: Target,
      color: 'bg-green-50 border-green-200',
      antibiotics: [
        {
          name: 'Cefazolina (1ª geração)',
          spectrum: 'Cocos gram-positivos, E. coli, Klebsiella',
          dose: '1-2g q8h',
          route: 'IV',
          use: 'Profilaxia cirúrgica, infecções de pele'
        },
        {
          name: 'Ceftriaxone (3ª geração)',
          spectrum: 'Amplo contra gram-negativos, pneumococo',
          dose: '1-2g q24h',
          route: 'IV',
          use: 'Pneumonia, meningite, infecções sistêmicas'
        },
        {
          name: 'Cefepime (4ª geração)',
          spectrum: '3ª geração + Enterobacter, Pseudomonas',
          dose: '1-2g q8-12h',
          route: 'IV',
          use: 'Infecções hospitalares, neutropenia febril'
        }
      ]
    },
    {
      name: 'Carbapenêmicos',
      icon: AlertTriangle,
      color: 'bg-red-50 border-red-200',
      antibiotics: [
        {
          name: 'Meropenem',
          spectrum: 'Ultra-amplo, incluindo ESBL, anaeróbios',
          dose: '1-2g q8h',
          route: 'IV',
          use: 'Infecções graves por MDR, meningite'
        },
        {
          name: 'Ertapenem',
          spectrum: 'Carbapenêmico sem ação anti-Pseudomonas',
          dose: '1g q24h',
          route: 'IV',
          use: 'ESBL em infecções comunitárias'
        }
      ]
    },
    {
      name: 'Quinolonas',
      icon: Activity,
      color: 'bg-purple-50 border-purple-200',
      antibiotics: [
        {
          name: 'Ciprofloxacino',
          spectrum: 'Excelente contra gram-negativos, Pseudomonas',
          dose: '400mg q8-12h (IV), 500-750mg q12h (VO)',
          route: 'IV/VO',
          use: 'ITU complicada, infecções por Pseudomonas'
        },
        {
          name: 'Levofloxacino',
          spectrum: 'Gram-negativos + gram-positivos e atípicos',
          dose: '500-750mg q24h',
          route: 'IV/VO',
          use: 'Pneumonia comunitária, ITU complicada'
        }
      ]
    }
  ];

  // Protocolos por sítio de infecção
  const infectionSites = [
    {
      name: 'Pneumonia Comunitária',
      empirical: {
        ambulatorial: 'Amoxicilina 1g q8h',
        internacao: 'Ceftriaxone 2g q24h + Azitromicina 500mg q24h',
        uti: 'Ceftriaxone 2g q24h + Azitromicina ± Vancomicina'
      },
      escalation: 'Piperacilina-tazobactam + Vancomicina + Azitromicina',
      deescalation: [
        'S. pneumoniae sensível → Amoxicilina 1g q8h',
        'H. influenzae → Amoxicilina-clavulanato',
        'Atípicos → Azitromicina ou Doxiciclina'
      ]
    },
    {
      name: 'ITU Complicada',
      empirical: {
        ambulatorial: 'Ciprofloxacino 500mg q12h',
        internacao: 'Ceftriaxone 1-2g q24h',
        grave: 'Piperacilina-tazobactam ou Meropenem'
      },
      escalation: 'Meropenem 1g q8h',
      deescalation: [
        'E. coli sensível → Ciprofloxacino VO',
        'ESBL → Ertapenem → Fosfomicina (ITU)',
        'Enterococcus → Ampicilina'
      ]
    },
    {
      name: 'Infecção Intra-abdominal',
      empirical: {
        naoComplicada: 'Cefazolina + Metronidazol',
        complicada: 'Piperacilina-tazobactam 4,5g q6h',
        grave: 'Meropenem + Vancomicina'
      },
      escalation: 'Meropenem + Vancomicina + Fluconazol',
      deescalation: [
        'E. coli sensível → Ceftriaxone + Metronidazol',
        'Anaeróbios → Metronidazol',
        'Enterococcus → Ampicilina'
      ]
    }
  ];

  // Patógenos específicos
  const specificPathogens = [
    {
      name: 'MRSA',
      firstLine: 'Vancomicina 15-20mg/kg q8-12h',
      alternatives: ['Linezolida 600mg q12h', 'Daptomicina 6-8mg/kg q24h'],
      monitoring: 'Vale: 15-20mg/L (infecções graves)',
      resistance: 'VISA/VRSA (vancomicina MIC ≥4)'
    },
    {
      name: 'ESBL',
      firstLine: 'Meropenem 1g q8h',
      alternatives: ['Ertapenem (sem Pseudomonas)', 'Fosfomicina (ITU)'],
      monitoring: 'Função renal',
      resistance: 'KPC, NDM, OXA-48'
    },
    {
      name: 'Pseudomonas aeruginosa',
      firstLine: 'Ceftazidima 2g q8h ou Cefepime 2g q8h',
      alternatives: ['Piperacilina-tazobactam 4,5g q6h', 'Meropenem'],
      monitoring: 'Considerar terapia combinada em infecções graves',
      resistance: 'MDR: Colistina + segundo agente'
    },
    {
      name: 'Acinetobacter baumannii',
      firstLine: 'Ampicilina-sulbactam 3g q6h',
      alternatives: ['Doxiciclina', 'Meropenem'],
      monitoring: 'MDRAB: Colistina + segundo agente',
      resistance: 'Extremamente resistente'
    }
  ];

  const filteredAntibiotics = antibioticClasses.map(cls => ({
    ...cls,
    antibiotics: cls.antibiotics.filter(ab =>
      ab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ab.spectrum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ab.use.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cls => cls.antibiotics.length > 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-heal-green-800 mb-2 flex items-center justify-center gap-2">
          <Microscope className="text-heal-green-600" size={32} />
          Guia ATB - Escalonamento e Descalonamento
        </h2>
        <p className="text-gray-600">Guia completo para uso racional de antibióticos</p>
      </div>

      <Tabs defaultValue="antibiotics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="antibiotics">Antibióticos</TabsTrigger>
          <TabsTrigger value="protocols">Protocolos</TabsTrigger>
          <TabsTrigger value="pathogens">Patógenos</TabsTrigger>
          <TabsTrigger value="monitoring">Monitorização</TabsTrigger>
        </TabsList>

        <TabsContent value="antibiotics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={20} />
                Busca de Antibióticos
              </CardTitle>
              <CardDescription>
                Pesquise por nome, espectro ou indicação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Digite o nome do antibiótico, patógeno ou indicação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {filteredAntibiotics.map((antibioticClass, index) => (
              <Card key={index} className={antibioticClass.color}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <antibioticClass.icon size={20} />
                    {antibioticClass.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {antibioticClass.antibiotics.map((antibiotic, abIndex) => (
                      <div key={abIndex} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-lg">{antibiotic.name}</h4>
                          <Badge variant="outline">{antibiotic.route}</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Espectro:</p>
                            <p className="text-gray-600">{antibiotic.spectrum}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Dose:</p>
                            <p className="text-gray-600">{antibiotic.dose}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="font-medium text-gray-700">Indicação:</p>
                          <p className="text-gray-600">{antibiotic.use}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sítio de infecção" />
                </SelectTrigger>
                <SelectContent>
                  {infectionSites.map((site, index) => (
                    <SelectItem key={index} value={site.name}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {infectionSites.map((site, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} />
                    {site.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Activity size={16} />
                          Terapia Empírica
                        </h4>
                        <div className="space-y-2 text-sm">
                          {Object.entries(site.empirical).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium capitalize">{key}:</span>
                              <p className="text-gray-600">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <ArrowUp size={16} />
                          Escalonamento
                        </h4>
                        <p className="text-sm text-gray-600">{site.escalation}</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <ArrowDown size={16} />
                          Descalonamento
                        </h4>
                        <div className="space-y-1 text-sm">
                          {site.deescalation.map((item, itemIndex) => (
                            <p key={itemIndex} className="text-gray-600">{item}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pathogens" className="space-y-4">
          <div className="grid gap-4">
            {specificPathogens.map((pathogen, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope size={20} />
                    {pathogen.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-1">1ª Linha:</h4>
                        <p className="text-sm bg-green-50 p-2 rounded">{pathogen.firstLine}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-1">Alternativas:</h4>
                        <div className="space-y-1">
                          {pathogen.alternatives.map((alt, altIndex) => (
                            <p key={altIndex} className="text-sm bg-blue-50 p-2 rounded">{alt}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-1">Monitorização:</h4>
                        <p className="text-sm bg-orange-50 p-2 rounded">{pathogen.monitoring}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-1">Resistência:</h4>
                        <p className="text-sm bg-red-50 p-2 rounded">{pathogen.resistance}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Monitorização de Níveis Séricos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Vancomicina</h4>
                      <ul className="text-sm space-y-1">
                        <li><strong>Nível vale:</strong> 15-20mg/L (graves), 10-15mg/L (outras)</li>
                        <li><strong>Coleta:</strong> Antes da 4ª dose</li>
                        <li><strong>AUC/MIC:</strong> Alvo >400</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Aminoglicosídeos</h4>
                      <ul className="text-sm space-y-1">
                        <li><strong>Gentamicina:</strong> Vale <2mg/L, Pico 5-10mg/L</li>
                        <li><strong>Amicacina:</strong> Vale <5mg/L, Pico 20-30mg/L</li>
                        <li><strong>Coleta:</strong> Vale antes da dose, pico 30min após</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Ajustes para Função Renal</strong><br/>
                        ClCr 30-50: Reduzir dose 25-50%<br/>
                        ClCr <30: Ajuste individualizado<br/>
                        Diálise: Dose pós-sessão
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Interações Importantes</strong><br/>
                        Vancomicina + Aminoglicosídeos: ↑ Nefrotoxicidade<br/>
                        Quinolonas + Varfarina: ↑ INR<br/>
                        Linezolida + IMAO: Síndrome serotoninérgica
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critérios para Escalonamento e Descalonamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <ArrowUp size={16} />
                      Indicações para Escalonamento
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        Deterioração clínica após 48-72h
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        Falha em atingir melhora (febre, PCR)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        Identificação de patógeno resistente
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        Instabilidade hemodinâmica
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <ArrowDown size={16} />
                      Critérios para Descalonamento
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        Identificação microbiológica + antibiograma
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        Melhora clínica evidente
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        Melhora laboratorial (PCR, lactato)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        Ausência de complicações
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AntibioticGuide;
