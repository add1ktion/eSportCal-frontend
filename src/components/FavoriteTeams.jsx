// frontend/src/components/FavoriteTeams.jsx
import React, { useState } from 'react';
import MatchItem from './MatchItem';

// Games metadata matching your design
const GAMES_LIST = [
  { key: 'all', label: 'All' },
  { key: 'lol', label: 'League of Legends' },
  { key: 'valorant', label: 'Valorant' },
  { key: 'csgo', label: 'CS:GO' },
  { key: 'dota2', label: 'Dota 2' },
  { key: 'r6', label: 'Rainbow 6 Siege' },
];

const badgeClasses = {
  all: 'bg-white/10',
  lol: 'bg-yellow-400',
  valorant: 'bg-red-500',
  csgo: 'bg-slate-400',
  dota2: 'bg-red-700',
  r6: 'bg-indigo-500',
};

const badgeText = {
  all: 'All',
  lol: 'LoL',
  valorant: 'V',
  csgo: 'CS',
  dota2: 'D2',
  r6: 'R6',
};

// Maps our local game keys to PandaScore game names
const GAME_NAME_MAP = {
  'lol': 'League of Legends',
  'valorant': 'Valorant',
  'csgo': 'Counter-Strike',
  'dota2': 'Dota 2',
  'r6': 'Rainbow 6 Siege'
};

const FavoriteTeams = ({ favoriteMatches, favoriteTeamName }) => {
  const [activeGame, setActiveGame] = useState('all');

  if (!favoriteMatches) return null;

  // Filter matches inside the favorite feed dynamically when clicking a game category!
  const displayedMatches = activeGame === 'all'
    ? favoriteMatches
    : favoriteMatches.filter(m => m.game_name === GAME_NAME_MAP[activeGame]);

  return (
    <div className="bg-[#111226] p-6 rounded-3xl text-white border border-[#232549] shadow-xl flex flex-col gap-4">
      <h2 className="font-bold text-sm text-gray-400 border-b border-[#232549] pb-3 tracking-wider uppercase select-none">
        Favorite Team Feed: <span className="text-[#5c3be0]">{favoriteTeamName}</span>
      </h2>

      {/* Figma Game Badges Filter Bar */}
      <div className="bg-white/5 rounded-full border border-white/10 px-3 py-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        {GAMES_LIST.map((game) => (
          <button
            key={game.key}
            type="button"
            onClick={() => setActiveGame(game.key)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium transition cursor-pointer ${
              activeGame === game.key
                ? 'bg-white text-[#111226]' 
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <span className={`inline-flex h-5 w-5 rounded-full ${badgeClasses[game.key]} items-center justify-center text-[9px] font-bold text-white`}>
              {badgeText[game.key]}
            </span>
            <span className="text-[11px]">{game.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic matches list inside the banner */}
      <div className="flex flex-col border border-[#232549]/50 rounded-2xl overflow-hidden max-h-[250px] overflow-y-auto">
        {displayedMatches.length > 0 ? (
          displayedMatches.map((match) => (
            <MatchItem key={match.id} match={match} />
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 font-semibold text-xs bg-[#12132b]/20">
            No upcoming matches scheduled for <span className="text-[#5c3be0]">{favoriteTeamName}</span> in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteTeams;