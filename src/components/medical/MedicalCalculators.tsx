
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Heart, Activity, Zap, User, Baby, Pill, Droplets, Clock, Scale, FlaskConical, Syringe } from 'lucide-react';
import BMICalculator from './calculators/BMICalculator';
import CreatinineCalculator from './calculators/CreatinineCalculator';
import HeartRiskCalculator from './calculators/HeartRiskCalculator';
import DosageCalculator from './calculators/DosageCalculator';
import PediatricCalculator from './calculators/PediatricCalculator';
import ApgarCalculator from './calculators/ApgarCalculator';
import GlasgowCalculator from './calculators/GlasgowCalculator';
import UnitConverterCalculator from './calculators/UnitConverterCalculator';
import InfusionRateCalculator from './calculators/InfusionRateCalculator';
import ConcentrationCalculator from './calculators/ConcentrationCalculator';
import AllometricDosageCalculator from './calculators/AllometricDosageCalculator';

type CalculatorType = 'bmi' | 'creatinine' | 'heart-risk' | 'dosage' | 'pediatric' | 'apgar' | 'glasgow' | 'unit-converter' | 'infusion-rate' | 'concentration' | 'allometric-dosage' | null;

const MedicalCalculators = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>(null);

  const calculators = [
    {
      id: 'bmi' as const,
      title: 'Índice de Massa Corporal (IMC)',
      description: 'Calcule o IMC e classifique o estado nutricional',
      icon: User,
      color: 'bg-blue-500',
      category: 'Clínico'
    },
    {
      id: 'creatinine' as const,
      title: 'Clearance de Creatinina',
      description: 'Calcule a função renal através do clearance de creatinina',
      icon: Activity,
      color: 'bg-green-500',
      category: 'Clínico'
    },
    {
      id: 'heart-risk' as const,
      title: 'Risco Cardiovascular',
      description: 'Avalie o risco cardiovascular em 10 anos',
      icon: Heart,
      color: 'bg-red-500',
      category: 'Clínico'
    },
    {
      id: 'dosage' as const,
      title: 'Cálculo de Dosagem',
      description: 'Calcule dosagens medicamentosas por peso',
      icon: Pill,
      color: 'bg-purple-500',
      category: 'Farmacêutico'
    },
    {
      id: 'pediatric' as const,
      title: 'Calculadora Pediátrica',
      description: 'Cálculos específicos para pediatria',
      icon: Baby,
      color: 'bg-pink-500',
      category: 'Farmacêutico'
    },
    {
      id: 'unit-converter' as const,
      title: 'Conversor de Unidades',
      description: 'Converta unidades farmacêuticas (mg, g, mL, etc.)',
      icon: Scale,
      color: 'bg-yellow-500',
      category: 'Farmacêutico'
    },
    {
      id: 'infusion-rate' as const,
      title: 'Taxa de Infusão',
      description: 'Calcule velocidade de gotejamento e tempo de infusão',
      icon: Droplets,
      color: 'bg-cyan-500',
      category: 'Farmacêutico'
    },
    {
      id: 'concentration' as const,
      title: 'Concentração e Diluição',
      description: 'Calcule concentrações e prepare diluições',
      icon: FlaskConical,
      color: 'bg-emerald-500',
      category: 'Farmacêutico'
    },
    {
      id: 'allometric-dosage' as const,
      title: 'Dosagem Alométrica',
      description: 'Cálculo de doses baseado em superfície corporal',
      icon: Syringe,
      color: 'bg-violet-500',
      category: 'Farmacêutico'
    },
    {
      id: 'apgar' as const,
      title: 'Escala de Apgar',
      description: 'Avaliação de recém-nascidos',
      icon: Baby,
      color: 'bg-orange-500',
      category: 'Clínico'
    },
    {
      id: 'glasgow' as const,
      title: 'Escala de Glasgow',
      description: 'Avaliação do nível de consciência',
      icon: Zap,
      color: 'bg-indigo-500',
      category: 'Clínico'
    }
  ];

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'bmi':
        return <BMICalculator onBack={() => setActiveCalculator(null)} />;
      case 'creatinine':
        return <CreatinineCalculator onBack={() => setActiveCalculator(null)} />;
      case 'heart-risk':
        return <HeartRiskCalculator onBack={() => setActiveCalculator(null)} />;
      case 'dosage':
        return <DosageCalculator onBack={() => setActiveCalculator(null)} />;
      case 'pediatric':
        return <PediatricCalculator onBack={() => setActiveCalculator(null)} />;
      case 'unit-converter':
        return <UnitConverterCalculator onBack={() => setActiveCalculator(null)} />;
      case 'infusion-rate':
        return <InfusionRateCalculator onBack={() => setActiveCalculator(null)} />;
      case 'concentration':
        return <ConcentrationCalculator onBack={() => setActiveCalculator(null)} />;
      case 'allometric-dosage':
        return <AllometricDosageCalculator onBack={() => setActiveCalculator(null)} />;
      case 'apgar':
        return <ApgarCalculator onBack={() => setActiveCalculator(null)} />;
      case 'glasgow':
        return <GlasgowCalculator onBack={() => setActiveCalculator(null)} />;
      default:
        return null;
    }
  };

  if (activeCalculator) {
    return renderCalculator();
  }

  const clinicalCalculators = calculators.filter(calc => calc.category === 'Clínico');
  const pharmaceuticalCalculators = calculators.filter(calc => calc.category === 'Farmacêutico');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calculadoras Médicas</h1>
          <p className="text-gray-600">Ferramentas de cálculo para apoio à prática clínica e farmacêutica</p>
        </div>
        <Calculator className="h-8 w-8 text-blue-600" />
      </div>

      {/* Calculadoras Farmacêuticas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Pill className="h-5 w-5 text-purple-600" />
          Calculadoras Farmacêuticas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pharmaceuticalCalculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Card key={calc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${calc.color} text-white`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{calc.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{calc.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    onClick={() => setActiveCalculator(calc.id)}
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    Abrir Calculadora
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Calculadoras Clínicas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          Calculadoras Clínicas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinicalCalculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Card key={calc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${calc.color} text-white`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{calc.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{calc.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    onClick={() => setActiveCalculator(calc.id)}
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    Abrir Calculadora
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Sobre as Calculadoras</h3>
              <p className="text-sm text-blue-800">
                Todas as calculadoras implementadas seguem diretrizes médicas estabelecidas e 
                são baseadas em fórmulas validadas cientificamente. Os resultados devem sempre 
                ser interpretados no contexto clínico adequado. As calculadoras farmacêuticas 
                auxiliam na preparação e administração segura de medicamentos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalCalculators;
