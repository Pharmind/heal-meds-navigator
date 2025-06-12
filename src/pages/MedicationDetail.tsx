
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, AlertTriangle, Pill } from 'lucide-react';
import { useMedication } from '../hooks/useSupabaseData';

const MedicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: medication, isLoading, error } = useMedication(id || '');

  // Função para formatar texto - quebra por pontos e vírgulas
  const formatText = (text: string) => {
    if (!text) return '';
    
    // Quebra por pontos seguidos de espaço ou fim de string, mantendo o ponto
    const sentences = text.split(/(?<=\.)\s+/);
    
    return sentences.map((sentence, index) => {
      const trimmed = sentence.trim();
      if (!trimmed) return null;
      
      // Se a sentença contém vírgulas, pode quebrar em itens
      if (trimmed.includes(',') && trimmed.length > 100) {
        const parts = trimmed.split(',').map(part => part.trim()).filter(Boolean);
        if (parts.length > 2) {
          return (
            <div key={index} className="mb-3">
              <p className="mb-2">{parts[0]}:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {parts.slice(1).map((part, partIndex) => (
                  <li key={partIndex} className="text-gray-700">
                    {part.replace(/\.$/, '')}
                  </li>
                ))}
              </ul>
            </div>
          );
        }
      }
      
      return (
        <p key={index} className="mb-3 leading-relaxed">
          {trimmed}
        </p>
      );
    }).filter(Boolean);
  };

  // Função para formatar dose com melhor estrutura
  const formatDoseInfo = (dose: any) => {
    return (
      <div className="space-y-3">
        {dose.adult && (
          <div className="border-l-4 border-heal-green-300 pl-4">
            <span className="font-semibold text-heal-green-800 block mb-1">Dose Adulto:</span>
            <div className="text-gray-700">{formatText(dose.adult)}</div>
          </div>
        )}
        {dose.pediatric && (
          <div className="border-l-4 border-blue-300 pl-4">
            <span className="font-semibold text-blue-800 block mb-1">Dose Pediátrica:</span>
            <div className="text-gray-700">{formatText(dose.pediatric)}</div>
          </div>
        )}
        {dose.maximum && (
          <div className="border-l-4 border-red-300 pl-4">
            <span className="font-semibold text-red-800 block mb-1">Dose Máxima:</span>
            <div className="text-gray-700">{formatText(dose.maximum)}</div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-heal-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-heal-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Pill className="text-heal-green-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-700">Carregando medicamento...</h3>
        </div>
      </div>
    );
  }

  if (error || !medication) {
    return (
      <div className="min-h-screen bg-heal-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Medicamento não encontrado</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-heal-green-600 text-white px-4 py-2 rounded-lg hover:bg-heal-green-700 transition-colors"
          >
            Voltar à pesquisa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-heal-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-heal-green-600 hover:text-heal-green-800 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para pesquisa
          </button>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border border-heal-green-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="bg-heal-green-100 text-heal-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {medication.mvCode}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-1" />
                Atualizado em: {medication.lastUpdate}
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-heal-green-800 mb-2">
              {medication.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {medication.presentation}
            </p>
            <div className="inline-block bg-heal-green-50 text-heal-green-700 px-3 py-1 rounded-lg text-sm font-medium">
              {medication.therapeuticClass}
            </div>
          </div>
        </div>

        {/* Informações detalhadas */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Indicação */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-4 border-b border-heal-green-100 pb-2">
              Indicação
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {formatText(medication.indication)}
            </div>
          </div>

          {/* Posologia */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-4 border-b border-heal-green-100 pb-2">
              Posologia
            </h2>
            {formatDoseInfo(medication.dose)}
          </div>

          {/* Ajuste de dose */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-4 border-b border-heal-green-100 pb-2">
              Ajuste de Dose
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {formatText(medication.doseAdjustment)}
            </div>
          </div>

          {/* Via de administração */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-4 border-b border-heal-green-100 pb-2">
              Via de Administração
            </h2>
            <div className="text-gray-700 leading-relaxed mb-3">
              {formatText(medication.administrationRoute)}
            </div>
            {medication.photosensitive && (
              <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                <span className="text-sm font-medium">Medicamento fotossensível</span>
              </div>
            )}
          </div>

          {/* Preparo/Diluição - span full width */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200 lg:col-span-2">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-4 border-b border-heal-green-100 pb-2">
              Preparo e Diluição
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-heal-green-500 rounded-full mr-2"></span>
                  Reconstituição
                </h3>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {formatText(medication.preparation.reconstitution)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Diluição
                </h3>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {formatText(medication.preparation.dilution)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Padrão HEAL
                </h3>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {formatText(medication.preparation.healStandard)}
                </div>
              </div>
            </div>
          </div>

          {/* Estabilidade */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-4 border-b border-heal-green-100 pb-2">
              Estabilidade/Conservação
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {formatText(medication.stability)}
            </div>
          </div>

          {/* Observações */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-4 border-b border-heal-green-100 pb-2">
              Observações
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {formatText(medication.observation)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail;
