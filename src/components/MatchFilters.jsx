// frontend/src/components/MatchFilters.jsx
import React from 'react';

const MatchFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = ['All', 'Upcoming', 'Finished', 'Live'];

  return (
    <div className="flex gap-2 text-xs">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-1.5 rounded-full font-bold transition cursor-pointer ${
            activeFilter === filter 
              ? 'bg-[#5c3be0] text-white' 
              : 'bg-[#1c1d33] border border-[#232549] text-slate-400 hover:text-white'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default MatchFilters;