import React from 'react';

const MatchFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = ['All', 'Upcoming', 'Finished', 'Live'];

  return (
    <div className="flex gap-3 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default MatchFilters;