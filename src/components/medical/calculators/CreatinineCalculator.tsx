
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity } from 'lucide-react';
import CreatinineForm from './components/CreatinineForm';
import CreatinineResults from './components/CreatinineResults';
import CreatinineInfo from './components/CreatinineInfo';
import { calculateAllFormulas, FormulaResult, Race } from './utils/creatinineUtils';

interface CreatinineCalculatorProps {
  onBack: () => void;
}

const CreatinineCalculator = ({ onBack }: CreatinineCalculatorProps) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [race, setRace] = useState<Race>('');
  const [results, setResults] = useState<FormulaResult[] | null>(null);

  const handleCalculate = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const creatinineNum = parseFloat(creatinine);

    if (ageNum <= 0 || creatinineNum <= 0 || !gender) {
      return;
    }

    const formulaResults = calculateAllFormulas(ageNum, weightNum, creatinineNum, gender, race);
    setResults(formulaResults);
  };

  const clearForm = () => {
    setAge('');
    setWeight('');
    setCreatinine('');
    setGender('');
    setRace('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500 text-white">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clearance de Creatinina</h1>
            <p className="text-gray-600">Comparação entre múltiplas fórmulas para cálculo da função renal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CreatinineForm
          age={age}
          weight={weight}
          creatinine={creatinine}
          gender={gender}
          race={race}
          onAgeChange={setAge}
          onWeightChange={setWeight}
          onCreatinineChange={setCreatinine}
          onGenderChange={setGender}
          onRaceChange={setRace}
          onCalculate={handleCalculate}
          onClear={clearForm}
        />

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Comparativos</CardTitle>
              <CardDescription>
                Clearance de creatinina calculado por diferentes fórmulas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <CreatinineResults results={results} />
                  <CreatinineInfo race={race} />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Preencha os dados para ver os resultados de todas as fórmulas
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatinineCalculator;
