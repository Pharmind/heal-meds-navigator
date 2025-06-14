import { useState, useEffect } from 'react';
import { Medication, Material, Diet } from '../types/heal';
import SearchBox from '@/components/SearchBox';
import SearchResults from '@/components/SearchResults';
import CategoryTable from '@/components/CategoryTable';
import AppSidebar from '@/components/AppSidebar';
import { useAllData } from '@/hooks/useSupabaseData';
import ClinicalPharmacy from '@/components/ClinicalPharmacy';
import IntoxicationSection from '@/components/clinical/IntoxicationSection';
import HighAlertSection from '@/components/clinical/HighAlertSection';
import ElderlySection from '@/components/clinical/ElderlySection';
import SequentialTherapySection from '@/components/clinical/SequentialTherapySection';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { intelligentSearch, calculateRelevanceScore } from '@/utils/searchUtils';

const Index = () => {
  const [selectedSection, setSelectedSection] = useState<
    'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions'
  >('search');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { medications, materials, diets } = useAllData();

  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [filteredDiets, setFilteredDiets] = useState<Diet[]>([]);

  // Always reset to 'search' section when component mounts or remounts
  useEffect(() => {
    setSelectedSection('search');
    setSearchQuery('');
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (!searchQuery.trim()) {
        setFilteredMedications([]);
        setFilteredMaterials([]);
        setFilteredDiets([]);
        return;
      }

      // Filtrar medicamentos com busca inteligente
      const filteredMedications = medications
        .filter((medication) => {
          return intelligentSearch(searchQuery, medication.name) ||
                 intelligentSearch(searchQuery, medication.mvCode) ||
                 intelligentSearch(searchQuery, medication.therapeuticClass) ||
                 intelligentSearch(searchQuery, medication.indication);
        })
        .map((medication) => ({
          ...medication,
          relevanceScore: Math.max(
            calculateRelevanceScore(searchQuery, medication.name),
            calculateRelevanceScore(searchQuery, medication.mvCode),
            calculateRelevanceScore(searchQuery, medication.therapeuticClass),
            calculateRelevanceScore(searchQuery, medication.indication)
          )
        }))
        .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore)
        .map(({ relevanceScore, ...medication }) => medication as Medication);

      // Filtrar materiais com busca inteligente
      const filteredMaterials = materials
        .filter((material) => {
          return intelligentSearch(searchQuery, material.name) ||
                 intelligentSearch(searchQuery, material.mvCode) ||
                 intelligentSearch(searchQuery, material.observation);
        })
        .map((material) => ({
          ...material,
          relevanceScore: Math.max(
            calculateRelevanceScore(searchQuery, material.name),
            calculateRelevanceScore(searchQuery, material.mvCode),
            calculateRelevanceScore(searchQuery, material.observation)
          )
        }))
        .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore)
        .map(({ relevanceScore, ...material }) => material as Material);

      // Filtrar dietas com busca inteligente
      const filteredDiets = diets
        .filter((diet) => {
          return intelligentSearch(searchQuery, diet.name) ||
                 intelligentSearch(searchQuery, diet.mvCode) ||
                 intelligentSearch(searchQuery, diet.observation);
        })
        .map((diet) => ({
          ...diet,
          relevanceScore: Math.max(
            calculateRelevanceScore(searchQuery, diet.name),
            calculateRelevanceScore(searchQuery, diet.mvCode),
            calculateRelevanceScore(searchQuery, diet.observation)
          )
        }))
        .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore)
        .map(({ relevanceScore, ...diet }) => diet as Diet);

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
    'sequential-therapy' |
    'pharmacovigilance' |
    'cft' |
    'protocols' |
    'pictogram' |
    'discharge-guidelines' |
    'drug-interactions'
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
        return <IntoxicationSection />;

      case 'high-alert':
        return <HighAlertSection />;

      case 'elderly':
        return <ElderlySection />;

      case 'sequential-therapy':
        return <SequentialTherapySection />;

      case 'pharmacovigilance':
      case 'cft':
      case 'protocols':
      case 'pictogram':
      case 'discharge-guidelines':
      case 'drug-interactions':
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onSectionChange={handleSectionChange} selectedSection={selectedSection} />
        <SidebarInset>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
