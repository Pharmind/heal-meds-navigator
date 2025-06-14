
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBox = ({ onSearch, placeholder = "Pesquisar medicamentos, materiais e dietas..." }: SearchBoxProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className={cn(
          "relative flex items-center bg-white rounded-full shadow-lg border-2 transition-all duration-300",
          isFocused 
            ? "border-heal-green-400 shadow-xl ring-4 ring-heal-green-100" 
            : "border-heal-green-200 hover:border-heal-green-300"
        )}
      >
        <Search 
          className={cn(
            "absolute left-4 transition-all duration-200",
            isFocused || query 
              ? "text-heal-green-600" 
              : "text-heal-green-400 animate-[breathe_3s_ease-in-out_infinite]",
            query && "animate-spin"
          )} 
          size={20} 
        />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-lg bg-transparent border-none outline-none text-gray-700 placeholder-heal-green-400"
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 p-1 rounded-full hover:bg-heal-green-100 transition-colors duration-200"
          >
            <X className="text-heal-green-500" size={18} />
          </button>
        )}
      </div>
      
      {/* Search suggestions hint */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-heal-green-200 z-10">
          <p className="text-sm text-heal-green-600 mb-2 font-medium">Dicas de pesquisa:</p>
          <ul className="text-xs text-heal-green-500 space-y-1">
            <li>• Digite o nome do medicamento, material ou dieta</li>
            <li>• Use o código MV para busca exata</li>
            <li>• Busque por classe terapêutica</li>
          </ul>
        </div>
      )}
      
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default SearchBox;
