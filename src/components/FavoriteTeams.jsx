// frontend/src/components/FavoriteTeams.jsx
import React, { useState, useEffect } from 'react';
import MatchDetails from './MatchDetails';
import { getTeamLogo, getGameLogo } from './helpers';

const FavoriteMatchCard = ({ match, isActive, onClick }) => {
  const [showScore, setShowScore] = useState(false);

  const teamA = match.teams[0] || { id: null, name: 'TBD', image_url: null, score: 0 };
  const teamB = match.teams[1] || { id: null, name: 'TBD', image_url: null, score: 0 };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const gameLogo = getGameLogo(match.game_slug, match.game_name);
  const logoA = getTeamLogo(teamA);
  const logoB = getTeamLogo(teamB);

  return (
    <div
      onClick={onClick}
      className={`bg-[#181933]/60 hover:bg-[#25204d]/30 border rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between w-[280px] sm:w-[320px] h-[155px] shrink-0 cursor-pointer select-none ${
        isActive 
          ? 'border-[#5c3be0] bg-[#25204d]/40 shadow-[0_0_15px_rgba(92,59,224,0.3)]' 
          : 'border-[#232549]'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-b border-[#232549]/40 pb-2 mb-2">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          {gameLogo ? (
            <img src={gameLogo} alt="game logo" className="w-4 h-4 object-contain" />
          ) : (
            <div className="w-4 h-4 bg-[#232549] rounded-full flex items-center justify-center text-[8px] font-bold">?</div>
          )}
          <span className="truncate">{match.league_name}</span>
        </div>
        <span>{formatDate(match.scheduled_at)}</span>
      </div>

      {/* Teams & Score / VS Block */}
      <div className="grid grid-cols-[1fr_80px_1fr] items-center text-center my-1 flex-grow">
        {/* Team A */}
        <div className="flex flex-col items-center overflow-hidden gap-1">
          {logoA ? (
            <img src={logoA} alt={teamA.name} className="w-8 h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 bg-[#232549] rounded-full flex items-center justify-center font-bold text-[10px]">?</div>
          )}
          <span className="text-[11px] font-extrabold text-slate-200 truncate w-full">{teamA.name}</span>
        </div>

        {/* Center VS / Score Block */}
        <div className="flex flex-col items-center justify-center gap-0.5 px-1">
          {match.status === 'running' && (
            <span className="text-[9px] text-red-500 font-black animate-pulse uppercase mb-0.5">
              LIVE
            </span>
          )}
          {match.status === 'finished' && (
            <span className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">
              FINAL
            </span>
          )}
          {match.status === 'not_started' && (
            <span className="text-[10px] font-black text-slate-300 mb-0.5">{formatTime(match.scheduled_at)}</span>
          )}

          {match.status === 'not_started' ? (
            <span className="text-[11px] text-slate-500 font-black">VS</span>
          ) : !showScore ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowScore(true);
              }}
              className="bg-[#232549] hover:bg-[#2f3263] border border-[#3b3e75] text-[9px] text-slate-200 font-bold px-2 py-0.5 rounded cursor-pointer transition active:scale-95 whitespace-nowrap shadow-sm"
              title="Afficher le score"
            >
              Reveal
            </button>
          ) : (
            <span className="font-extrabold text-xs text-white bg-[#1c1d33] px-1.5 py-0.5 rounded border border-[#232549] tracking-wider shadow-inner">
              {teamA.score} - {teamB.score}
            </span>
          )}
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center overflow-hidden gap-1">
          {logoB ? (
            <img src={logoB} alt={teamB.name} className="w-8 h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 bg-[#232549] rounded-full flex items-center justify-center font-bold text-[10px]">?</div>
          )}
          <span className="text-[11px] font-extrabold text-slate-200 truncate w-full">{teamB.name}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-[#232549]/40 pt-2 mt-2">
        <span className="uppercase text-slate-300 font-black">BO{match.number_of_games || 3}</span>
        <div className="flex items-center gap-2">
          {match.stream_url && (
            <span className="bg-[#a370f7]/15 px-1.5 py-0.5 rounded text-[#a370f7] border border-[#a370f7]/20 flex items-center gap-0.5">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
              Live
            </span>
          )}
          <span className="text-[#5c3be0] hover:text-[#7351f5] flex items-center gap-0.5 transition font-black uppercase text-[9px]">
            Details
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

const FavoriteTeams = ({ favoriteMatches, favoriteTeamName }) => {
  const [activeFavFilter, setActiveFavFilter] = useState('Upcoming');
  const [activeMatchId, setActiveMatchId] = useState(null);

  useEffect(() => {
    setActiveMatchId(null);
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

  const activeMatch = sortedFavMatches.find(m => m.id === activeMatchId);

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

      {/* Horizontal Slider Layout */}
      <div className="flex flex-row overflow-x-auto gap-4 py-2 w-full max-w-full pb-4 scrollbar-thin">
        {sortedFavMatches.length > 0 ? (
          sortedFavMatches.map((match) => (
            <FavoriteMatchCard
              key={match.id}
              match={match}
              isActive={activeMatchId === match.id}
              onClick={() => setActiveMatchId(activeMatchId === match.id ? null : match.id)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 font-semibold text-xs bg-[#12132b]/20 w-full rounded-2xl border border-[#232549]/35">
            No {activeFavFilter.toLowerCase()} matches found for <span className="text-[#5c3be0]">{favoriteTeamName}</span>.
          </div>
        )}
      </div>

      {/* Shared Roster/Map details container */}
      {activeMatch && (
        <div className="mt-2 border-t border-[#232549]/60 pt-4 animate-[fadeIn_0.3s_ease-out]">
          <MatchDetails match={activeMatch} />
        </div>
      )}
    </div>
  );
};

export default FavoriteTeams;