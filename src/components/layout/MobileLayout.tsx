
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import UserMenu from '@/components/UserMenu';

interface MobileLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedSection: string;
  onSectionChange: (section: any) => void;
  onUserManagementClick: () => void;
}

const MobileLayout = ({
  children,
  sidebarOpen,
  setSidebarOpen,
  selectedSection,
  onSectionChange,
  onUserManagementClick
}: MobileLayoutProps) => {
  const handleSectionChange = (section: any) => {
    onSectionChange(section);
    setSidebarOpen(false);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased bg-gray-50 text-gray-900">
      {/* Header móvel */}
      <header className="sticky top-0 z-40 border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 hover:bg-heal-green-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  onClick={handleMenuClick}
                  type="button"
                >
                  <Menu className="h-5 w-5 text-heal-green-600" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="p-0 w-[280px] max-w-[90vw] bg-white border-r border-gray-200 z-[60]"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="h-full overflow-y-auto bg-white">
                  <AppSidebar 
                    onSectionChange={handleSectionChange} 
                    selectedSection={selectedSection} 
                  />
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-lg font-bold text-heal-green-800 truncate">
                Guia Farmacêutico
              </h1>
              <p className="text-xs text-heal-green-600">HEAL</p>
            </div>
          </div>
          <UserMenu onUserManagementClick={onUserManagementClick} />
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <main className="flex-1 p-4 pb-safe overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;
