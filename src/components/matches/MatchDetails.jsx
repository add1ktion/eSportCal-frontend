// frontend/src/components/MatchDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getPlayerImage, getRoleIcon, translateRole } from '../../utils/helpers';

// Map coordinates for player headshots on Map_v2.png (absolute positioning)
const mapPositions = {
  blue: {
    top: { top: '29%', left: '26%' },      // Top Lane Blue
    jungle: { top: '37%', left: '35%' },   // Jungle Blue (lower-left jungle)
    mid: { top: '46%', left: '45%' },      // Mid Lane Blue
    adc: { top: '72%', left: '66%' },      // Bot Lane Blue
    support: { top: '77%', left: '72%' }   // Bot Lane Blue
  },
  red: {
    top: { top: '16%', left: '40%' },      // Top Lane Red (further up top)
    jungle: { top: '26%', left: '50%' },   // Jungle Red (upper-right jungle)
    mid: { top: '36%', left: '55%' },      // Mid Lane Red
    adc: { top: '50%', left: '80%' },      // Bot Lane Red
    support: { top: '58%', left: '84%' }   // Bot Lane Red
  }
};

const MatchDetails = ({ match }) => {
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const teamA = match.teams[0] || { id: null, name: 'TBD', image_url: null };
  const teamB = match.teams[1] || { id: null, name: 'TBD', image_url: null };

  const isLoL = match.game_slug?.toLowerCase()?.includes('league-of-legends') || 
                match.game_slug?.toLowerCase()?.includes('lol') || 
                match.game_name?.toLowerCase()?.includes('league of legends');

  useEffect(() => {
    if (isLoL && teamAPlayers.length === 0 && teamBPlayers.length === 0) {
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
  }, [isLoL, teamA.id, teamB.id]);

  const getTwitchChannel = (url) => {
    if (!url) return null;
    const regexMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
    return regexMatch ? regexMatch[1] : null;
  };

  const twitchChannel = getTwitchChannel(match.stream_url);

  const getPlayerByRole = (players, roleName) => {
    if (!players || !Array.isArray(players)) return null;
    return players.find(p => {
      const pRole = p.role?.toLowerCase() || '';
      
      // Normalize player role from database
      let normalizedPRole = pRole;
      if (pRole === 'jun') normalizedPRole = 'jungle';
      if (pRole === 'sup') normalizedPRole = 'support';
      if (pRole === 'bot') normalizedPRole = 'adc';

      // Normalize requested role
      let normalizedRoleName = roleName?.toLowerCase();
      if (normalizedRoleName === 'jun') normalizedRoleName = 'jungle';
      if (normalizedRoleName === 'sup') normalizedRoleName = 'support';
      if (normalizedRoleName === 'bot') normalizedRoleName = 'adc';

      return normalizedPRole === normalizedRoleName || normalizedPRole.includes(normalizedRoleName);
    });
  };

  const ROLES = ['top', 'jungle', 'mid', 'adc', 'support'];

  return (
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
              <div className="relative w-full max-w-4xl mx-auto bg-[#181933] border border-[#232549] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
                <img 
                  src="/logos/Map/Map_v2.png" 
                  alt="Summoner's Rift" 
                  className="w-full h-auto object-contain select-none"
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
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500 bg-[#090a15] object-cover shadow-lg transition duration-200 hover:scale-115"
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
                      <span className="absolute bottom-13 bg-slate-950/90 text-white font-bold text-[9px] px-2 py-0.5 rounded-md border border-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-30">
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
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-purple-500 bg-[#090a15] object-cover shadow-lg transition duration-200 hover:scale-115"
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
                      <span className="absolute bottom-13 bg-slate-950/90 text-white font-bold text-[9px] px-2 py-0.5 rounded-md border border-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md z-30">
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
  );
};

export default MatchDetails;
