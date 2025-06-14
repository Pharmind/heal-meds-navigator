
import { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
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
    <div className="relative w-full max-w-4xl mx-auto">
      <div
        className={cn(
          "relative flex items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border transition-all duration-500 ease-out",
          isFocused 
            ? "border-white/50 shadow-[0_0_40px_rgba(34,197,94,0.3)] ring-4 ring-white/20 scale-[1.02]" 
            : "border-white/30 hover:border-white/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
        )}
      >
        {/* Search Icon */}
        <div className="absolute left-6 flex items-center">
          <Search 
            className={cn(
              "transition-all duration-300",
              isFocused || query 
                ? "text-heal-green-600 scale-110" 
                : "text-heal-green-400",
              query && "animate-pulse"
            )} 
            size={24} 
          />
          {isFocused && !query && (
            <Sparkles className="text-heal-green-300 ml-2 animate-pulse" size={16} />
          )}
        </div>
        
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-16 pr-16 py-6 text-lg bg-transparent border-none outline-none text-gray-700 placeholder-heal-green-400/70 font-medium"
        />
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-6 p-2 rounded-full hover:bg-heal-green-100 transition-all duration-200 hover:scale-110"
          >
            <X className="text-heal-green-500" size={20} />
          </button>
        )}

        {/* Glow Effect */}
        <div className={cn(
          "absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none",
          isFocused ? "opacity-100" : "opacity-0",
          "bg-gradient-to-r from-heal-green-400/10 via-emerald-400/10 to-heal-green-400/10"
        )} />
      </div>
    </div>
  );
};

export default SearchBox;
