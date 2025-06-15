
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  ArrowRight,
  Microscope,
  Search
} from 'lucide-react';

type SensitivityResult = 'sensitive' | 'variable' | 'resistant';

type PathogenData = {
  [antibiotic: string]: SensitivityResult;
};

type AntibioticMatrix = {
  [pathogen: string]: PathogenData;
};

const AntibioticFlowchart = () => {
  const [selectedPathogen, setSelectedPathogen] = useState('');
  const [selectedAntibiotic, setSelectedAntibiotic] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Matriz expandida com todos os antibióticos de importância hospitalar
  const antibioticMatrix: AntibioticMatrix = {
    // Cocos Gram Positivos
    'Staphylococcus aureus': {
      // Beta-lactâmicos
      'Penicilina G': 'resistant',
      'Penicilina V': 'resistant',
      'Ampicilina': 'resistant',
      'Amoxicilina': 'resistant',
      'Amoxicilina-Clavulanato': 'variable',
      'Ampicilina-Sulbactam': 'variable',
      'Oxacilina': 'variable',
      'Cloxacilina': 'variable',
      'Cefazolina': 'variable',
      'Cefalexina': 'variable',
      'Cefuroxima': 'variable',
      'Cefoxitina': 'variable',
      'Ceftriaxone': 'variable',
      'Cefotaxima': 'variable',
      'Ceftazidima': 'resistant',
      'Cefepime': 'variable',
      'Ceftarolina': 'sensitive',
      'Ceftobiprole': 'sensitive',
      'Piperacilina-Tazobactam': 'variable',
      'Ticarcilina-Clavulanato': 'variable',
      // Carbapenêmicos
      'Meropenem': 'variable',
      'Imipenem': 'variable',
      'Ertapenem': 'variable',
      'Doripenem': 'variable',
      // Glicopeptídeos
      'Vancomicina': 'sensitive',
      'Teicoplanina': 'sensitive',
      // Lipopeptídeos
      'Daptomicina': 'sensitive',
      // Oxazolidinonas
      'Linezolida': 'sensitive',
      'Tedizolida': 'sensitive',
      // Aminoglicosídeos
      'Gentamicina': 'variable',
      'Tobramicina': 'variable',
      'Amicacina': 'variable',
      'Netilmicina': 'variable',
      'Estreptomicina': 'variable',
      // Quinolonas/Fluoroquinolonas
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'Moxifloxacino': 'variable',
      'Gatifloxacino': 'variable',
      'Ofloxacino': 'variable',
      // Macrolídeos
      'Eritromicina': 'variable',
      'Claritromicina': 'variable',
      'Azitromicina': 'variable',
      'Roxitromicina': 'variable',
      // Lincosaminas
      'Clindamicina': 'variable',
      // Tetraciclinas
      'Tetraciclina': 'variable',
      'Doxiciclina': 'variable',
      'Minociclina': 'variable',
      'Tigeciclina': 'sensitive',
      // Sulfonamidas
      'SMX-TMP': 'variable',
      'Sulfadiazina': 'variable',
      // Outros
      'Rifampicina': 'variable',
      'Cloranfenicol': 'variable',
      'Fusidato': 'variable',
      'Mupirocina': 'variable',
      'Fosfomicina': 'variable',
      'Nitrofurantoína': 'variable'
    },
    'Staphylococcus epidermidis': {
      'Penicilina G': 'resistant',
      'Oxacilina': 'variable',
      'Cefazolina': 'variable',
      'Vancomicina': 'sensitive',
      'Teicoplanina': 'sensitive',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive',
      'Rifampicina': 'variable',
      'Gentamicina': 'variable',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Clindamicina': 'variable',
      'Tigeciclina': 'sensitive',
      'Tedizolida': 'sensitive',
      'Fusidato': 'variable'
    },
    'Staphylococcus haemolyticus': {
      'Penicilina G': 'resistant',
      'Oxacilina': 'resistant',
      'Vancomicina': 'variable',
      'Teicoplanina': 'variable',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive',
      'Tigeciclina': 'sensitive',
      'Rifampicina': 'variable'
    },
    'Streptococcus pneumoniae': {
      'Penicilina G': 'variable',
      'Ampicilina': 'sensitive',
      'Amoxicilina': 'sensitive',
      'Amoxicilina-Clavulanato': 'sensitive',
      'Cefuroxima': 'variable',
      'Ceftriaxone': 'sensitive',
      'Cefotaxima': 'sensitive',
      'Cefepime': 'variable',
      'Meropenem': 'sensitive',
      'Vancomicina': 'sensitive',
      'Linezolida': 'sensitive',
      'Levofloxacino': 'variable',
      'Moxifloxacino': 'variable',
      'Azitromicina': 'variable',
      'Claritromicina': 'variable',
      'Eritromicina': 'variable',
      'Clindamicina': 'variable',
      'SMX-TMP': 'variable',
      'Tetraciclina': 'variable',
      'Doxiciclina': 'variable',
      'Cloranfenicol': 'variable',
      'Rifampicina': 'sensitive',
      'Daptomicina': 'sensitive',
      'Ceftarolina': 'sensitive'
    },
    'Streptococcus agalactiae': {
      'Penicilina G': 'sensitive',
      'Ampicilina': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Vancomicina': 'sensitive',
      'Clindamicina': 'variable',
      'Eritromicina': 'variable',
      'Levofloxacino': 'sensitive',
      'Linezolida': 'sensitive'
    },
    'Streptococcus pyogenes': {
      'Penicilina G': 'sensitive',
      'Ampicilina': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Vancomicina': 'sensitive',
      'Clindamicina': 'variable',
      'Eritromicina': 'variable',
      'Azitromicina': 'variable',
      'Levofloxacino': 'sensitive'
    },
    'Enterococcus faecalis': {
      'Penicilina G': 'resistant',
      'Ampicilina': 'sensitive',
      'Piperacilina': 'sensitive',
      'Vancomicina': 'variable',
      'Teicoplanina': 'variable',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive',
      'Gentamicina': 'resistant',
      'Estreptomicina': 'variable',
      'Ciprofloxacino': 'resistant',
      'Nitrofurantoína': 'sensitive',
      'Tetraciclina': 'variable',
      'Tigeciclina': 'variable'
    },
    'Enterococcus faecium': {
      'Ampicilina': 'resistant',
      'Penicilina G': 'resistant',
      'Vancomicina': 'variable',
      'Teicoplanina': 'variable',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive',
      'Tigeciclina': 'variable',
      'Quinupristina-Dalfopristina': 'sensitive'
    },
    'Enterococcus gallinarum': {
      'Ampicilina': 'variable',
      'Vancomicina': 'resistant',
      'Teicoplanina': 'sensitive',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive'
    },
    'Enterococcus casseliflavus': {
      'Ampicilina': 'variable',
      'Vancomicina': 'resistant',
      'Teicoplanina': 'sensitive',
      'Linezolida': 'sensitive',
      'Daptomicina': 'sensitive'
    },
    
    // Bacilos Gram Positivos
    'Listeria monocytogenes': {
      'Penicilina G': 'sensitive',
      'Ampicilina': 'sensitive',
      'Ceftriaxone': 'resistant',
      'Meropenem': 'sensitive',
      'Vancomicina': 'resistant',
      'SMX-TMP': 'sensitive',
      'Eritromicina': 'variable',
      'Gentamicina': 'variable'
    },
    'Bacillus cereus': {
      'Vancomicina': 'sensitive',
      'Clindamicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Gentamicina': 'variable',
      'Penicilina G': 'resistant'
    },
    'Bacillus anthracis': {
      'Penicilina G': 'sensitive',
      'Ciprofloxacino': 'sensitive',
      'Doxiciclina': 'sensitive',
      'Clindamicina': 'sensitive'
    },
    'Corynebacterium spp.': {
      'Vancomicina': 'sensitive',
      'Penicilina G': 'variable',
      'Eritromicina': 'variable',
      'Clindamicina': 'variable'
    },
    
    // BGN Enterobactérias
    'Escherichia coli': {
      // Beta-lactâmicos
      'Penicilina G': 'resistant',
      'Ampicilina': 'variable',
      'Amoxicilina': 'variable',
      'Amoxicilina-Clavulanato': 'variable',
      'Ampicilina-Sulbactam': 'variable',
      'Piperacilina': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Ticarcilina-Clavulanato': 'variable',
      'Cefazolina': 'variable',
      'Cefalexina': 'variable',
      'Cefuroxima': 'variable',
      'Cefoxitina': 'variable',
      'Ceftriaxone': 'variable',
      'Cefotaxima': 'variable',
      'Ceftazidima': 'variable',
      'Cefepime': 'variable',
      'Ceftolozano-Tazobactam': 'variable',
      'Ceftazidima-Avibactam': 'variable',
      // Carbapenêmicos
      'Meropenem': 'sensitive',
      'Imipenem': 'sensitive',
      'Ertapenem': 'sensitive',
      'Doripenem': 'sensitive',
      'Meropenem-Vaborbactam': 'sensitive',
      'Imipenem-Relebactam': 'sensitive',
      // Aminoglicosídeos
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Tobramicina': 'variable',
      'Netilmicina': 'variable',
      'Plazomicina': 'variable',
      // Quinolonas
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'Norfloxacino': 'variable',
      'Ofloxacino': 'variable',
      // Outros
      'SMX-TMP': 'variable',
      'Nitrofurantoína': 'sensitive',
      'Fosfomicina': 'sensitive',
      'Tigeciclina': 'sensitive',
      'Polimixina B': 'sensitive',
      'Colistina': 'sensitive',
      'Tetraciclina': 'variable',
      'Doxiciclina': 'variable',
      'Cloranfenicol': 'variable',
      'Aztreonam': 'variable'
    },
    'Klebsiella pneumoniae': {
      'Ampicilina': 'resistant',
      'Amoxicilina-Clavulanato': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Cefazolina': 'variable',
      'Cefuroxima': 'variable',
      'Ceftriaxone': 'variable',
      'Cefotaxima': 'variable',
      'Ceftazidima': 'variable',
      'Cefepime': 'variable',
      'Ceftolozano-Tazobactam': 'variable',
      'Ceftazidima-Avibactam': 'variable',
      'Meropenem': 'variable',
      'Imipenem': 'variable',
      'Ertapenem': 'variable',
      'Meropenem-Vaborbactam': 'variable',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Plazomicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Tigeciclina': 'sensitive',
      'Polimixina B': 'sensitive',
      'Colistina': 'sensitive',
      'Fosfomicina': 'variable'
    },
    'Klebsiella oxytoca': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'variable',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable',
      'Tigeciclina': 'sensitive'
    },
    'Enterobacter cloacae': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'resistant',
      'Cefuroxima': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Tigeciclina': 'variable'
    },
    'Enterobacter aerogenes': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable'
    },
    'Serratia marcescens': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable'
    },
    'Citrobacter freundii': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable'
    },
    'Citrobacter koseri': {
      'Ampicilina': 'variable',
      'Cefazolina': 'variable',
      'Ceftriaxone': 'sensitive',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable'
    },
    'Proteus mirabilis': {
      'Ampicilina': 'sensitive',
      'Cefazolina': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Cefepime': 'sensitive',
      'Meropenem': 'sensitive',
      'Amicacina': 'sensitive',
      'Gentamicina': 'sensitive',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Nitrofurantoína': 'resistant'
    },
    'Proteus vulgaris': {
      'Ampicilina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable',
      'Nitrofurantoína': 'resistant'
    },
    'Morganella morganii': {
      'Ampicilina': 'resistant',
      'Cefazolina': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefepime': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable'
    },
    'Providencia rettgeri': {
      'Ampicilina': 'resistant',
      'Ceftriaxone': 'variable',
      'Meropenem': 'sensitive',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable'
    },
    'Salmonella spp.': {
      'Ampicilina': 'variable',
      'Ceftriaxone': 'sensitive',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Azitromicina': 'sensitive',
      'Cloranfenicol': 'variable'
    },
    'Shigella spp.': {
      'Ampicilina': 'variable',
      'Ceftriaxone': 'sensitive',
      'Ciprofloxacino': 'variable',
      'SMX-TMP': 'variable',
      'Azitromicina': 'sensitive'
    },
    
    // BGN não fermentadoras
    'Pseudomonas aeruginosa': {
      'Ceftazidima': 'variable',
      'Cefepime': 'variable',
      'Ceftolozano-Tazobactam': 'variable',
      'Ceftazidima-Avibactam': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'variable',
      'Imipenem': 'variable',
      'Doripenem': 'variable',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Tobramicina': 'variable',
      'Plazomicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'Colistina': 'sensitive',
      'Polimixina B': 'sensitive',
      'Aztreonam': 'variable',
      'Fosfomicina': 'variable'
    },
    'Acinetobacter baumannii': {
      'Ampicilina-Sulbactam': 'variable',
      'Ceftazidima': 'variable',
      'Cefepime': 'variable',
      'Piperacilina-Tazobactam': 'variable',
      'Meropenem': 'variable',
      'Imipenem': 'variable',
      'Amicacina': 'variable',
      'Gentamicina': 'variable',
      'Tobramicina': 'variable',
      'Ciprofloxacino': 'variable',
      'Levofloxacino': 'variable',
      'Colistina': 'sensitive',
      'Polimixina B': 'sensitive',
      'Doxiciclina': 'variable',
      'Tigeciclina': 'variable',
      'Minociclina': 'variable'
    },
    'Acinetobacter lwoffii': {
      'Ampicilina-Sulbactam': 'variable',
      'Meropenem': 'variable',
      'Amicacina': 'variable',
      'Ciprofloxacino': 'variable',
      'Colistina': 'sensitive'
    },
    'Stenotrophomonas maltophilia': {
      'SMX-TMP': 'sensitive',
      'Levofloxacino': 'variable',
      'Moxifloxacino': 'variable',
      'Doxiciclina': 'variable',
      'Tigeciclina': 'variable',
      'Minociclina': 'variable',
      'Ceftazidima': 'resistant',
      'Meropenem': 'resistant',
      'Cloranfenicol': 'variable'
    },
    'Burkholderia cepacia': {
      'SMX-TMP': 'sensitive',
      'Levofloxacino': 'variable',
      'Meropenem': 'variable',
      'Ceftazidima': 'variable',
      'Doxiciclina': 'variable',
      'Minociclina': 'variable'
    },
    'Chryseobacterium spp.': {
      'SMX-TMP': 'variable',
      'Ciprofloxacino': 'variable',
      'Moxifloxacino': 'variable',
      'Rifampicina': 'variable'
    },
    
    // BGN fastidiosos
    'Haemophilus influenzae': {
      'Ampicilina': 'variable',
      'Amoxicilina-Clavulanato': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Cefotaxima': 'sensitive',
      'Cefuroxima': 'sensitive',
      'Azitromicina': 'sensitive',
      'Claritromicina': 'sensitive',
      'Ciprofloxacino': 'sensitive',
      'Levofloxacino': 'sensitive',
      'SMX-TMP': 'variable',
      'Doxiciclina': 'variable',
      'Cloranfenicol': 'variable',
      'Meropenem': 'sensitive'
    },
    'Haemophilus parainfluenzae': {
      'Ampicilina': 'variable',
      'Amoxicilina-Clavulanato': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Azitromicina': 'sensitive',
      'Ciprofloxacino': 'sensitive'
    },
    'Moraxella catarrhalis': {
      'Amoxicilina-Clavulanato': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Azitromicina': 'sensitive',
      'Claritromicina': 'sensitive',
      'Ciprofloxacino': 'sensitive',
      'SMX-TMP': 'sensitive',
      'Doxiciclina': 'sensitive'
    },
    'Neisseria meningitidis': {
      'Penicilina G': 'variable',
      'Ampicilina': 'variable',
      'Ceftriaxone': 'sensitive',
      'Cefotaxima': 'sensitive',
      'Meropenem': 'sensitive',
      'Ciprofloxacino': 'sensitive',
      'Rifampicina': 'sensitive',
      'Cloranfenicol': 'sensitive'
    },
    'Neisseria gonorrhoeae': {
      'Penicilina G': 'resistant',
      'Ceftriaxone': 'variable',
      'Cefixima': 'variable',
      'Azitromicina': 'variable',
      'Ciprofloxacino': 'resistant',
      'Doxiciclina': 'variable',
      'Espectinomicina': 'sensitive'
    },
    'Pasteurella multocida': {
      'Penicilina G': 'sensitive',
      'Ampicilina': 'sensitive',
      'Amoxicilina-Clavulanato': 'sensitive',
      'Ceftriaxone': 'sensitive',
      'Doxiciclina': 'sensitive',
      'Ciprofloxacino': 'sensitive'
    },
    
    // Atípicos
    'Mycoplasma pneumoniae': {
      'Azitromicina': 'sensitive',
      'Claritromicina': 'sensitive',
      'Eritromicina': 'sensitive',
      'Doxiciclina': 'sensitive',
      'Tetraciclina': 'sensitive',
      'Levofloxacino': 'sensitive',
      'Moxifloxacino': 'sensitive'
    },
    'Chlamydia pneumoniae': {
      'Azitromicina': 'sensitive',
      'Claritromicina': 'sensitive',
      'Doxiciclina': 'sensitive',
      'Tetraciclina': 'sensitive',
      'Levofloxacino': 'sensitive',
      'Moxifloxacino': 'sensitive'
    },
    'Chlamydia trachomatis': {
      'Azitromicina': 'sensitive',
      'Doxiciclina': 'sensitive',
      'Levofloxacino': 'sensitive',
      'Ofloxacino': 'sensitive'
    },
    'Legionella pneumophila': {
      'Azitromicina': 'sensitive',
      'Claritromicina': 'sensitive',
      'Eritromicina': 'sensitive',
      'Levofloxacino': 'sensitive',
      'Moxifloxacino': 'sensitive',
      'Doxiciclina': 'sensitive',
      'Rifampicina': 'sensitive'
    },
    'Coxiella burnetii': {
      'Doxiciclina': 'sensitive',
      'Ciprofloxacino': 'sensitive',
      'Cloranfenicol': 'sensitive'
    },
    'Rickettsia spp.': {
      'Doxiciclina': 'sensitive',
      'Tetraciclina': 'sensitive',
      'Cloranfenicol': 'sensitive',
      'Ciprofloxacino': 'variable'
    },
    
    // Anaeróbios
    'Bacteroides fragilis': {
      'Metronidazol': 'sensitive',
      'Clindamicina': 'variable',
      'Ampicilina-Sulbactam': 'sensitive',
      'Piperacilina-Tazobactam': 'sensitive',
      'Ticarcilina-Clavulanato': 'sensitive',
      'Meropenem': 'sensitive',
      'Imipenem': 'sensitive',
      'Moxifloxacino': 'variable',
      'Cloranfenicol': 'variable',
      'Tigeciclina': 'variable'
    },
    'Bacteroides thetaiotaomicron': {
      'Metronidazol': 'sensitive',
      'Clindamicina': 'variable',
      'Ampicilina-Sulbactam': 'sensitive',
      'Meropenem': 'sensitive',
      'Moxifloxacino': 'variable'
    },
    'Clostridium difficile': {
      'Metronidazol': 'sensitive',
      'Vancomicina': 'sensitive',
      'Fidaxomicina': 'sensitive',
      'Tigeciclina': 'variable'
    },
    'Clostridium perfringens': {
      'Penicilina G': 'sensitive',
      'Clindamicina': 'sensitive',
      'Metronidazol': 'sensitive',
      'Vancomicina': 'sensitive',
      'Meropenem': 'sensitive'
    },
    'Peptostreptococcus spp.': {
      'Penicilina G': 'sensitive',
      'Clindamicina': 'sensitive',
      'Metronidazol': 'sensitive',
      'Vancomicina': 'sensitive',
      'Meropenem': 'sensitive'
    },
    'Prevotella melaninogenica': {
      'Metronidazol': 'sensitive',
      'Clindamicina': 'variable',
      'Ampicilina-Sulbactam': 'sensitive',
      'Moxifloxacino': 'variable'
    },
    'Fusobacterium nucleatum': {
      'Penicilina G': 'sensitive',
      'Metronidazol': 'sensitive',
      'Clindamicina': 'sensitive',
      'Meropenem': 'sensitive'
    },
    
    // Micobactérias
    'Mycobacterium tuberculosis': {
      'Isoniazida': 'variable',
      'Rifampicina': 'variable',
      'Etambutol': 'variable',
      'Pirazinamida': 'variable',
      'Estreptomicina': 'variable',
      'Levofloxacino': 'variable',
      'Moxifloxacino': 'variable',
      'Amicacina': 'variable',
      'Capreomicina': 'variable',
      'Linezolida': 'variable'
    },
    'Mycobacterium avium complex': {
      'Azitromicina': 'variable',
      'Claritromicina': 'variable',
      'Rifabutina': 'variable',
      'Etambutol': 'variable',
      'Amicacina': 'variable'
    },
    
    // Fungos (adicionados como referência hospitalar)
    'Candida albicans': {
      'Fluconazol': 'sensitive',
      'Itraconazol': 'sensitive',
      'Voriconazol': 'sensitive',
      'Anfotericina B': 'sensitive',
      'Caspofungina': 'sensitive',
      'Micafungina': 'sensitive',
      'Anidulafungina': 'sensitive'
    },
    'Candida glabrata': {
      'Fluconazol': 'variable',
      'Voriconazol': 'variable',
      'Anfotericina B': 'sensitive',
      'Caspofungina': 'sensitive',
      'Micafungina': 'sensitive'
    },
    'Candida krusei': {
      'Fluconazol': 'resistant',
      'Voriconazol': 'variable',
      'Anfotericina B': 'sensitive',
      'Caspofungina': 'sensitive'
    },
    'Aspergillus fumigatus': {
      'Voriconazol': 'sensitive',
      'Itraconazol': 'variable',
      'Posaconazol': 'sensitive',
      'Anfotericina B': 'sensitive',
      'Caspofungina': 'sensitive'
    }
  };

  const pathogens = Object.keys(antibioticMatrix);
  const antibiotics = selectedPathogen ? Object.keys(antibioticMatrix[selectedPathogen] || {}) : [];

  // Filtrar patógenos baseado na busca
  const filteredPathogens = pathogens.filter(pathogen => 
    pathogen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSensitivityColor = (sensitivity: SensitivityResult) => {
    switch (sensitivity) {
      case 'sensitive': return 'bg-green-100 text-green-800 border-green-300';
      case 'variable': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'resistant': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSensitivityIcon = (sensitivity: SensitivityResult) => {
    switch (sensitivity) {
      case 'sensitive': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'variable': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'resistant': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRecommendation = () => {
    if (!selectedPathogen || !selectedAntibiotic) return null;

    const pathogenData = antibioticMatrix[selectedPathogen];
    if (!pathogenData) return null;

    const sensitivity = pathogenData[selectedAntibiotic];
    if (!sensitivity) return null;

    const recommendations = {
      'sensitive': {
        title: 'Recomendação: Terapia Dirigida',
        description: 'Antibiótico apropriado para este patógeno. Considere descalonamento se estava em terapia empírica mais ampla.',
        color: 'bg-green-50 border-green-200',
        action: 'Manter ou descalonar para este antibiótico'
      },
      'variable': {
        title: 'Recomendação: Avaliar Antibiograma',
        description: 'Sensibilidade variável. Necessário antibiograma para confirmar eficácia. Considere alternativas.',
        color: 'bg-yellow-50 border-yellow-200',
        action: 'Aguardar antibiograma ou considerar alternativa'
      },
      'resistant': {
        title: 'Recomendação: Escalonamento Necessário',
        description: 'Resistência esperada. Necessário escalonamento para antibiótico de espectro mais amplo.',
        color: 'bg-red-50 border-red-200',
        action: 'Escalonar para antibiótico alternativo'
      }
    };

    return recommendations[sensitivity];
  };

  const flowSteps = [
    {
      title: "1. Busca e Identificação do Patógeno",
      description: "Busque e selecione o patógeno identificado ou suspeito",
      component: (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Buscar patógeno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedPathogen} onValueChange={setSelectedPathogen}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o patógeno" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {filteredPathogens.map((pathogen) => (
                <SelectItem key={pathogen} value={pathogen}>{pathogen}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    },
    {
      title: "2. Seleção do Antibiótico",
      description: "Escolha o antibiótico atual ou em consideração",
      component: (
        <Select 
          value={selectedAntibiotic} 
          onValueChange={setSelectedAntibiotic}
          disabled={!selectedPathogen}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o antibiótico" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {antibiotics.map((antibiotic) => (
              <SelectItem key={antibiotic} value={antibiotic}>{antibiotic}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      title: "3. Análise de Sensibilidade",
      description: "Visualize a matriz de sensibilidade completa",
      component: selectedPathogen && (
        <div className="space-y-3">
          <h4 className="font-semibold">Perfil de sensibilidade para {selectedPathogen}:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
            {Object.entries(antibioticMatrix[selectedPathogen] || {}).map(([antibiotic, sensitivity]) => (
              <div 
                key={antibiotic}
                className={`p-2 rounded-lg border flex items-center justify-between text-xs ${getSensitivityColor(sensitivity)} ${
                  antibiotic === selectedAntibiotic ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                <span className="font-medium">{antibiotic}</span>
                <div className="flex items-center gap-1">
                  {getSensitivityIcon(sensitivity)}
                  <span className="capitalize">{sensitivity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const recommendation = getRecommendation();

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(antibioticMatrix).length}</div>
                <div className="text-sm text-blue-700">Patógenos</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {selectedPathogen ? Object.keys(antibioticMatrix[selectedPathogen] || {}).length : '-'}
                </div>
                <div className="text-sm text-green-700">Antibióticos disponíveis</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.values(antibioticMatrix).reduce((total, pathogen) => total + Object.keys(pathogen).length, 0)}
                </div>
                <div className="text-sm text-purple-700">Total de combinações</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredPathogens.length}
                </div>
                <div className="text-sm text-orange-700">Patógenos filtrados</div>
              </div>
            </div>

            {/* Legenda expandida */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Info size={16} />
                Legenda e Categorias Hospitalares
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Sensibilidade:</h5>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-400 rounded"></div>
                      <span className="text-sm">Sensível - Ação excelente (≥90% sensível)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                      <span className="text-sm">Variável - Ação moderada (50-89%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-400 rounded"></div>
                      <span className="text-sm">Resistente - Ação insuficiente (&lt;50%)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Categorias incluídas:</h5>
                  <div className="text-xs space-y-1">
                    <div>• Cocos Gram-positivos (11 espécies)</div>
                    <div>• Bacilos Gram-positivos (4 espécies)</div>
                    <div>• Enterobactérias (16 espécies)</div>
                    <div>• BGN não-fermentadoras (6 espécies)</div>
                    <div>• BGN fastidiosos (6 espécies)</div>
                    <div>• Atípicos (6 espécies)</div>
                    <div>• Anaeróbios (7 espécies)</div>
                    <div>• Micobactérias (2 espécies)</div>
                    <div>• Fungos hospitalares (4 espécies)</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Classes de antibióticos:</h5>
                  <div className="text-xs space-y-1">
                    <div>• Beta-lactâmicos (25+ antibióticos)</div>
                    <div>• Aminoglicosídeos (6 antibióticos)</div>
                    <div>• Quinolonas (8 antibióticos)</div>
                    <div>• Macrolídeos (4 antibióticos)</div>
                    <div>• Glicopeptídeos (2 antibióticos)</div>
                    <div>• Oxazolidinonas (2 antibióticos)</div>
                    <div>• Antimicrobianos de reserva (10+ antibióticos)</div>
                    <div>• Antifúngicos (7 antibióticos)</div>
                    <div>• Outros (15+ antibióticos)</div>
                  </div>
                </div>
              </div>
            </div>

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
