// frontend/src/components/AuthModal.jsx
import React from 'react';
import { X } from 'lucide-react';

function AuthModal({ onClose, onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); // Simulates successful login
  };

  return (
    <div 
      onClick={onClose} // Clicking the blurred backdrop closes the modal
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
    >
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
        className="bg-[#111226] border border-[#232549] rounded-3xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto cursor-default"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ==================== LOG IN SECTION ==================== */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center border-b border-[#232549] pb-2">
              Log In
            </h2>
            
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Username/Email :</span>
                <input 
                  type="text" 
                  placeholder="Enter username or email" 
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Password :</span>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
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
          </div>

          {/* ==================== SIGN IN SECTION ==================== */}
          <div className="flex flex-col gap-4 border-t border-[#232549] pt-6">
            <h2 className="text-2xl font-bold text-center border-b border-[#232549] pb-2">
              Sign In
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Username :</span>
                <input 
                  type="text" 
                  placeholder="Enter your username" 
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Email :</span>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Password :</span>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-300">Confirm :</span>
                <input 
                  type="password" 
                  placeholder="Confirm your password" 
                  className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                  required
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={onLogin}
              className="w-full bg-[#c0c2d6] hover:bg-white text-[#090a15] py-2 rounded-xl font-bold text-sm transition cursor-pointer mt-2"
            >
              Sign Up
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AuthModal;