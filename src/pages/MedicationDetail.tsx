
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, AlertTriangle, Pill, Droplets, Clock, FileText } from 'lucide-react';
import { medications } from '../data/healData';
import { Medication } from '../types/heal';

const MedicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const medication = medications.find(med => med.id === id);

  if (!medication) {
    return (
      <div className="min-h-screen bg-heal-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Medicamento não encontrado</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-heal-green-600 text-white px-6 py-2 rounded-lg hover:bg-heal-green-700 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const InfoSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-md border border-heal-green-200 p-6">
      <h3 className="flex items-center text-lg font-semibold text-heal-green-800 mb-4">
        <Icon className="mr-2" size={20} />
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-heal-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-heal-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-heal-green-600 hover:text-heal-green-800 transition-colors mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Voltar à pesquisa
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <span className="bg-heal-green-100 text-heal-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {medication.mvCode}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{medication.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{medication.presentation}</p>
              <p className="text-heal-green-600 font-medium mt-1">{medication.therapeuticClass}</p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-1" size={16} />
              Atualizado em {medication.lastUpdate}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Indicação */}
          <InfoSection title="Indicação" icon={Pill}>
            <p className="text-gray-700">{medication.indication}</p>
          </InfoSection>

          {/* Doses */}
          <InfoSection title="Posologia" icon={Droplets}>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-800">Dose Adulto:</h4>
                <p className="text-gray-700">{medication.dose.adult}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Dose Pediátrica:</h4>
                <p className="text-gray-700">{medication.dose.pediatric}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Dose Máxima:</h4>
                <p className="text-gray-700">{medication.dose.maximum}</p>
              </div>
            </div>
          </InfoSection>

          {/* Ajuste de Dose */}
          <InfoSection title="Ajuste de Dose" icon={AlertTriangle}>
            <p className="text-gray-700">{medication.doseAdjustment}</p>
          </InfoSection>

          {/* Via de Administração */}
          <InfoSection title="Via de Administração" icon={Droplets}>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-800">Via:</h4>
                <p className="text-gray-700">{medication.administrationRoute}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Fotossensível:</h4>
                <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                  medication.photosensitive 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {medication.photosensitive ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>
          </InfoSection>

          {/* Preparo/Diluição */}
          <div className="lg:col-span-2">
            <InfoSection title="Preparo e Diluição" icon={FileText}>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Reconstituição:</h4>
                  <p className="text-gray-700">{medication.preparation.reconstitution}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Diluição:</h4>
                  <p className="text-gray-700">{medication.preparation.dilution}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Padrão HEAL:</h4>
                  <p className="text-gray-700">{medication.preparation.healStandard}</p>
                </div>
              </div>
            </InfoSection>
          </div>

          {/* Estabilidade */}
          <InfoSection title="Estabilidade e Conservação" icon={Clock}>
            <p className="text-gray-700">{medication.stability}</p>
          </InfoSection>

          {/* Observações */}
          <InfoSection title="Observações" icon={AlertTriangle}>
            <p className="text-gray-700">{medication.observation}</p>
          </InfoSection>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-heal-green-600 text-white px-8 py-3 rounded-lg hover:bg-heal-green-700 transition-colors font-medium"
          >
            Voltar à Pesquisa
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail;
