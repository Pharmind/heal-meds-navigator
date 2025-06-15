
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Medication } from '@/types/heal';
import SearchBox from '@/components/SearchBox';
import SearchResults from '@/components/SearchResults';
import CategoryTable from '@/components/CategoryTable';
import ClinicalPharmacy from '@/components/ClinicalPharmacy';
import IntoxicationSection from '@/components/clinical/IntoxicationSection';
import HighAlertSection from '@/components/clinical/HighAlertSection';
import ElderlySection from '@/components/clinical/ElderlySection';
import SequentialTherapySection from '@/components/clinical/SequentialTherapySection';
import MultiprofessionalRound from '@/components/clinical/MultiprofessionalRound';
import RoundReportsSection from '@/components/clinical/RoundReportsSection';
import MedicalCalculators from '@/components/medical/MedicalCalculators';
import UserManagement from '@/components/UserManagement';
import ProtectedRoute from '@/components/ProtectedRoute';

type Section = 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation' | 'therapeutic-alternatives' | 'multiprofessional-round' | 'round-reports' | 'calculator' | 'user-management';

interface ContentRendererProps {
  selectedSection: Section;
  searchQuery: string;
  medications: Medication[];
  materials: any[];
  diets: any[];
  onSearch: (query: string) => void;
}

const ContentRenderer = ({
  selectedSection,
  searchQuery,
  medications,
  materials,
  diets,
  onSearch
}: ContentRendererProps) => {
  const { isFarmaceutico } = useAuth();
  const navigate = useNavigate();

  const handleMedicationClick = (medication: Medication) => {
    navigate(`/medication/${medication.id}`);
  };

  const sectionComponents = {
    'search': (
      <>
        <SearchBox onSearch={onSearch} />
        <SearchResults
          medications={medications}
          materials={materials}
          diets={diets}
          onMedicationClick={handleMedicationClick}
          searchQuery={searchQuery}
        />
      </>
    ),
    'medications': (
      <CategoryTable 
        category="medications" 
        medications={medications}
        materials={materials}
        diets={diets}
        onMedicationClick={handleMedicationClick} 
      />
    ),
    'materials': (
      <CategoryTable 
        category="materials" 
        medications={medications}
        materials={materials}
        diets={diets}
        onMedicationClick={handleMedicationClick}
      />
    ),
    'diets': (
      <CategoryTable 
        category="diets" 
        medications={medications}
        materials={materials}
        diets={diets}
        onMedicationClick={handleMedicationClick}
      />
    ),
    'intoxication': <IntoxicationSection />,
    'high-alert': <HighAlertSection />,
    'elderly': <ElderlySection />,
    'sequential-therapy': <SequentialTherapySection />,
    'pharmacovigilance': <ClinicalPharmacy activeTab="pharmacovigilance" />,
    'cft': <ClinicalPharmacy activeTab="cft" />,
    'protocols': <ClinicalPharmacy activeTab="protocols" />,
    'pictogram': <ClinicalPharmacy activeTab="pictogram" />,
    'discharge-guidelines': <ClinicalPharmacy activeTab="discharge-guidelines" />,
    'drug-interactions': <ClinicalPharmacy activeTab="drug-interactions" />,
    'treatment-estimation': <ClinicalPharmacy activeTab="treatment-estimation" />,
    'therapeutic-alternatives': <ClinicalPharmacy activeTab="therapeutic-alternatives" />,
    'multiprofessional-round': <MultiprofessionalRound />,
    'round-reports': <RoundReportsSection />,
    'calculator': <MedicalCalculators />,
    'user-management': <UserManagement />
  };

  const component = sectionComponents[selectedSection];
  
  if (!component) {
    return <div>Seção não implementada ainda.</div>;
  }

  // Se a seção é gerenciamento de usuários, só farmacêuticos podem acessar
  if (selectedSection === 'user-management') {
    if (!isFarmaceutico) {
      return (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Apenas farmacêuticos podem gerenciar usuários.</p>
        </div>
      );
    }
    return component;
  }

  // Se a seção requer permissão específica, envolver com ProtectedRoute
  if (selectedSection !== 'search') {
    return (
      <ProtectedRoute requiredModule={selectedSection}>
        {component}
      </ProtectedRoute>
    );
  }

  return component;
};

export default ContentRenderer;
