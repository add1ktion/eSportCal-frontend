// frontend/src/components/AuthModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

function AuthModal({ onClose, onLoginSuccess, triggerAlert }) {
  // 1. Log In States
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Can be username or email
  const [loginPassword, setLoginPassword] = useState('');

  // 2. Sign In (Register) States
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 3. Local Error State to display validation errors inside the modal
  const [error, setError] = useState(null);

  // Handle User Log In Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 🛠️ TEST
    if (loginIdentifier === 'admin' && loginPassword === 'admin') {
      const mockUser = {
        username: 'Test',
        email: 'admin@esportcal.com',
        password: 'admin',
        favoriteTeam: 'Karmine Corp'
      };
      const mockToken = 'mock_jwt_token_for_local_testing_purposes';
      
      onLoginSuccess(mockUser, mockToken);
      triggerAlert('Welcome back!', `Logged in successfully as ${mockUser.username} (Dev Mode).`, 'alert');
      return; // Stops here, no API call made!
    }

    // ==================== REAL API CALL ====================
    try {
      // Calls Ilan's backend endpoint!
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        identifier: loginIdentifier,
        password: loginPassword
      });

      // If successful, pass the user data and JWT token to App.jsx
      const { token, user } = response.data;
      onLoginSuccess(user, token);

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    }
  };

  // Handle User Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Security Check: Verify passwords match before hitting the API
    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Calls Ilan's backend endpoint!
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        username: registerUsername,
        email: registerEmail,
        password: registerPassword
      });

      const { token, user } = response.data;
      onLoginSuccess(user, token);
      triggerAlert('Account Created!', `Welcome to eSportCal, ${user.username}!`, 'alert');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Failed to create account.');
    }
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
    >
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-[#111226] border border-[#232549] rounded-3xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto cursor-default"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6">
          {/* Display Error Message if any */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl p-3 text-xs font-bold text-center animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {/* ==================== LOG IN SECTION ==================== */}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center border-b border-[#232549] pb-2">
              Log In
            </h2>
            
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Username/Email :</span>
                <input 
                  type="text" 
                  placeholder="Enter username or email" 
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Password :</span>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2 rounded-xl font-bold text-sm transition cursor-pointer mt-2"
            >
              Log In
            </button>
          </form>

          {/* ==================== SIGN IN (REGISTER) SECTION ==================== */}
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 border-t border-[#232549] pt-6">
            <h2 className="text-2xl font-bold text-center border-b border-[#232549] pb-2">
              Sign In
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Username :</span>
                <input 
                  type="text" 
                  placeholder="Enter your username" 
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Email :</span>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Password :</span>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Confirm :</span>
                <input 
                  type="password" 
                  placeholder="Confirm your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2 rounded-xl font-bold text-sm transition cursor-pointer mt-2"
            >
              Sign Up
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default AuthModal;