
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Users, UserCheck } from 'lucide-react';
import { useRoundPrint } from '@/hooks/useRoundPrint';
import { MultiprofessionalRound } from '@/types/multiprofessionalRound';

interface RoundPrintOptionsProps {
  rounds: MultiprofessionalRound[];
}

export const RoundPrintOptions: React.FC<RoundPrintOptionsProps> = ({ rounds }) => {
  const { printBySector, printByPatient, generatePrintData } = useRoundPrint(rounds);
  const data = generatePrintData();

  const sectorsCount = Object.keys(data.bySector).length;
  const patientsCount = Object.keys(data.byPatient).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer size={20} />
          Opções de Impressão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={printBySector}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
            disabled={rounds.length === 0}
          >
            <Users size={24} />
            <div className="text-center">
              <div className="font-medium">Imprimir por Setor</div>
              <div className="text-sm text-gray-500">
                {sectorsCount} {sectorsCount === 1 ? 'setor' : 'setores'} • {rounds.length} rounds
              </div>
            </div>
          </Button>

          <Button 
            onClick={printByPatient}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
            disabled={rounds.length === 0}
          >
            <UserCheck size={24} />
            <div className="text-center">
              <div className="font-medium">Imprimir por Paciente</div>
              <div className="text-sm text-gray-500">
                {patientsCount} {patientsCount === 1 ? 'paciente' : 'pacientes'} • {rounds.length} rounds
              </div>
            </div>
          </Button>
        </div>
        
        {rounds.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            Nenhum round disponível para impressão
          </p>
        )}
      </CardContent>
    </Card>
  );
};
