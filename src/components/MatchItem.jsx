// frontend/src/components/MatchItem.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  if (game.includes('r6') || game.includes('rainbow-six') || game.includes('rainbow6')) return '/logos/Rainbow 6 Siege/R6.png';
  return null;
};

// Helper to map player name to local headshot
const getPlayerImage = (player) => {
  const name = player.name?.toLowerCase() || player.nickname?.toLowerCase() || '';
  if (name.includes('canna')) return '/logos/Joueurs/canna.webp';
  if (name.includes('skewmond')) return '/logos/Joueurs/skewmond.webp';
  if (name.includes('kyeahoo') || name.includes('kyaehoo') || name.includes('vladi')) return '/logos/Joueurs/kyeahoo.webp';
  if (name.includes('caliste')) return '/logos/Joueurs/caliste.webp';
  if (name.includes('busio')) return '/logos/Joueurs/busio.webp';
  if (name.includes('brokenblade') || name.includes('broken-blade') || name.includes('broken blade')) return '/logos/Joueurs/brokenblade.webp';
  if (name.includes('yike')) return '/logos/Joueurs/yike.webp';
  if (name.includes('caps')) return '/logos/Joueurs/caps.webp';
  if (name.includes('hans-sama') || name.includes('hans sama') || name.includes('hans')) return '/logos/Joueurs/hans-sama.webp';
  if (name.includes('labrov')) return '/logos/Joueurs/labrov.webp';
  
  return player.image_url || '/logos/Joueurs/default.png'; 
};

// Helper to map role to icon
const getRoleIcon = (roleName) => {
  const role = roleName?.toLowerCase() || '';
  if (role.includes('top')) return '/logos/Roles/Top.png';
  if (role.includes('jungle') || role.includes('forestier')) return '/logos/Roles/Forestier.png';
  if (role.includes('mid') || role.includes('midlaner')) return '/logos/Roles/Midlaner.png';
  if (role.includes('adc') || role.includes('bot') || role.includes('tireur')) return '/logos/Roles/Tireur.png';
  if (role.includes('support')) return '/logos/Roles/Support.png';
  return null;
};

// Helper to translate roles for display
const translateRole = (roleName) => {
  const role = roleName?.toLowerCase() || '';
  if (role.includes('top')) return 'Top';
  if (role.includes('jungle') || role.includes('forestier')) return 'Jungle';
  if (role.includes('mid') || role.includes('midlaner')) return 'Mid';
  if (role.includes('adc') || role.includes('bot') || role.includes('tireur')) return 'ADC';
  if (role.includes('support')) return 'Support';
  return roleName;
};

// Map coordinates for player headshots on Map_v2.png (absolute positioning)
const mapPositions = {
  blue: {
    top: { top: '47%', left: '44%' },
    jungle: { top: '55%', left: '55%' },
    mid: { top: '58%', left: '55%' },
    adc: { top: '63%', left: '71%' },
    support: { top: '65%', left: '74%' }
  },
  red: {
    top: { top: '49%', left: '42%' },
    jungle: { top: '50%', left: '61%' },
    mid: { top: '52%', left: '58%' },
    adc: { top: '59%', left: '76%' },
    support: { top: '61%', left: '79%' }
  }
};

