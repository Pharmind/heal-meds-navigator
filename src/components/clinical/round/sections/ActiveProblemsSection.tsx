
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { RoundFormData } from '@/types/multiprofessionalRound';

interface ActiveProblemsSectionProps {
  formData: RoundFormData;
  updateFormData: (field: string, value: any) => void;
}

export const ActiveProblemsSection: React.FC<ActiveProblemsSectionProps> = ({
  formData,
  updateFormData
}) => {
  const problems = formData.active_problems || [];

  const addProblem = () => {
    if (problems.length < 5) {
      const newProblems = [...problems, {
        problem_description: '',
        expected_result: '',
        status: null,
        observations: ''
      }];
      updateFormData('active_problems', newProblems);
    }
  };

  const removeProblem = (index: number) => {
    const newProblems = problems.filter((_, i) => i !== index);
    updateFormData('active_problems', newProblems);
  };

  const updateProblem = (index: number, field: string, value: any) => {
    const newProblems = [...problems];
    newProblems[index] = { ...newProblems[index], [field]: value };
    updateFormData('active_problems', newProblems);
  };

  return (
    <Card>
      <CardHeader className="bg-red-50">
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertCircle size={20} />
          Seção 6 - Problemas Ativos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {problems.map((problem: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Problema {index + 1}</Label>
                <Button
                  onClick={() => removeProblem(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Descrição do Problema:</Label>
                  <Textarea
                    value={problem.problem_description}
                    onChange={(e) => updateProblem(index, 'problem_description', e.target.value)}
                    placeholder="Descreva o problema..."
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Resultado Esperado:</Label>
                  <Textarea
                    value={problem.expected_result}
                    onChange={(e) => updateProblem(index, 'expected_result', e.target.value)}
                    placeholder="Resultado esperado..."
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Status:</Label>
                <RadioGroup
                  value={problem.status || ''}
                  onValueChange={(value) => updateProblem(index, 'status', value)}
                  className="flex flex-wrap gap-4"
                >
                  {['Atingido', 'Não atingido', 'Suspenso', 'Em andamento'].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <RadioGroupItem value={status} id={`status_${index}_${status}`} />
                      <Label htmlFor={`status_${index}_${status}`} className="text-sm">{status}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Observações:</Label>
                <Textarea
                  value={problem.observations}
                  onChange={(e) => updateProblem(index, 'observations', e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={2}
                />
              </div>
            </div>
          ))}
          
          {problems.length < 5 && (
            <Button onClick={addProblem} variant="outline" className="w-full">
              <Plus size={16} className="mr-2" />
              Adicionar Problema ({problems.length}/5)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
