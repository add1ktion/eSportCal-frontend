// frontend/src/components/UserSettings.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

// 🛡️ High-quality local team metadata with official PandaScore IDs!
const FAVORITE_TEAMS_DATABASE = [
  { name: 'Karmine Corp', icon: '/logos/Teams/KC.png', pandascore_id: 128268 },
  { name: 'Fnatic', icon: '/logos/Teams/Fnatic.png', pandascore_id: 3201 },
  { name: 'G2 Esports', icon: '/logos/Teams/G2.png', pandascore_id: 3210 },
  { name: 'GiantX', icon: '/logos/Teams/GiantX.png', pandascore_id: 136005 },
  { name: 'MKOI', icon: '/logos/Teams/MKOI.png', pandascore_id: 137078 },
  { name: 'Natus Vincere', icon: '/logos/Teams/Natus_Vincere.png', pandascore_id: 3214 },
  { name: 'Shifters', icon: '/logos/Teams/Shifters.png', pandascore_id: 138612 },
  { name: 'SK Gaming', icon: '/logos/Teams/SK_Gaming.png', pandascore_id: 3212 },
  { name: 'Team Heretics', icon: '/logos/Teams/Team_Heretics.png', pandascore_id: 132212 },
  { name: 'Team Vitality', icon: '/logos/Teams/Vitality.png', pandascore_id: 3213 }
];

function UserSettings({ user, onUpdateUser, onClose, onDeleteAccount, triggerAlert }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [selectedFavorite, setSelectedFavorite] = useState(user.favoriteTeam || '');

  const handleSelectTeam = (teamName) => {
    setSelectedFavorite(selectedFavorite === teamName ? '' : teamName);
  };

  const handleApplyChanges = async () => {
    const selectedTeamObj = FAVORITE_TEAMS_DATABASE.find(t => t.name === selectedFavorite);
    const token = localStorage.getItem('token');

    try {
      // 🐘 DATABASE PERSISTENCE: Save profile updates (username, email, password) to PostgreSQL!
      if (token) {
        const updateData = {};
        if (username !== user.username) updateData.username = username;
        if (email !== user.email) updateData.email = email;
        // Only update password if it's filled and different
        if (password !== user.password && password !== '') updateData.password = password;

        if (Object.keys(updateData).length > 0) {
          const res = await axios.put(
            'http://localhost:5001/api/user/me',
            updateData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // If the username has changed, a new token is returned
          if (res.data.token) {
            localStorage.setItem('token', res.data.token);
          }
        }
      }

      // 🐘 DATABASE PERSISTENCE: Save favorite team to PostgreSQL via Ilan's API!
      if (selectedTeamObj && token) {
        // First, clear old favorites (since we only allow ONE favorite team for the MVP)
        // Then, insert the new one
        await axios.post(
          'http://localhost:5001/api/user/favorites',
          { pandascore_team_id: selectedTeamObj.pandascore_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      triggerAlert(
        'Apply Changes', 
        'All your profile modifications and favorite team have been successfully saved in our Database!', 
        'alert',
        () => {
          onUpdateUser({ ...user, username, email, password, favoriteTeam: selectedFavorite });
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
            
            <div className="flex flex-col gap-3 max-w-xs mx-auto text-sm w-full">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Username :</span>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] rounded-lg px-3 py-0.5 text-xs w-44 outline-none font-bold text-center"
                />
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Email :</span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] rounded-lg px-3 py-0.5 text-xs w-44 outline-none font-bold text-center"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Password :</span>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] rounded-lg px-3 py-0.5 text-xs w-44 outline-none font-bold text-center"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 max-w-xs mx-auto w-full mt-2">
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

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-[250px] overflow-y-auto pr-2">
              {FAVORITE_TEAMS_DATABASE.map((team) => {
                const isSelected = selectedFavorite === team.name;
                return (
                  <div 
                    key={team.name}
                    onClick={() => handleSelectTeam(team.name)}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-2 border cursor-pointer transition ${
                      isSelected 
                        ? 'bg-[#5c3be0] border-[#7351f5]' 
                        : 'bg-[#181933] border-[#232549] hover:bg-[#1f2040]'
                    }`}
                  >
                    {team.icon ? (
                      <img src={team.icon} alt={team.name} className="w-8 h-8 object-contain select-none" />
                    ) : (
                      <div className="w-8 h-8 bg-[#232549] rounded-full flex items-center justify-center font-bold">?</div>
                    )}
                    <span className="text-[10px] font-bold text-center tracking-wide truncate w-full select-none">{team.name}</span>
                  </div>
                );
              })}
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