// frontend/src/components/MatchItem.jsx
import React from 'react';
import { Tv } from 'lucide-react';

// Helper function to dynamically map team names to your local high-quality PNGs
const getTeamLogo = (team) => {
  const name = team.name;
  if (name === "Karmine Corp" || name === "Karmine") return "/logos/Teams/KC.png";
  if (name === "Fnatic") return "/logos/Teams/Fnatic.png";
  if (name === "G2 Esports" || name === "G2") return "/logos/Teams/G2.png";
  if (name === "GiantX") return "/logos/Teams/GiantX.png";
  if (name === "MKOI") return "/logos/Teams/MKOI.png";
  if (name === "Natus Vincere") return "/logos/Teams/Natus_Vincere.png";
  {/* If your filename is different (like Shifters.png or SK_Gaming.png), adjust below */}
  if (name === "Shifters") return "/logos/Teams/Shifters.png";
  if (name === "SK Gaming" || name === "SK") return "/logos/Teams/SK_Gaming.png";
  if (name === "Team Heretics" || name === "Heretics") return "/logos/Teams/Team_Heretics.png";
  if (name === "Vitality" || name === "Team Vitality") return "/logos/Teams/Vitality.png";
  
  return team.image_url; // Fallback to PandaScore CDN if local logo is missing
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
    <div className="grid grid-cols-[160px_1fr_80px_1fr_120px] items-center px-6 py-4 border-b border-gray-700 text-white hover:bg-[#25204d]/30 transition-colors last:border-b-0">
      
      {/* 1. Date & League */}
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold">{formatDate(match.scheduled_at)}</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{match.league_name}</span>
      </div>

      {/* 2. Team A (Right-aligned) */}
      <div className="flex items-center justify-end gap-3 overflow-hidden">
        <span className="font-bold text-sm sm:text-base truncate">{teamA.name}</span>
        {getTeamLogo(teamA) ? (
          <img src={getTeamLogo(teamA)} alt={teamA.name} className="w-8 h-8 object-contain flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">?</div>
        )}
      </div>

      {/* 3. VS Block (Centered) */}
      <div className="flex flex-col items-center justify-center">
        <span className="font-bold text-sm">{formatTime(match.scheduled_at)}</span>
        <span className="text-xs text-gray-400 font-black">VS</span>
      </div>

      {/* 4. Team B (Left-aligned) */}
      <div className="flex items-center justify-start gap-3 overflow-hidden">
        {getTeamLogo(teamB) ? (
          <img src={getTeamLogo(teamB)} alt={teamB.name} className="w-8 h-8 object-contain flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">?</div>
        )}
        <span className="font-bold text-sm sm:text-base truncate">{teamB.name}</span>
      </div>

      {/* 5. Stream, Format and Stage (Right-aligned) */}
      <div className="flex flex-col items-end justify-center gap-1 w-full overflow-hidden">
        <span className="text-[9px] uppercase tracking-wider text-gray-400 truncate max-w-full">
          {match.stage_name || 'Regular'}
        </span>
        
        {match.stream_url ? (
          <a href={match.stream_url} target="_blank" rel="noopener noreferrer" title="Watch Live Stream">
            <span className="bg-[#a370f7] w-5 h-5 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition cursor-pointer">
              <Tv size={11} className="text-white" />
            </span>
          </a>
        ) : (
          <span className="bg-gray-700 w-5 h-5 rounded-full"></span>
        )}

        <span className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">
          BO{match.number_of_games || 3}
        </span>
      </div>
      
    </div>
  );
};

export default MatchItem;