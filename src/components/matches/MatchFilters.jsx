// frontend/src/components/MatchFilters.jsx
import React from 'react';

const MatchFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = ['Upcoming', 'Finished', 'Live']; // Removed 'All'

  return (
    <div className="flex gap-2 text-xs">
      {filters.map((filter) => {
        const isLive = filter === 'Live';
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full font-bold transition cursor-pointer ${
              isActive 
                ? isLive 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-[#5c3be0] text-white' 
                : isLive 
                  ? 'bg-[#1c1d33] border border-red-500/30 text-red-500 animate-pulse' 
                  : 'bg-[#1c1d33] border border-[#232549] text-slate-400 hover:text-white'
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default MatchFilters;