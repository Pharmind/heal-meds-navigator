
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
  return (
    <div className="min-h-screen flex flex-col antialiased bg-gray-50 text-gray-900">
      {/* Header móvel */}
      <header className="sticky top-0 z-40 border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <AppSidebar onSectionChange={onSectionChange} selectedSection={selectedSection} />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold text-gray-900 truncate">
              HEAL Platform
            </h1>
          </div>
          <UserMenu onUserManagementClick={onUserManagementClick} />
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <main className="flex-1 p-4 pb-safe">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;
