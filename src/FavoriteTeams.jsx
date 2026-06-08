import React, { useState } from 'react';

const FavoriteTeams = ({ favorites }) => {
  const [activeGame, setActiveGame] = useState('all');

  if (!favorites) return null;

  const games = [
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

  return (
    <div className="bg-[#1a163a] p-4 rounded-xl text-white mb-6 border border-white/10">
      <h2 className="font-bold text-sm text-gray-400 mb-3">FAVORITE TEAMS</h2>

      <div className="bg-white/5 rounded-full border border-white/10 px-3 py-2 flex items-center gap-2 mb-4 overflow-x-auto whitespace-nowrap">
        {games.map((game) => (
          <button
            key={game.key}
            type="button"
            onClick={() => setActiveGame(game.key)}
            className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-[11px] font-medium transition ${
              activeGame === game.key
                ? 'bg-white text-[#1a163a]' 
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <span className={`inline-flex h-5 w-5 rounded-full ${badgeClasses[game.key]} items-center justify-center text-[10px] font-bold text-white`}>{badgeText[game.key]}</span>
            <span className="ml-1 text-[12px]">{game.label}</span>
          </button>
        ))}
      </div>

      {/* Mini matches inside the banner */}
      <div className="flex flex-col gap-2 mb-3">
        {[
          { id: 'm1', date: '31/05/2026', league: 'LEC', team1: 'Karmine Corp', team2: 'G2 Esports', time: '20:00', format: 'BO3', stage: 'Playoffs' },
          { id: 'm2', date: '01/06/2026', league: 'LEC', team1: 'Karmine Corp', team2: 'Vitality', time: '17:00', format: 'BO3', stage: 'Regular Season' },
        ].map((m) => (
          <div key={m.id} className="grid grid-cols-[120px_1fr_80px_1fr_100px] items-center gap-4 px-3 py-2 bg-[#211b3b] rounded">
            <div className="text-xs text-gray-300">
              <div>{m.date}</div>
              <div className="text-[10px] text-gray-500">{m.league}</div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <span className="font-bold text-sm truncate">{m.team1}</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0" />
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="font-bold text-sm">{m.time}</div>
              <div className="text-xs text-gray-400">VS</div>
            </div>

            <div className="flex items-center justify-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0" />
              <span className="font-bold text-sm truncate">{m.team2}</span>
            </div>

            <div className="text-right text-xs text-gray-300">
              <div className="text-[10px]">{m.stage}</div>
              <div className="text-[10px]">{m.format}</div>
            </div>
          </div>
        ))}
      </div>

      {/* favorites chips removed as requested */}
    </div>
  );
};

export default FavoriteTeams;