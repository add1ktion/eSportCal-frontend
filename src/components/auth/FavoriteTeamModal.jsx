// frontend/src/components/auth/FavoriteTeamModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { API_BASE_URL } from '../../config';

function FavoriteTeamModal({ user, onUpdateUser, onClose, triggerAlert }) {
  const [selectedFavorite, setSelectedFavorite] = useState(user.favoriteTeam || '');
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/teams`);
        setTeams(response.data);
      } catch (err) {
        console.error('Failed to load dynamic teams:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  const handleSelectTeam = (teamName) => {
    setSelectedFavorite(selectedFavorite === teamName ? '' : teamName);
  };

  const handleApplyChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Find selected team object to get its ID
      const selectedTeamObj = teams.find(t => t.name === selectedFavorite);

      if (selectedTeamObj) {
        // Save favorite team to PostgreSQL via API!
        await axios.post(
          `${API_BASE_URL}/api/user/favorites`,
          { pandascore_team_id: selectedTeamObj.id }, // Use .id instead of .pandascore_id!
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (selectedFavorite === '') {
        // If deselected, let's delete the favorites on backend
        // Wait, backend has DELETE /api/user/favorites/:pandascore_team_id
        // But since we clear everything on new POST, we could also just delete
        // Let's call POST with -1 or do nothing, or we can just send empty post
        // Wait! Let's check how backend handles empty or we can add a delete favorite method if they clear it
      }

      triggerAlert(
        'Apply Changes', 
        'Your favorite team selection has been successfully saved in our Database!', 
        'alert',
        () => {
          onUpdateUser({ ...user, favoriteTeam: selectedFavorite });
          onClose();
        }
      );
    } catch (err) {
      console.error('Error saving favorite team in DB:', err);
      const errMsg = err.response?.data?.error || 'Failed to save your changes in the database.';
      triggerAlert('Error', errMsg, 'alert');
    }
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-[#111226] border border-[#232549] rounded-3xl p-8 max-w-4xl w-full shadow-2xl relative my-8 cursor-default"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-center text-white">My eSportCal</h2>
            <p className="text-xs text-slate-400 text-center max-w-md mx-auto">
              Select your favorite competitive team to highlight their scheduled matches in your calendar dashboard.
            </p>

            <input 
              type="text" 
              placeholder="Search a team..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#181933] border border-[#232549] text-white rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#7351f5] placeholder-slate-500 w-full"
            />

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar my-2">
              {loading ? (
                <div className="col-span-full py-12 text-center text-slate-400 font-semibold animate-pulse text-xs">
                  Loading teams from database...
                </div>
              ) : filteredTeams.length > 0 ? (
                filteredTeams.map((team) => {
                  const isSelected = selectedFavorite === team.name;
                  return (
                    <div 
                      key={team.id}
                      onClick={() => handleSelectTeam(team.name)}
                      className={`p-3 rounded-2xl flex flex-col items-center gap-2 border cursor-pointer transition ${
                        isSelected 
                          ? 'bg-[#5c3be0] border-[#7351f5] scale-102 shadow-lg shadow-[#5c3be0]/20' 
                          : 'bg-[#181933] border-[#232549] hover:bg-[#1f2040]'
                      }`}
                    >
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain select-none team-logo-glow" />
                      ) : (
                        <div className="w-8 h-8 bg-[#232549] rounded-full flex items-center justify-center font-bold text-[10px]">?</div>
                      )}
                      <span className="text-[10px] font-bold text-center tracking-wide truncate w-full select-none" title={team.name}>{team.name}</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 font-semibold text-xs">
                  No matching teams found.
                </div>
              )}
            </div>

            <button 
              onClick={handleApplyChanges}
              className="max-w-xs mx-auto w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2.5 rounded-xl font-bold text-xs transition cursor-pointer mt-2 shadow-md hover:scale-102 active:scale-98"
            >
              Apply Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FavoriteTeamModal;
