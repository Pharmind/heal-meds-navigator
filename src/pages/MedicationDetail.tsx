
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, AlertTriangle, Pill } from 'lucide-react';
import { useMedication } from '../hooks/useSupabaseData';

const MedicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: medication, isLoading, error } = useMedication(id || '');

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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Indicação */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-3">Indicação</h2>
            <p className="text-gray-700">{medication.indication}</p>
          </div>

          {/* Posologia */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-3">Posologia</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Adulto:</span>
                <span className="ml-2 text-gray-600">{medication.dose.adult}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Pediátrico:</span>
                <span className="ml-2 text-gray-600">{medication.dose.pediatric}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Dose máxima:</span>
                <span className="ml-2 text-gray-600">{medication.dose.maximum}</span>
              </div>
            </div>
          </div>

          {/* Ajuste de dose */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-3">Ajuste de Dose</h2>
            <p className="text-gray-700">{medication.doseAdjustment}</p>
          </div>

          {/* Via de administração */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-3">Via de Administração</h2>
            <p className="text-gray-700">{medication.administrationRoute}</p>
            {medication.photosensitive && (
              <div className="mt-3 flex items-center text-amber-600">
                <AlertTriangle size={16} className="mr-2" />
                <span className="text-sm font-medium">Medicamento fotossensível</span>
              </div>
            )}
          </div>

          {/* Preparo/Diluição */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200 md:col-span-2">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-3">Preparo e Diluição</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Reconstituição</h3>
                <p className="text-gray-600 text-sm">{medication.preparation.reconstitution}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Diluição</h3>
                <p className="text-gray-600 text-sm">{medication.preparation.dilution}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Padrão HEAL</h3>
                <p className="text-gray-600 text-sm">{medication.preparation.healStandard}</p>
              </div>
            </div>
          </div>

          {/* Estabilidade */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-3">Estabilidade/Conservação</h2>
            <p className="text-gray-700">{medication.stability}</p>
          </div>

          {/* Observações */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-heal-green-200">
            <h2 className="text-xl font-semibold text-heal-green-800 mb-3">Observações</h2>
            <p className="text-gray-700">{medication.observation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail;
