
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import UserMenu from '@/components/UserMenu';

interface DesktopLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedSection: string;
  onSectionChange: (section: any) => void;
  onUserManagementClick: () => void;
}

const DesktopLayout = ({
  children,
  sidebarOpen,
  setSidebarOpen,
  selectedSection,
  onSectionChange,
  onUserManagementClick
}: DesktopLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
        <aside className="w-72 shrink-0 border-r bg-white dark:border-gray-700 dark:bg-gray-800 hidden lg:block">
          <AppSidebar onSectionChange={onSectionChange} selectedSection={selectedSection} />
        </aside>
        
        {/* Sidebar para tablet */}
        <div className="lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-80">
              <AppSidebar onSectionChange={onSectionChange} selectedSection={selectedSection} />
            </SheetContent>
          </Sheet>
        </div>
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header desktop */}
          <header className="border-b bg-white dark:border-gray-700 dark:bg-gray-800 px-4 lg:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden p-2"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <UserMenu onUserManagementClick={onUserManagementClick} />
            </div>
          </header>
          
          {/* Conteúdo principal */}
          <div className="flex-1 py-6 lg:py-12 px-4 lg:px-6 xl:px-8 2xl:px-12 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DesktopLayout;
