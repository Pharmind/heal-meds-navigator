
import React from 'react';
import { Race } from '../utils/creatinineUtils';

interface CreatinineInfoProps {
  race: Race;
}

const CreatinineInfo = ({ race }: CreatinineInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Classificação KDIGO:</h4>
          <div className="text-sm space-y-1">
            <div>≥ 90 mL/min/1,73m²: Normal ou elevada (G1)</div>
            <div>60-89 mL/min/1,73m²: Diminuição leve (G2)</div>
            <div>45-59 mL/min/1,73m²: Diminuição leve a moderada (G3a)</div>
            <div>30-44 mL/min/1,73m²: Diminuição moderada a grave (G3b)</div>
            <div>15-29 mL/min/1,73m²: Diminuição grave (G4)</div>
            <div>&lt; 15 mL/min/1,73m²: Falência renal (G5)</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Sobre as Fórmulas:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Cockcroft-Gault:</strong> Estima clearance, necessita peso</p>
            <p><strong>MDRD:</strong> Mais precisa, não necessita peso</p>
            <p><strong>CKD-EPI:</strong> Mais precisa em TFG normal/elevada</p>
          </div>
        </div>
      </div>

      {race === '' && (
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Atenção:</strong> Para cálculos mais precisos com MDRD e CKD-EPI, 
            recomenda-se informar a raça/etnia do paciente.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatinineInfo;
