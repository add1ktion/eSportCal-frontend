// frontend/src/components/SidebarFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GAMES_DATABASE = [
  {
    id: 'lol',
    name: 'League of Legends',
    icon: '/logos/League of Legends/League_of_Legends.png',
    leagues: [
      { name: 'LEC', icon: '/logos/League of Legends/LEC.png' },
      { name: 'LCK', icon: '/logos/League of Legends/LCK.png' },
      { name: 'LPL', icon: '/logos/League of Legends/LPL.png' },
      { name: 'LCS', icon: '/logos/League of Legends/LCS.png' },
      { name: 'Worlds', icon: '/logos/League of Legends/Worlds.png' },
      { name: 'First Stand', icon: '/logos/League of Legends/First_Stand.png' },
      { name: 'MSI', icon: '/logos/League of Legends/MSI.png' },
      { name: 'EMEA Masters', icon: '/logos/League of Legends/EMEA_Masters.png' },
      { name: 'LFL', icon: '/logos/League of Legends/LFL.png' },
      { name: 'EWC', icon: '/logos/EWC.png' }
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
      { name: 'VCT CN', icon: '/logos/Valorant/VCT_CN.png' },
      { name: 'Valorant Champions', icon: '/logos/Valorant/Valorant_Champions.png' },
      { name: 'VCT Masters', icon: '/logos/Valorant/VCT_Masters.png' },
      { name: 'EWC', icon: '/logos/EWC.png' }
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
      { name: 'Blast', icon: '/logos/CSGO/Blast.png' },
      { name: 'EWC', icon: '/logos/EWC.png' }
    ]
  },
  {
    id: 'dota2',
    name: 'Dota 2',
    icon: '/logos/Dota 2/DOTA_2.png',
    leagues: [
      { name: 'The International', icon: '/logos/Dota 2/The_International.png' },
      { name: 'Dream League', icon: '/logos/Dota 2/Dream_League.png' },
      { name: 'ESL One', icon: '/logos/Dota 2/ESL_One.png' },
      { name: 'PGL Wallachia', icon: '/logos/Dota 2/PGL_Wallachia.png' },
      { name: 'EWC', icon: '/logos/EWC.png' }
    ]
  },
  {
    id: 'r6',
    name: 'Rainbow 6 Siege',
    icon: '/logos/Rainbow 6 Siege/R6.png',
    leagues: [
      { name: 'MENA League', icon: '/logos/Rainbow 6 Siege/MENA_League.png' },
      { name: 'NA League', icon: '/logos/Rainbow 6 Siege/NA_League.png' },
      { name: 'SA League', icon: '/logos/Rainbow 6 Siege/SA_League.png' },
      { name: 'CN League', icon: '/logos/Rainbow 6 Siege/CN_League.png' },
      { name: 'AP League', icon: '/logos/Rainbow 6 Siege/AP_League.png' },
      { name: 'Six Invitational', icon: '/logos/Rainbow 6 Siege/Six_Invitational.png' },
      { name: 'Six Major', icon: '/logos/Rainbow 6 Siege/Six_Major.png' },
      { name: 'EWC', icon: '/logos/EWC.png' }
    ]
  }
];

function SidebarFilter({ activeFilters, onFilterChange }) {
  const [expandedGames, setExpandedGames] = useState({});
  const checkboxRefs = useRef({});

  const toggleExpand = (gameId) => {
    setExpandedGames(prev => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  useEffect(() => {
    GAMES_DATABASE.forEach(game => {
      const el = checkboxRefs.current[game.id];
      if (el) {
        const selectedCount = (activeFilters[game.id] || []).length;
        const totalCount = game.leagues.length;
        
        if (selectedCount > 0 && selectedCount < totalCount) {
          el.indeterminate = true;
        } else {
          el.indeterminate = false;
        }
      }
    });
  }, [activeFilters]);

  const handleGameChange = (gameId, isChecked) => {
    const game = GAMES_DATABASE.find(g => g.id === gameId);
    if (!game) return;

    if (isChecked) {
      onFilterChange(gameId, game.leagues.map(l => l.name));
    } else {
      onFilterChange(gameId, []);
    }
  };

  const handleLeagueChange = (gameId, leagueName, isChecked) => {
    const currentLeagues = activeFilters[gameId] || [];
    let updatedLeagues;

    if (isChecked) {
      updatedLeagues = [...currentLeagues, leagueName];
    } else {
      updatedLeagues = currentLeagues.filter(name => name !== leagueName);
    }

    onFilterChange(gameId, updatedLeagues);
  };

  return (
    <aside className="w-80 bg-[#111226] border border-[#232549] rounded-3xl p-6 flex flex-col gap-6 shadow-xl h-fit">
      <h2 className="text-3xl font-bold text-center border-b border-[#232549] pb-4 select-none">
        Games
      </h2>

      {/* Safety padding-right left as is for custom scrollbar */}
      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-3">
        {GAMES_DATABASE.map((game) => {
          const selectedLeagues = activeFilters[game.id] || [];
          const isAllChecked = selectedLeagues.length === game.leagues.length;
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
                  <input 
                    type="checkbox" 
                    ref={el => checkboxRefs.current[game.id] = el}
                    checked={isAllChecked}
                    onChange={(e) => handleGameChange(game.id, e.target.checked)}
                    className="w-4 h-4 rounded accent-[#5c3be0] cursor-pointer"
                  />
                  <button onClick={() => toggleExpand(game.id)} className="text-slate-400 hover:text-white transition cursor-pointer">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Nested Leagues */}
              {isExpanded && (
                <div className="pl-9 mt-2 flex flex-col gap-2">
                  {game.leagues.map((league) => {
                    const isLeagueChecked = selectedLeagues.includes(league.name);
                    return (
                      <div key={league.name} className="flex items-center justify-between text-xs text-slate-400 py-1">
                        <div className="flex items-center gap-2">
                          <img src={league.icon} alt={league.name} className="w-5 h-5 object-contain" />
                          <span>{league.name}</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={isLeagueChecked}
                          onChange={(e) => handleLeagueChange(game.id, league.name, e.target.checked)}
                          className="w-3.5 h-3.5 rounded accent-[#5c3be0] cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default SidebarFilter;