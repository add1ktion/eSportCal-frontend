// frontend/src/components/MatchItem.jsx
import React, { useState } from 'react';
import MatchDetails from './MatchDetails';
import { getTeamLogo, getGameLogo } from '../../utils/helpers';

const MatchItem = ({ match, isExpanded, onToggleExpand }) => {
  const [showScore, setShowScore] = useState(false);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const teamA = match.teams[0] || { id: null, name: 'TBD', image_url: null, score: 0 };
  const teamB = match.teams[1] || { id: null, name: 'TBD', image_url: null, score: 0 };

  return (
    <div className="flex flex-col border-b border-gray-800 last:border-b-0">
      
      {/* 1. Main Match Summary Row */}
      <div 
        onClick={onToggleExpand}
        className="grid grid-cols-[180px_1fr_80px_1fr_120px] items-center px-6 py-4 text-white hover:bg-[#25204d]/20 transition-colors cursor-pointer select-none"
      >
        
        {/* Date, Game Logo, and League Info */}
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

        {/* Team A (Right-aligned) */}
        <div className="flex items-center justify-end gap-4 overflow-hidden">
          <span className="font-extrabold text-sm sm:text-base tracking-wide truncate">{teamA.name}</span>
          {getTeamLogo(teamA) ? (
            <img src={getTeamLogo(teamA)} alt={teamA.name} className="w-10 h-10 object-contain flex-shrink-0 team-logo-glow" />
          ) : (
            <div className="w-10 h-10 bg-[#232549] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">?</div>
          )}
        </div>

        {/* VS Block & Time */}
        <div className="flex flex-col items-center justify-center">
          {match.status === 'running' && (
            <span className="text-[10px] text-red-500 font-black animate-pulse tracking-wide uppercase mb-0.5">
              LIVE
            </span>
          )}
          {match.status === 'finished' && (
            <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
              Terminé
            </span>
          )}
          {match.status === 'not_started' && (
            <span className="font-black text-sm text-slate-200">{formatTime(match.scheduled_at)}</span>
          )}

          {match.status === 'not_started' ? (
            <span className="text-xs text-gray-500 font-black my-0.5">VS</span>
          ) : !showScore ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowScore(true);
              }}
              className="my-0.5 bg-[#232549] hover:bg-[#2f3263] border border-[#3b3e75] text-[10px] text-slate-200 font-bold px-2.5 py-0.5 rounded cursor-pointer transition active:scale-95 whitespace-nowrap shadow-md"
              title="Afficher le score"
            >
              Reveal
            </button>
          ) : (
            <span className="my-0.5 font-extrabold text-xs sm:text-sm text-white bg-[#1c1d33] px-2 py-0.5 rounded border border-[#232549] tracking-widest shadow-inner">
              {teamA.score} - {teamB.score}
            </span>
          )}

          {isExpanded ? (
            <svg className="w-5 h-4 mt-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none">
              <path d="M4 17 L20 17 L12 9 Z" fill="#cccccc" stroke="#8f92a9" strokeWidth="3" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="w-5 h-4 mt-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none">
              <path d="M4 9 L20 9 L12 17 Z" fill="#cccccc" stroke="#8f92a9" strokeWidth="3" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Team B (Left-aligned) */}
        <div className="flex items-center justify-start gap-4 overflow-hidden">
          {getTeamLogo(teamB) ? (
            <img src={getTeamLogo(teamB)} alt={teamB.name} className="w-10 h-10 object-contain flex-shrink-0 team-logo-glow" />
          ) : (
            <div className="w-10 h-10 bg-[#232549] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">?</div>
          )}
          <span className="font-extrabold text-sm sm:text-base tracking-wide truncate">{teamB.name}</span>
        </div>

        {/* Official Twitch/Kick Logo & Stage/Format */}
        <div className="flex flex-col items-end justify-center gap-1 w-full pl-4">
          {match.stream_url ? (
            <a 
              href={match.stream_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Watch Live Stream"
              onClick={(e) => e.stopPropagation()} // Prevent expansion when clicking stream icon
            >
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

      {/* 2. Expanded View Details */}
      {isExpanded && (
        <MatchDetails match={match} />
      )}

    </div>
  );
};

export default MatchItem;