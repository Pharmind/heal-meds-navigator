
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InstructionsCard = () => {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800">Como Usar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-green-700">
          <p>• <strong>Preenchimento obrigatório:</strong> Unidade, antimicrobiano, dose diária e número de pacientes</p>
          <p>• <strong>Salvamento automático:</strong> Os dados são salvos automaticamente 2 segundos após parar de digitar</p>
          <p>• <strong>Cálculos automáticos:</strong> Consumo e cobertura são calculados em tempo real</p>
          <p>• <strong>Alertas:</strong> Sistema indica quando o estoque é insuficiente para o tratamento completo</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionsCard;
