
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Heart, Activity, Zap, User, Baby, Pill } from 'lucide-react';
import BMICalculator from './calculators/BMICalculator';
import CreatinineCalculator from './calculators/CreatinineCalculator';
import HeartRiskCalculator from './calculators/HeartRiskCalculator';
import DosageCalculator from './calculators/DosageCalculator';
import PediatricCalculator from './calculators/PediatricCalculator';
import ApgarCalculator from './calculators/ApgarCalculator';
import GlasgowCalculator from './calculators/GlasgowCalculator';

type CalculatorType = 'bmi' | 'creatinine' | 'heart-risk' | 'dosage' | 'pediatric' | 'apgar' | 'glasgow' | null;

const MedicalCalculators = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>(null);

  const calculators = [
    {
      id: 'bmi' as const,
      title: 'Índice de Massa Corporal (IMC)',
      description: 'Calcule o IMC e classifique o estado nutricional',
      icon: User,
      color: 'bg-blue-500'
    },
    {
      id: 'creatinine' as const,
      title: 'Clearance de Creatinina',
      description: 'Calcule a função renal através do clearance de creatinina',
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      id: 'heart-risk' as const,
      title: 'Risco Cardiovascular',
      description: 'Avalie o risco cardiovascular em 10 anos',
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      id: 'dosage' as const,
      title: 'Cálculo de Dosagem',
      description: 'Calcule dosagens medicamentosas por peso',
      icon: Pill,
      color: 'bg-purple-500'
    },
    {
      id: 'pediatric' as const,
      title: 'Calculadora Pediátrica',
      description: 'Cálculos específicos para pediatria',
      icon: Baby,
      color: 'bg-pink-500'
    },
    {
      id: 'apgar' as const,
      title: 'Escala de Apgar',
      description: 'Avaliação de recém-nascidos',
      icon: Baby,
      color: 'bg-orange-500'
    },
    {
      id: 'glasgow' as const,
      title: 'Escala de Glasgow',
      description: 'Avaliação do nível de consciência',
      icon: Zap,
      color: 'bg-indigo-500'
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calculadoras Médicas</h1>
          <p className="text-gray-600">Ferramentas de cálculo para apoio à prática clínica</p>
        </div>
        <Calculator className="h-8 w-8 text-blue-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => {
          const Icon = calc.icon;
          return (
            <Card key={calc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${calc.color} text-white`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{calc.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{calc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setActiveCalculator(calc.id)}
                  className="w-full"
                  variant="outline"
                >
                  Abrir Calculadora
                </Button>
              </CardContent>
            </Card>
          );
        })}
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
                ser interpretados no contexto clínico adequado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalCalculators;
