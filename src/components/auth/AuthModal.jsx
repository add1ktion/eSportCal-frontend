// frontend/src/components/AuthModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

function AuthModal({ initialMode = 'login', resetToken = '', onClose, onLoginSuccess, triggerAlert }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot-password' | 'reset-password'

  // 1. Log In States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // 2. Sign In (Register) States
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 3. Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');

  // 4. Reset Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // 5. Local Error State
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle User Log In Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 🛠️ DEV / TEST ACCOUNT BYPASS
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
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        identifier: loginIdentifier,
        password: loginPassword
      });

      const { token, user } = response.data;
      onLoginSuccess(user, token);
      triggerAlert('Welcome Back!', `Logged in successfully as ${user.username}!`, 'alert');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    }
  };

  // Handle User Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        username: registerUsername.trim(),
        email: registerEmail.toLowerCase().trim(),
        password: registerPassword
      });

      const { token, user } = response.data;
      
      if (token) {
        onLoginSuccess(user, token);
        triggerAlert('Account Created!', `Welcome to eSportCal, ${user.username}!`, 'alert');
      } else {
        // Verification email sent flow
        triggerAlert('Confirmation Sent!', 'Please check your email to verify your account before logging in.', 'alert');
        onClose();
      }

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Failed to create account.');
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await axios.post('http://localhost:5001/api/auth/forgot-password', {
        email: forgotEmail.toLowerCase().trim()
      });

      setSuccessMessage('If this email is registered, a password reset link has been sent to it.');
      setForgotEmail('');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  // Handle Reset Password Submit
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/auth/reset-password', {
        token: resetToken,
        password: newPassword
      });

      triggerAlert(
        'Password Reset Success!', 
        'Your password has been successfully updated. You can now log in using your new password.', 
        'alert',
        () => {
          setMode('login');
          setNewPassword('');
          setConfirmNewPassword('');
        }
      );
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.error || 'Failed to reset password. The link might be invalid or expired.');
    }
  };

  // SSO Login Redirect
  const handleSSOClick = (provider) => {
    window.location.href = `http://localhost:5001/api/auth/${provider.toLowerCase()}`;
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-[#111226] border border-[#232549] rounded-3xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto cursor-default"
      >
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl p-3 text-xs font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-3 text-xs font-bold text-center">
              ✅ {successMessage}
            </div>
          )}

          {/* ==================== 1. LOG IN VIEW ==================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-center border-b border-[#232549] pb-2">Log In</h2>
              
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

              <div className="text-right">
                <span 
                  onClick={() => { setMode('forgot-password'); setError(null); setSuccessMessage(null); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer hover:underline font-semibold"
                >
                  Forgot Password?
                </span>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2 rounded-xl font-bold text-sm transition cursor-pointer mt-2"
              >
                Log In
              </button>

              <div className="text-center text-xs text-slate-400 mt-2">
                Don't have an account?{' '}
                <span 
                  onClick={() => { setMode('register'); setError(null); setSuccessMessage(null); }}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-bold hover:underline"
                >
                  Sign Up
                </span>
              </div>

              {/* SSO Section */}
              {renderSSOSection(handleSSOClick)}
            </form>
          )}

          {/* ==================== 2. SIGN UP VIEW ==================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-center border-b border-[#232549] pb-2">Sign In</h2>

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

              <div className="text-center text-xs text-slate-400 mt-2">
                Already have an account?{' '}
                <span 
                  onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-bold hover:underline"
                >
                  Log In
                </span>
              </div>

              {/* SSO Section */}
              {renderSSOSection(handleSSOClick)}
            </form>
          )}

          {/* ==================== 3. FORGOT PASSWORD VIEW ==================== */}
          {mode === 'forgot-password' && (
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-center border-b border-[#232549] pb-2 font-sans text-white">Reset Password</h2>
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Enter your email address below and we'll send you a link to reset your password.
              </p>

              <div className="flex flex-col gap-2 text-sm mt-2">
                <span className="font-bold text-slate-300 text-xs">Email Address :</span>
                <input 
                  type="email" 
                  placeholder="Enter your registered email" 
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-2 text-xs outline-none font-semibold w-full"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2 rounded-xl font-bold text-sm transition cursor-pointer mt-2"
              >
                Send Reset Link
              </button>

              <div className="text-center text-xs text-slate-400 mt-2">
                Back to{' '}
                <span 
                  onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-bold hover:underline"
                >
                  Log In
                </span>
              </div>
            </form>
          )}

          {/* ==================== 4. RESET PASSWORD VIEW ==================== */}
          {mode === 'reset-password' && (
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-center border-b border-[#232549] pb-2 font-sans text-white">Create New Password</h2>
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Please enter and confirm your new password below.
              </p>

              <div className="flex flex-col gap-3 text-sm mt-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-slate-300">New Password :</span>
                  <input 
                    type="password" 
                    placeholder="Min 8 characters" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-44 outline-none font-semibold"
                    required
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-slate-300">Confirm :</span>
                  <input 
                    type="password" 
                    placeholder="Confirm password" 
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-44 outline-none font-semibold"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2 rounded-xl font-bold text-sm transition cursor-pointer mt-2"
              >
                Reset Password
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// Helper to render beautiful SSO mockup buttons
function renderSSOSection(handleSSOClick) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#232549] pt-4 mt-2">
      <div className="text-center text-[10px] uppercase tracking-wider text-slate-500 font-bold select-none">
        Or sign in with
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleSSOClick('Google')}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#ea4335]/10 hover:bg-[#ea4335]/20 text-[#ea4335] border border-[#ea4335]/30 rounded-lg font-bold text-xs cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSSOClick('Twitch')}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#9146ff]/10 hover:bg-[#9146ff]/20 text-[#a970ff] border border-[#9146ff]/30 rounded-lg font-bold text-xs cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Twitch
        </button>
      </div>
    </div>
  );
}

export default AuthModal;