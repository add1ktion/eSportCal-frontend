// frontend/src/components/UserSettings.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// 🛡️ Your custom local team logos paths preserved!
const FAVORITE_TEAMS_DATABASE = [
  { name: 'Karmine Corp', icon: '/logos/Teams/KC.png' },
  { name: 'Fnatic', icon: '/logos/Teams/Fnatic.png' },
  { name: 'G2 Esports', icon: '/logos/Teams/G2.png' },
  { name: 'GiantX', icon: '/logos/Teams/GiantX.png' },
  { name: 'MKOI', icon: '/logos/Teams/MKOI.png' },
  { name: 'Natus Vincere', icon: '/logos/Teams/Natus_Vincere.png' },
  { name: 'Shifters', icon: '/logos/Teams/Shifters.png' },
  { name: 'SK Gaming', icon: '/logos/Teams/SK_Gaming.png' },
  { name: 'Team Heretics', icon: '/logos/Teams/Team_Heretics.png' },
  { name: 'Team Vitality', icon: '/logos/Teams/Vitality.png' }
];

function UserSettings({ user, onUpdateUser, onClose, onDeleteAccount, triggerAlert }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [selectedFavorites, setSelectedFavorites] = useState(['Karmine Corp', 'Fnatic']);

  const toggleFavorite = (teamName) => {
    if (selectedFavorites.includes(teamName)) {
      setSelectedFavorites(prev => prev.filter(name => name !== teamName));
    } else {
      setSelectedFavorites(prev => [...prev, teamName]);
    }
  };

  const handleApplyChanges = () => {
    triggerAlert(
      'Apply Changes', 
      'All your profile modifications and favorite teams have been successfully applied!', 
      'alert',
      () => {
        onUpdateUser({ username, email, password });
        onClose();
      }
    );
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
      {/* Dashboard Card */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-[#111226] border border-[#232549] rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative my-8 cursor-default"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6">
          {/* ==================== USER SETTINGS SECTION ==================== */}
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

          {/* ==================== FAVORITE TEAMS GRID ==================== */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center">Favorite Teams</h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-[250px] overflow-y-auto pr-2">
              {FAVORITE_TEAMS_DATABASE.map((team) => {
                const isSelected = selectedFavorites.includes(team.name);
                return (
                  <div 
                    key={team.name}
                    onClick={() => toggleFavorite(team.name)}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-2 border cursor-pointer transition ${
                      isSelected 
                        ? 'bg-[#5c3be0] border-[#7351f5]' 
                        : 'bg-[#181933] border-[#232549] hover:bg-[#1f2040]'
                    }`}
                  >
                    {team.icon ? (
                      <img src={team.icon} alt={team.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 bg-[#232549] rounded-full flex items-center justify-center font-bold">?</div>
                    )}
                    <span className="text-[10px] font-bold text-center tracking-wide truncate w-full">{team.name}</span>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      readOnly
                      className="w-3 h-3 rounded accent-white cursor-pointer"
                    />
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