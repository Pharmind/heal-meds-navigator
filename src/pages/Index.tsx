
import { useState, useEffect } from 'react';
import { Medication, Material, Diet } from '../types/heal';
import SearchBox from '@/components/SearchBox';
import SearchResults from '@/components/SearchResults';
import CategoryTable from '@/components/CategoryTable';
import AppSidebar from '@/components/AppSidebar';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import ClinicalPharmacy from '@/components/ClinicalPharmacy';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [selectedSection, setSelectedSection] = useState<
    'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines'
  >('search');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { medications, materials, diets } = useSupabaseData();

  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [filteredDiets, setFilteredDiets] = useState<Diet[]>([]);

  useEffect(() => {
    const filterData = () => {
      const filteredMedications = medications.filter((medication) =>
        medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.mvCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.therapeuticClass.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredMaterials = materials.filter((material) =>
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.mvCode.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredDiets = diets.filter((diet) =>
        diet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diet.mvCode.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredMedications(filteredMedications);
      setFilteredMaterials(filteredMaterials);
      setFilteredDiets(filteredDiets);
    };

    filterData();
  }, [searchQuery, medications, materials, diets]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMedicationClick = (medication: Medication) => {
    navigate(`/medication/${medication.id}`);
  };

  const handleSectionChange = (section:
    'search' |
    'medications' |
    'materials' |
    'diets' |
    'intoxication' |
    'high-alert' |
    'elderly' |
    'pharmacovigilance' |
    'cft' |
    'protocols' |
    'pictogram' |
    'discharge-guidelines'
  ) => {
    setSelectedSection(section);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'search':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-4xl font-bold text-heal-green-800 mb-4">
                Guia Farmacêutico HEAL
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Hospital Estadual de Águas Lindas de Goiás
              </p>
              <SearchBox onSearch={handleSearch} />
            </div>
            <SearchResults
              medications={filteredMedications}
              materials={filteredMaterials}
              diets={filteredDiets}
              onMedicationClick={handleMedicationClick}
              searchQuery={searchQuery}
            />
          </div>
        );

      case 'medications':
        return (
          <CategoryTable
            category="medications"
            medications={medications}
            materials={materials}
            diets={diets}
            onMedicationClick={handleMedicationClick}
          />
        );

      case 'materials':
        return (
          <CategoryTable
            category="materials"
            medications={medications}
            materials={materials}
            diets={diets}
            onMedicationClick={handleMedicationClick}
          />
        );

      case 'diets':
        return (
          <CategoryTable
            category="diets"
            medications={medications}
            materials={materials}
            diets={diets}
            onMedicationClick={handleMedicationClick}
          />
        );

      case 'intoxication':
      case 'high-alert':
      case 'elderly':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">Seção em desenvolvimento</h2>
            <p className="text-gray-500 mt-2">Esta funcionalidade será implementada em breve.</p>
          </div>
        );

      case 'pharmacovigilance':
      case 'cft':
      case 'protocols':
      case 'pictogram':
      case 'discharge-guidelines':
        return <ClinicalPharmacy activeTab={selectedSection} />;

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">Seção não encontrada</h2>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar onSectionChange={handleSectionChange} selectedSection={selectedSection} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
