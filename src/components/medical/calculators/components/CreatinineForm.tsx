
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Race } from '../utils/creatinineUtils';

interface CreatinineFormProps {
  age: string;
  weight: string;
  creatinine: string;
  gender: 'male' | 'female' | '';
  race: Race;
  onAgeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onCreatinineChange: (value: string) => void;
  onGenderChange: (value: 'male' | 'female') => void;
  onRaceChange: (value: Race) => void;
  onCalculate: () => void;
  onClear: () => void;
}

const CreatinineForm = ({
  age,
  weight,
  creatinine,
  gender,
  race,
  onAgeChange,
  onWeightChange,
  onCreatinineChange,
  onGenderChange,
  onRaceChange,
  onCalculate,
  onClear
}: CreatinineFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Paciente</CardTitle>
        <CardDescription>
          Insira os dados para calcular com todas as fórmulas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="age">Idade (anos)</Label>
          <Input
            id="age"
            type="number"
            placeholder="Ex: 65"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="Ex: 70"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
          />
          <p className="text-xs text-gray-500">Necessário apenas para Cockcroft-Gault</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="creatinine">Creatinina sérica (mg/dL)</Label>
          <Input
            id="creatinine"
            type="number"
            step="0.1"
            placeholder="Ex: 1.2"
            value={creatinine}
            onChange={(e) => onCreatinineChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Sexo</Label>
          <Select value={gender} onValueChange={(value: 'male' | 'female') => onGenderChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Feminino</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Raça/Etnia</Label>
          <Select value={race} onValueChange={(value: Race) => onRaceChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a raça" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="white">Branca/Outras</SelectItem>
              <SelectItem value="black">Negra</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Necessário para MDRD e CKD-EPI</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={onCalculate} className="flex-1">
            Calcular Todas
          </Button>
          <Button onClick={onClear} variant="outline">
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatinineForm;
