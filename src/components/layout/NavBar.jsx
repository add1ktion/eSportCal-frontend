// frontend/src/components/Navbar.jsx
import React from 'react';
import { User } from 'lucide-react';

/**
 * Navbar component.
 * Parameters:
 * - isLoggedIn: boolean to display login or logout.
 * - onToggleLogin: function to handle login/logout button click.
 * - onOpenSettings: function triggered when clicking the user profile icon.
 */
function Navbar({ isLoggedIn, onOpenLogin, onOpenRegister, onLogout, onOpenSettings }) {
  return (
    <header className="w-full bg-[#5c3be0] py-4 px-12 flex items-center justify-between shadow-lg rounded-b-3xl border-b border-[#7351f5]/30">
      <span className="text-2xl font-bold tracking-wide text-white select-none">
        eSportCal
      </span>
      
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={onOpenSettings}
              className="px-6 py-2 bg-[#3b1d98] hover:bg-[#2d1282] rounded-xl font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-sm"
              title="My eSportCal Account Settings"
            >
              My eSportCal
            </button>
            <button
              onClick={onLogout}
              className="px-6 py-2 rounded-xl font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-200 bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onOpenLogin}
              className="px-6 py-2 rounded-xl font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-200 bg-green-500 hover:bg-green-600 cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={onOpenRegister}
              className="px-6 py-2 rounded-xl font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-200 bg-[#7351f5] hover:bg-[#6346d1] border border-[#8a6dfc]/30 cursor-pointer"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;