// frontend/src/components/UserSettings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { API_BASE_URL } from '../../config';

function UserSettings({ user, onUpdateUser, onClose, onDeleteAccount, triggerAlert }) {
  const [username] = useState(user.username);
  const [email] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
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
    const selectedTeamObj = teams.find(t => t.name === selectedFavorite);
    const token = localStorage.getItem('token');

    try {
      // 🐘 DATABASE PERSISTENCE: Save profile updates (password change) to PostgreSQL!
      if (token) {
        const updateData = {};
        
        // If user wants to change password
        if (newPassword !== '') {
          if (!currentPassword) {
            triggerAlert('Validation Error', 'Please enter your current password to set a new password.', 'alert');
            return;
          }
          if (newPassword !== confirmNewPassword) {
            triggerAlert('Validation Error', 'New passwords do not match.', 'alert');
            return;
          }
          if (newPassword.length < 8) {
            triggerAlert('Validation Error', 'New password must be at least 8 characters.', 'alert');
            return;
          }
          updateData.password = newPassword;
          updateData.currentPassword = currentPassword;
        }

        if (Object.keys(updateData).length > 0) {
          await axios.put(
            `${API_BASE_URL}/api/user/me`,
            updateData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      // 🐘 DATABASE PERSISTENCE: Save favorite team to PostgreSQL via API!
      if (selectedTeamObj && token) {
        await axios.post(
          `${API_BASE_URL}/api/user/favorites`,
          { pandascore_team_id: selectedTeamObj.pandascore_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      triggerAlert(
        'Apply Changes', 
        'All your profile modifications and favorite team have been successfully saved in our Database!', 
        'alert',
        () => {
          onUpdateUser({ ...user, favoriteTeam: selectedFavorite });
          onClose();
        }
      );

    } catch (err) {
      console.error('Error saving profile changes or favorite team in DB:', err);
      const errMsg = err.response?.data?.error || 'Failed to save your changes in the database.';
      triggerAlert('Error', errMsg, 'alert');
    }
  };

  const handleDeleteClick = () => {
    triggerAlert(
      'Delete Account',
      'Are you sure you want to permanently delete your account (GDPR)? This action cannot be undone.',
      'confirm',
      () => onDeleteAccount()
    );
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-[#111226] border border-[#232549] rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative my-8 cursor-default"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6">
          {/* USER SETTINGS */}
          <div className="flex flex-col gap-4 border-b border-[#232549] pb-6">
            <h2 className="text-3xl font-bold text-center">User Settings</h2>
            
            <div className="flex flex-col gap-3 max-w-sm mx-auto text-sm w-full">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Username :</span>
                <input 
                  type="text" 
                  value={username} 
                  disabled
                  className="bg-[#c0c2d6]/50 text-[#090a15] rounded-lg px-3 py-0.5 text-xs w-48 outline-none font-bold text-center opacity-60 cursor-not-allowed"
                />
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Email :</span>
                <input 
                  type="email" 
                  value={email} 
                  disabled
                  className="bg-[#c0c2d6]/50 text-[#090a15] rounded-lg px-3 py-0.5 text-xs w-48 outline-none font-bold text-center opacity-60 cursor-not-allowed"
                />
              </div>

              <div className="border-t border-[#232549]/50 my-2 pt-2">
                <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Change Password</h3>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300 text-xs">Current Password :</span>
                <input 
                  type="password" 
                  placeholder="Enter current password"
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] rounded-lg px-3 py-0.5 text-xs w-48 outline-none font-bold text-center placeholder-slate-600"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300 text-xs">New Password :</span>
                <input 
                  type="password" 
                  placeholder="Min 8 characters"
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] rounded-lg px-3 py-0.5 text-xs w-48 outline-none font-bold text-center placeholder-slate-600"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300 text-xs">Confirm New :</span>
                <input 
                  type="password" 
                  placeholder="Confirm new password"
                  value={confirmNewPassword} 
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] rounded-lg px-3 py-0.5 text-xs w-48 outline-none font-bold text-center placeholder-slate-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 max-w-sm mx-auto w-full mt-2">
              <button 
                onClick={handleApplyChanges}
                className="w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Apply Changes
              </button>
              <button 
                onClick={handleDeleteClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* FAVORITE TEAMS */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center">Favorite Teams</h2>

            <input 
              type="text" 
              placeholder="Search a team..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#181933] border border-[#232549] text-white rounded-xl px-4 py-2 text-xs outline-none focus:border-[#7351f5] placeholder-slate-500 w-full"
            />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="col-span-full py-8 text-center text-slate-400 font-semibold animate-pulse text-xs">
                  Loading teams...
                </div>
              ) : teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map((team) => {
                  const isSelected = selectedFavorite === team.name;
                  return (
                    <div 
                      key={team.id}
                      onClick={() => handleSelectTeam(team.name)}
                      className={`p-3 rounded-2xl flex flex-col items-center gap-2 border cursor-pointer transition ${
                        isSelected 
                          ? 'bg-[#5c3be0] border-[#7351f5]' 
                          : 'bg-[#181933] border-[#232549] hover:bg-[#1f2040]'
                      }`}
                    >
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain select-none" />
                      ) : (
                        <div className="w-8 h-8 bg-[#232549] rounded-full flex items-center justify-center font-bold text-[10px]">?</div>
                      )}
                      <span className="text-[10px] font-bold text-center tracking-wide truncate w-full select-none" title={team.name}>{team.name}</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-8 text-center text-slate-500 font-semibold text-xs">
                  No matching teams found.
                </div>
              )}
            </div>

            <button 
              onClick={handleApplyChanges}
              className="max-w-xs mx-auto w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2 rounded-xl font-bold text-xs transition cursor-pointer mt-2"
            >
              Apply Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserSettings;