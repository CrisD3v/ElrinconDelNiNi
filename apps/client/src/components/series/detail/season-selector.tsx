'use client';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface Season {
  id: string;
  name: string;
}

interface SeasonSelectorProps {
  seasons: Season[];
  activeSeasonId: string;
  onChange?: (id: string) => void;
}

export function SeasonSelector({ seasons, activeSeasonId, onChange }: SeasonSelectorProps) {
  const [selected, setSelected] = useState(activeSeasonId);

  // Solo mostramos el selector si hay más de una temporada
  if (!seasons || seasons.length <= 1) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelected(val);
    if (onChange) onChange(val);
  };

  return (
    <div className="mb-8 relative inline-flex items-center">
      <select 
        value={selected}
        onChange={handleChange}
        className="appearance-none bg-dark-800 text-text-primary font-semibold pl-5 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer border border-dark-700 hover:border-dark-600 hover:bg-dark-700 transition-all shadow-sm"
      >
        {seasons.map(season => (
          <option key={season.id} value={season.id}>{season.name}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
        <ChevronDown size={20} />
      </div>
    </div>
  );
}
