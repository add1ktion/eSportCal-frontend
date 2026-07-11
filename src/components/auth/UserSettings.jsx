// frontend/src/components/auth/UserSettings.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { API_BASE_URL } from '../../config';

function UserSettings({ user, onClose, onDeleteAccount, triggerAlert }) {
  const [username] = useState(user.username);
  const [email] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleApplyChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
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
      } else {
        triggerAlert('No Changes', 'Please enter a new password to apply changes.', 'alert');
        return;
      }

      await axios.put(
        `${API_BASE_URL}/api/user/me`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      triggerAlert(
        'Success', 
        'Your password has been successfully updated in our Database!', 
        'alert',
        () => {
          onClose();
        }
      );

    } catch (err) {
      console.error('Error saving profile changes in DB:', err);
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
        className="bg-[#111226] border border-[#232549] rounded-3xl p-8 max-w-md w-full shadow-2xl relative my-8 cursor-default"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-center text-white">Account Settings</h2>
            
            <div className="flex flex-col gap-3 text-sm w-full mt-2">
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

            <div className="flex flex-col gap-2 w-full mt-4">
              <button 
                onClick={handleApplyChanges}
                className="w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2.5 rounded-xl font-bold text-xs transition cursor-pointer hover:scale-102 active:scale-98 shadow-md"
              >
                Update Password
              </button>
              <button 
                onClick={handleDeleteClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer hover:scale-102 active:scale-98"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserSettings;