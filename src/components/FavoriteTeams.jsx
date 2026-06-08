// frontend/src/components/FavoriteTeams.jsx
import React from 'react';
import MatchItem from './MatchItem';

const FavoriteTeams = ({ favoriteMatches, favoriteTeamName }) => {
  if (!favoriteMatches) return null;

  return (
    <div className="bg-[#111226] p-6 rounded-3xl text-white border border-[#232549] shadow-xl flex flex-col gap-4">
      {/* Styled exactly like the main Matches container */}
      <div className="border-b border-[#232549] pb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-wide m-0">
          Favorite Team Feed: <span className="text-[#5c3be0]">{favoriteTeamName}</span>
        </h1>
      </div>

      {/* Dynamic matches list inside the banner */}
      <div className="flex flex-col border border-[#232549]/50 rounded-2xl overflow-hidden max-h-[250px] overflow-y-auto">
        {favoriteMatches.length > 0 ? (
          favoriteMatches.map((match) => (
            <MatchItem key={match.id} match={match} />
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 font-semibold text-xs bg-[#12132b]/20">
            No matches scheduled or finished recently for <span className="text-[#5c3be0]">{favoriteTeamName}</span>.
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteTeams;