
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIndexLogic } from '@/hooks/useIndexLogic';
import MobileLayout from '@/components/layout/MobileLayout';
import DesktopLayout from '@/components/layout/DesktopLayout';
import ContentRenderer from '@/components/content/ContentRenderer';

const Index = () => {
  const isMobile = useIsMobile();
  const {
    selectedSection,
    searchQuery,
    sidebarOpen,
    medications,
    materials,
    diets,
    handleSearch,
    handleSectionChange,
    handleUserManagementClick,
    setSidebarOpen
  } = useIndexLogic();

  const contentProps = {
    selectedSection,
    searchQuery,
    medications,
    materials,
    diets,
    onSearch: handleSearch
  };

  const layoutProps = {
    sidebarOpen,
    setSidebarOpen,
    selectedSection,
    onSectionChange: handleSectionChange,
    onUserManagementClick: handleUserManagementClick
  };

  // Debug log para verificar se está detectando mobile corretamente
  console.log('isMobile:', isMobile, 'window.innerWidth:', typeof window !== 'undefined' ? window.innerWidth : 'undefined');

  if (isMobile) {
    return (
      <MobileLayout {...layoutProps}>
        <ContentRenderer {...contentProps} />
      </MobileLayout>
    );
  }

  return (
    <DesktopLayout {...layoutProps}>
      <ContentRenderer {...contentProps} />
    </DesktopLayout>
  );
};

export default Index;
