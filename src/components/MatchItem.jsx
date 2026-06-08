// frontend/src/components/MatchItem.jsx
import React from 'react';

// Helper to resolve team logos from public folder, falling back to PandaScore CDN
const getTeamLogo = (team) => {
  const name = team.name;
  if (name === "Karmine Corp" || name === "Karmine") return "/logos/Teams/KC.png";
  if (name === "Fnatic") return "/logos/Teams/Fnatic.png";
  if (name === "G2 Esports" || name === "G2") return "/logos/Teams/G2.png";
  if (name === "GiantX") return "/logos/Teams/GiantX.png";
  if (name === "MKOI") return "/logos/Teams/MKOI.png";
  if (name === "Natus Vincere" || name === "Navi") return "/logos/Teams/Natus_Vincere.png";
  if (name === "Shifters") return "/logos/Teams/Shifters.png";
  if (name === "SK Gaming" || name === "SK") return "/logos/Teams/SK_Gaming.png";
  if (name === "Team Heretics" || name === "Heretics") return "/logos/Teams/Team_Heretics.png";
  if (name === "Vitality" || name === "Team Vitality") return "/logos/Teams/Vitality.png";
  
  return team.image_url;
};

// Helper to resolve game logos
const getGameLogo = (slug, name) => {
  const game = slug?.toLowerCase() || name?.toLowerCase() || '';
  if (game.includes('cs-go') || game.includes('cs-2') || game.includes('counter-strike')) return '/logos/CSGO/CSGO.png';
  if (game.includes('league-of-legends') || game.includes('lol')) return '/logos/League of Legends/League_of_Legends.png';
  if (game.includes('valorant')) return '/logos/Valorant/Valorant.png';
  if (game.includes('dota-2') || game.includes('dota2')) return '/logos/Dota 2/DOTA_2.png';
  // 🌈 Added Rainbow 6 Siege support!
  if (game.includes('r6') || game.includes('rainbow-six') || game.includes('rainbow6')) return '/logos/Rainbow 6 Siege/R6.png';
  return null;
};

const MatchItem = ({ match }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const teamA = match.teams[0] || { name: 'TBD', image_url: null };
  const teamB = match.teams[1] || { name: 'TBD', image_url: null };

  return (
    <div className="grid grid-cols-[180px_1fr_80px_1fr_120px] items-center px-6 py-4 border-b border-gray-800 text-white hover:bg-[#25204d]/20 transition-colors last:border-b-0">
      
      {/* 1. Date, Game Logo, and League Info */}
      <div className="flex gap-3 items-center text-left">
        {getGameLogo(match.game_slug, match.game_name) ? (
          <img src={getGameLogo(match.game_slug, match.game_name)} alt="game logo" className="w-8 h-8 object-contain flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 bg-[#232549] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">?</div>
        )}
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs text-slate-400 font-semibold">{formatDate(match.scheduled_at)}</span>
          <span className="text-[10px] text-gray-500 font-medium truncate max-w-[130px]" title={match.league_name}>
            {match.league_name}
          </span>
          <span className="text-[10px] text-[#2ecc71] font-bold truncate max-w-[130px]" title={match.serie_name}>
            {match.serie_name}
          </span>
        </div>
      </div>

      {/* 2. Team A (Right-aligned) */}
      <div className="flex items-center justify-end gap-4 overflow-hidden">
        <span className="font-extrabold text-sm sm:text-base tracking-wide truncate">{teamA.name}</span>
        {getTeamLogo(teamA) ? (
          <img src={getTeamLogo(teamA)} alt={teamA.name} className="w-10 h-10 object-contain flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 bg-[#232549] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">?</div>
        )}
      </div>

      {/* 3. VS Block & Time */}
      <div className="flex flex-col items-center justify-center">
        <span className="font-black text-sm text-slate-200">{formatTime(match.scheduled_at)}</span>
        <span className="text-xs text-gray-500 font-black my-0.5">VS</span>
        <div className="w-4 h-2 bg-slate-600 rounded-b-md"></div>
      </div>

      {/* 4. Team B (Left-aligned) */}
      <div className="flex items-center justify-start gap-4 overflow-hidden">
        {getTeamLogo(teamB) ? (
          <img src={getTeamLogo(teamB)} alt={teamB.name} className="w-10 h-10 object-contain flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 bg-[#232549] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">?</div>
        )}
        <span className="font-extrabold text-sm sm:text-base tracking-wide truncate">{teamB.name}</span>
      </div>

      {/* 5. Official Twitch/Kick Logo & Stage/Format */}
      <div className="flex flex-col items-end justify-center gap-1 w-full overflow-hidden pl-4">
        {match.stream_url ? (
          <a href={match.stream_url} target="_blank" rel="noopener noreferrer" title="Watch Live Stream">
            <span className="bg-[#a370f7]/10 p-1.5 rounded-lg border border-[#a370f7]/30 flex items-center justify-center hover:scale-115 hover:bg-[#a370f7]/20 active:scale-95 transition cursor-pointer">
              <svg className="w-4 h-4 text-[#a370f7]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
            </span>
          </a>
        ) : (
          <div className="w-[18px] h-[18px]"></div>
        )}
        
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold truncate max-w-full" title={match.stage_name || 'Regular'}>
          {match.stage_name || 'Regular'}
        </span>
        <span className="text-[10px] uppercase text-gray-300 font-black">
          BO{match.number_of_games || 3}
        </span>
      </div>
      
    </div>
  );
};

export default MatchItem;