const MatchItem = ({ match }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [revealScore, setRevealScore] = useState(false);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const teamA = match.teams[0] || { id: null, name: 'TBD', image_url: null };
  const teamB = match.teams[1] || { id: null, name: 'TBD', image_url: null };

  const isLoL = match.game_slug?.toLowerCase()?.includes('league-of-legends') || match.game_slug?.toLowerCase()?.includes('lol') || match.game_name?.toLowerCase()?.includes('league of legends');

  useEffect(() => {
    if (isExpanded && isLoL && teamAPlayers.length === 0 && teamBPlayers.length === 0) {
      const fetchRosters = async () => {
        setLoadingRoster(true);
        try {
          const promises = [];
          if (teamA.id) {
            promises.push(axios.get(`http://localhost:5001/api/teams/${teamA.id}`));
          } else {
            promises.push(Promise.resolve({ data: { players: [] } }));
          }
          if (teamB.id) {
            promises.push(axios.get(`http://localhost:5001/api/teams/${teamB.id}`));
          } else {
            promises.push(Promise.resolve({ data: { players: [] } }));
          }

          const [resA, resB] = await Promise.all(promises);
          setTeamAPlayers(resA.data.players || []);
          setTeamBPlayers(resB.data.players || []);
        } catch (err) {
          console.error('Error fetching team rosters:', err);
        } finally {
          setLoadingRoster(false);
        }
      };

      fetchRosters();
    }
  }, [isExpanded, isLoL, teamA.id, teamB.id]);

  const getTwitchChannel = (url) => {
    if (!url) return null;
    const regexMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
    return regexMatch ? regexMatch[1] : null;
  };

  const twitchChannel = getTwitchChannel(match.stream_url);

  // Helper to extract a player by role
  const getPlayerByRole = (players, roleName) => {
    if (!players || !Array.isArray(players)) return null;
    return players.find(p => {
      const pRole = p.role?.toLowerCase() || '';
      return pRole === roleName || pRole.includes(roleName) || (roleName === 'adc' && pRole === 'bot');
    });
  };

  const ROLES = ['top', 'jungle', 'mid', 'adc', 'support'];

  return (
    <div className="flex flex-col border-b border-gray-800 last:border-b-0">
      
      {/* 1. Main Match Summary Row */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
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
            <img src={getTeamLogo(teamA)} alt={teamA.name} className="w-10 h-10 object-contain flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 bg-[#232549] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">?</div>
          )}
        </div>

        {/* VS Block & Time */}
        <div className="flex flex-col items-center justify-center">
          <span className="font-black text-sm text-slate-200">
            {match.status === 'running' ? (
              <span className="text-red-500 animate-pulse font-extrabold uppercase tracking-widest text-[9px]">● Live</span>
            ) : formatTime(match.scheduled_at)}
          </span>
          
          {(match.status === 'finished' || match.status === 'running') ? (
            <div className="my-1 flex items-center justify-center min-h-[22px]">
              {revealScore ? (
                <span className="font-extrabold text-xs text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded border border-[#2ecc71]/20 tracking-wider">
                  {teamA.score} - {teamB.score}
                </span>
              ) : (
                <span 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card expansion
                    setRevealScore(true);
                  }}
                  title="Click to show score (anti-spoiler)"
                  className="bg-[#232549] hover:bg-[#2d305e] text-slate-400 hover:text-slate-200 border border-[#232549] text-[8px] font-black px-1.5 py-0.5 rounded cursor-pointer transition select-none uppercase tracking-wider animate-pulse"
                >
                  Show Score
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-500 font-black my-0.5">VS</span>
          )}
          <div className="w-4 h-2 bg-slate-600 rounded-b-md"></div>
        </div>

        {/* Team B (Left-aligned) */}
        <div className="flex items-center justify-start gap-4 overflow-hidden">
          {getTeamLogo(teamB) ? (
            <img src={getTeamLogo(teamB)} alt={teamB.name} className="w-10 h-10 object-contain flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 bg-[#232549] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">?</div>
          )}
          <span className="font-extrabold text-sm sm:text-base tracking-wide truncate">{teamB.name}</span>
        </div>

        {/* Official Twitch/Kick Logo & Stage/Format */}
        <div className="flex flex-col items-end justify-center gap-1 w-full overflow-hidden pl-4">
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
        <div className="bg-[#0b0c1b]/60 border-t border-gray-900 px-8 py-6 flex flex-col gap-6 text-white transition-all duration-300">
          
          {/* A. Stream Embed Area */}
          <div className="w-full max-w-4xl mx-auto">
            {twitchChannel ? (
              <iframe
                src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=localhost&parent=127.0.0.1`}
                height="360"
                width="100%"
                allowFullScreen
                className="rounded-2xl border border-[#232549] shadow-2xl"
              />
            ) : match.stream_url ? (
              <div className="bg-[#181933] border border-[#232549] p-6 rounded-2xl text-center shadow-lg">
                <p className="text-slate-300 mb-3 text-sm">Direct video stream available at external link :</p>
                <a 
                  href={match.stream_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#5c3be0] hover:bg-[#7351f5] text-white px-5 py-2 rounded-xl text-xs font-bold transition inline-block cursor-pointer shadow-md"
                >
                  Watch External Stream
                </a>
              </div>
            ) : (
              <div className="bg-[#181933]/50 border border-[#232549]/60 p-6 rounded-2xl text-center text-slate-400 font-medium text-xs shadow-inner">
                No video stream available for this match.
              </div>
            )}
          </div>

          {/* B. League of Legends Roster View */}
          {isLoL && (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full border-t border-[#232549]/30 pt-6">
              <h3 className="text-xl font-bold tracking-wider text-center uppercase text-slate-200">Roster :</h3>

              {loadingRoster ? (
                <div className="text-center text-slate-400 font-semibold text-sm py-8 animate-pulse">
                  Loading rosters...
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  
                  {/* Isometric Summoner's Rift Map Overlay */}
                  <div className="relative w-full max-w-lg mx-auto bg-[#181933] border border-[#232549] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
                    <img 
                      src="/logos/Map/Map_v2.png" 
                      alt="Summoner's Rift" 
                      className="w-full h-auto object-cover select-none"
                    />

                    {/* Team A (Blue side / Left Nexus) Avatars */}
                    {ROLES.map(role => {
                      const player = getPlayerByRole(teamAPlayers, role);
                      if (!player) return null;
                      const pos = mapPositions.blue[role];
                      return (
                        <div 
                          key={`blue-${role}`}
                          style={pos}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
                        >
                          <div className="relative">
                            <img 
                              src={getPlayerImage(player)} 
                              alt={player.name} 
                              className="w-10 h-10 rounded-full border-2 border-blue-500 bg-[#090a15] object-cover shadow-lg transition duration-200 hover:scale-115"
                            />
                            {getRoleIcon(role) && (
                              <img 
                                src={getRoleIcon(role)} 
                                alt={role} 
                                className="w-4 h-4 rounded-full bg-slate-900 border border-blue-400 absolute bottom-[-2px] right-[-2px] p-0.5"
                              />
                            )}
                          </div>
                          {/* Tooltip on hover */}
                          <span className="absolute bottom-11 bg-slate-950/90 text-white font-bold text-[9px] px-2 py-0.5 rounded-md border border-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                            {player.name}
                          </span>
                        </div>
                      );
                    })}

                    {/* Team B (Red side / Right Nexus) Avatars */}
                    {ROLES.map(role => {
                      const player = getPlayerByRole(teamBPlayers, role);
                      if (!player) return null;
                      const pos = mapPositions.red[role];
                      return (
                        <div 
                          key={`red-${role}`}
                          style={pos}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
                        >
                          <div className="relative">
                            <img 
                              src={getPlayerImage(player)} 
                              alt={player.name} 
                              className="w-10 h-10 rounded-full border-2 border-purple-500 bg-[#090a15] object-cover shadow-lg transition duration-200 hover:scale-115"
                            />
                            {getRoleIcon(role) && (
                              <img 
                                src={getRoleIcon(role)} 
                                alt={role} 
                                className="w-4 h-4 rounded-full bg-slate-900 border border-purple-400 absolute bottom-[-2px] right-[-2px] p-0.5"
                              />
                            )}
                          </div>
                          {/* Tooltip on hover */}
                          <span className="absolute bottom-11 bg-slate-950/90 text-white font-bold text-[9px] px-2 py-0.5 rounded-md border border-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                            {player.name}
                          </span>
                        </div>
                      );
                    })}

                  </div>

                  {/* Matchup Comparison Table */}
                  <div className="bg-[#181933] border border-[#232549] rounded-2xl p-6 shadow-xl w-full">
                    <div className="flex flex-col gap-4 text-xs font-semibold">
                      {ROLES.map(role => {
                        const playerA = getPlayerByRole(teamAPlayers, role) || { name: 'TBD' };
                        const playerB = getPlayerByRole(teamBPlayers, role) || { name: 'TBD' };

                        return (
                          <div 
                            key={`matchup-${role}`} 
                            className="grid grid-cols-[1fr_50px_1fr] items-center text-center py-2 border-b border-[#232549]/40 last:border-b-0"
                          >
                            {/* Player A (Blue / Left) */}
                            <div className="flex items-center justify-end gap-3 pr-4">
                              <span className="text-slate-200 font-extrabold text-sm">{playerA.name}</span>
                              {playerA.id && (
                                <img 
                                  src={getPlayerImage(playerA)} 
                                  alt={playerA.name} 
                                  className="w-7 h-7 rounded-full border border-blue-500 object-cover bg-slate-900"
                                />
                              )}
                            </div>

                            {/* Position Icon */}
                            <div className="flex items-center justify-center">
                              {getRoleIcon(role) ? (
                                <img 
                                  src={getRoleIcon(role)} 
                                  alt={role} 
                                  title={translateRole(role)}
                                  className="w-6 h-6 object-contain hover:scale-110 transition cursor-help"
                                />
                              ) : (
                                <span className="text-[10px] text-slate-400 uppercase font-black">{translateRole(role)}</span>
                              )}
                            </div>

                            {/* Player B (Red / Right) */}
                            <div className="flex items-center justify-start gap-3 pl-4">
                              {playerB.id && (
                                <img 
                                  src={getPlayerImage(playerB)} 
                                  alt={playerB.name} 
                                  className="w-7 h-7 rounded-full border border-purple-500 object-cover bg-slate-900"
                                />
                              )}
                              <span className="text-slate-200 font-extrabold text-sm">{playerB.name}</span>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default MatchItem;