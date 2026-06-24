// frontend/src/components/FavoriteTeams.jsx
import React, { useState, useEffect } from 'react';
import MatchItem from './MatchItem';

const FavoriteTeams = ({ favoriteMatches, favoriteTeamName }) => {
  const [activeFavFilter, setActiveFavFilter] = useState('Upcoming');
  const [expandedMatchId, setExpandedMatchId] = useState(null);

  // Reset expanded match when filter changes
  useEffect(() => {
    setExpandedMatchId(null);
  }, [activeFavFilter]);

  if (!favoriteMatches) return null;

  // 1. Filter matches based on the selected status
  const filteredFavMatches = favoriteMatches.filter((match) => {
    if (activeFavFilter === 'Upcoming') return match.status === 'not_started';
    if (activeFavFilter === 'Finished') return match.status === 'finished';
    if (activeFavFilter === 'Live') return match.status === 'running';
    return true;
  });

  // 2. Sort matches chronologically:
  // - Upcoming: Ascending order (closest match first)
  // - Finished: Descending order (most recent match first)
  // - Live: default
  const sortedFavMatches = [...filteredFavMatches].sort((a, b) => {
    const dateA = new Date(a.scheduled_at);
    const dateB = new Date(b.scheduled_at);
    if (activeFavFilter === 'Upcoming') {
      return dateA - dateB;
    } else if (activeFavFilter === 'Finished') {
      return dateB - dateA;
    }
    return dateA - dateB;
  });

  const filters = ['Upcoming', 'Finished', 'Live'];

  return (
    <div className="bg-[#111226] p-6 rounded-3xl text-white border border-[#232549] shadow-xl flex flex-col gap-5">
      {/* Title & Filters Row */}
      <div className="border-b border-[#232549] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-wide m-0">
          Favorite Team Feed: <span className="text-[#5c3be0]">{favoriteTeamName}</span>
        </h1>

        {/* Local Filter Pills */}
        <div className="flex gap-2 text-xs">
          {filters.map((filter) => {
            const isLive = filter === 'Live';
            const isActive = activeFavFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setActiveFavFilter(filter)}
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
      </div>

      {/* Vertical scrollable container (fits exactly 2 collapsed match items) */}
      <div 
        className={`flex flex-col border border-[#232549]/50 rounded-2xl overflow-y-auto scrollbar-thin transition-all duration-300 ${
          expandedMatchId 
            ? 'max-h-none' 
            : 'max-h-[148px]'
        }`}
      >
        {sortedFavMatches.length > 0 ? (
          sortedFavMatches.map((match) => (
            <MatchItem
              key={match.id}
              match={match}
              isExpanded={expandedMatchId === match.id}
              onToggleExpand={() => setExpandedMatchId(expandedMatchId === match.id ? null : match.id)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 font-semibold text-xs bg-[#12132b]/20 w-full rounded-2xl">
            No {activeFavFilter.toLowerCase()} matches found for <span className="text-[#5c3be0]">{favoriteTeamName}</span>.
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteTeams;