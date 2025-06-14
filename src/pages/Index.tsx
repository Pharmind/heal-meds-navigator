import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import SearchBox from '@/components/SearchBox';
import SearchResults from '@/components/SearchResults';
import CategoryTable from '@/components/CategoryTable';
import ClinicalPharmacy from '@/components/ClinicalPharmacy';
import IntoxicationSection from '@/components/clinical/IntoxicationSection';
import HighAlertSection from '@/components/clinical/HighAlertSection';
import ElderlySection from '@/components/clinical/ElderlySection';
import SequentialTherapySection from '@/components/clinical/SequentialTherapySection';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useNavigate } from 'react-router-dom';
import { Medication } from '@/types/heal';

type Section = 'search' | 'medications' | 'materials' | 'diets' | 'intoxication' | 'high-alert' | 'elderly' | 'sequential-therapy' | 'pharmacovigilance' | 'cft' | 'protocols' | 'pictogram' | 'discharge-guidelines' | 'drug-interactions' | 'treatment-estimation';

const Index = () => {
  const [selectedSection, setSelectedSection] = useState<Section>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const { medications, materials, diets } = useSupabaseData(searchQuery);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSectionChange = (section: Section) => {
    setSelectedSection(section);
  };

  const handleMedicationClick = (medication: Medication) => {
    navigate(`/medication/${medication.id}`);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'treatment-estimation':
        return <ClinicalPharmacy activeTab="treatment-estimation" />;
      
      case 'search':
        return (
          <>
            <SearchBox onSearch={handleSearch} />
            <SearchResults
              medications={medications}
              materials={materials}
              diets={diets}
              onMedicationClick={handleMedicationClick}
              searchQuery={searchQuery}
            />
          </>
        );
      case 'medications':
        return <CategoryTable type="medication" data={medications} onMedicationClick={handleMedicationClick} />;
      case 'materials':
        return <CategoryTable type="material" data={materials} />;
      case 'diets':
        return <CategoryTable type="diet" data={diets} />;
      case 'intoxication':
        return <IntoxicationSection />;
      case 'high-alert':
        return <HighAlertSection />;
      case 'elderly':
        return <ElderlySection />;
      case 'sequential-therapy':
        return <SequentialTherapySection />;
      case 'pharmacovigilance':
        return <ClinicalPharmacy activeTab="pharmacovigilance" />;
      case 'cft':
        return <ClinicalPharmacy activeTab="cft" />;
      case 'protocols':
        return <ClinicalPharmacy activeTab="protocols" />;
      case 'pictogram':
        return <ClinicalPharmacy activeTab="pictogram" />;
      case 'discharge-guidelines':
        return <ClinicalPharmacy activeTab="discharge-guidelines" />;
      case 'drug-interactions':
        return <ClinicalPharmacy activeTab="drug-interactions" />;
      default:
        return <div>Section not implemented yet.</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
        <aside className="w-72 shrink-0 border-r bg-white dark:border-gray-700 dark:bg-gray-800">
          <AppSidebar onSectionChange={handleSectionChange} selectedSection={selectedSection} />
        </aside>
        <main className="flex-1 py-12 px-6 md:px-8 lg:px-10 xl:px-12">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
