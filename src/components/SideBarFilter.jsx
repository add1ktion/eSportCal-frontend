// frontend/src/components/SidebarFilter.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// GAMES DATABASE with local icons and local league icons!
const GAMES_DATABASE = [
  {
    id: 'lol',
    name: 'League of Legends',
    icon: '/logos/League of Legends/League_of_Legends.png',
    leagues: [
      { name: 'LEC', icon: '/logos/League of Legends/LEC.png' },
      { name: 'LCK', icon: '/logos/League of Legends/LCK.png' },
      { name: 'LPL', icon: '/logos/League of Legends/LPL.png' },
      { name: 'LCS', icon: '/logos/League of Legends/LCS.png' }
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    icon: '/logos/Valorant/Valorant.png',
    leagues: [
      { name: 'VCT EMEA', icon: '/logos/Valorant/VCT_EMEA.png' },
      { name: 'VCT Americas', icon: '/logos/Valorant/VCT_Americas.png' },
      { name: 'VCT Pacific', icon: '/logos/Valorant/VCT_Pacific.png' },
      { name: 'VCT CN', icon: '/logos/Valorant/VCT_CN.png' }
    ]
  },
  {
    id: 'csgo',
    name: 'CS : GO',
    icon: '/logos/CSGO/CSGO.png',
    leagues: [
      { name: 'PGL', icon: '/logos/CSGO/PGL.png' },
      { name: 'IEM', icon: '/logos/CSGO/IEM.png' },
      { name: 'ESL', icon: '/logos/CSGO/ESL.png' },
      { name: 'Blast', icon: '/logos/CSGO/Blast.png' }
    ]
  },
  {
    id: 'dota2',
    name: 'Dota 2',
    icon: '/logos/Dota 2/DOTA_2.png',
    leagues: [
      { name: 'The International', icon: '/logos/Dota 2/International.png' },
      { name: 'Dream League', icon: '/logos/Dota 2/Dream_League.png' },
      { name: 'ESL One', icon: '/logos/Dota 2/ESL_One.png' },
      { name: 'PGL Wallachia', icon: '/logos/Dota 2/PGL_Wallachia.png' }
    ]
  }
];

function SidebarFilter() {
  const [expandedGames, setExpandedGames] = useState({});

  const toggleExpand = (gameId) => {
    setExpandedGames(prev => ({
      ...prev,
      [gameId]: !prev[gameId]
    }));
  };

  return (
    <aside className="w-80 bg-[#111226] border border-[#232549] rounded-3xl p-6 flex flex-col gap-6 shadow-xl h-fit">
      <h2 className="text-3xl font-bold text-center border-b border-[#232549] pb-4 select-none">
        Games
      </h2>

      {/* Custom thin scrollbar with safety gutter */}
      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-3">
        {GAMES_DATABASE.map((game) => {
          const isExpanded = !!expandedGames[game.id];
          return (
            <div key={game.id} className="border-b border-[#232549]/50 pb-4 last:border-0 last:pb-0">
              {/* Game Row */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <img src={game.icon} alt={game.name} className="w-6 h-6 object-contain" />
                  <span className="font-semibold text-sm text-slate-200">{game.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded accent-[#5c3be0]" />
                  <button onClick={() => toggleExpand(game.id)} className="text-slate-400 hover:text-white transition cursor-pointer">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Nested Leagues (Collapsible with icons !) */}
              {isExpanded && (
                <div className="pl-9 mt-2 flex flex-col gap-2">
                  {game.leagues.map((league) => (
                    <div key={league.name} className="flex items-center justify-between text-xs text-slate-400 py-1">
                      <div className="flex items-center gap-2">
                        {league.icon ? (
                          <img src={league.icon} alt={league.name} className="w-5 h-5 object-contain" />
                        ) : (
                          <div className="w-5 h-5 bg-[#232549] rounded-full flex items-center justify-center font-bold text-[8px]">?</div>
                        )}
                        <span>{league.name}</span>
                      </div>
                      <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#5c3be0]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="w-full bg-[#27ae60] hover:bg-[#2ecc71] text-white py-3 rounded-2xl font-bold tracking-wide shadow-md transition-all active:scale-95 mt-2 cursor-pointer">
        Apply Filters
      </button>
    </aside>
  );
}

export default SidebarFilter;