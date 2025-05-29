
import { useState } from 'react';
import { Menu, X, Pill, Package, UtensilsCrossed, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onCategoryChange: (category: 'all' | 'medications' | 'materials' | 'diets') => void;
  selectedCategory: string;
}

const Sidebar = ({ onCategoryChange, selectedCategory }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'all', label: 'Todos os Itens', icon: Search },
    { id: 'medications', label: 'Medicamentos', icon: Pill },
    { id: 'materials', label: 'Materiais', icon: Package },
    { id: 'diets', label: 'Dietas', icon: UtensilsCrossed },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-heal-green-600 text-white rounded-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-gradient-to-b from-heal-green-50 to-heal-green-100 border-r border-heal-green-200 z-40 transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 lg:w-64",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        )}
      >
        <div className="p-6">
          {/* Logo/Header */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-heal-green-800">HEAL</h1>
            <p className="text-sm text-heal-green-600">Sistema de Pesquisa</p>
            <p className="text-xs text-heal-green-500 mt-1">Hospital Estadual de Águas Lindas - GO</p>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onCategoryChange(item.id as any);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                    selectedCategory === item.id
                      ? "bg-heal-green-600 text-white shadow-md"
                      : "text-heal-green-700 hover:bg-heal-green-200"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-heal-green-500 text-center">
            <p>Versão 1.0</p>
            <p>Última atualização: Dez/2024</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
