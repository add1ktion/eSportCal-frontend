// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import SidebarFilter from './components/SidebarFilter';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import UserSettings from './components/UserSettings';
import AlertModal from './components/AlertModal';
import AboutUsModal from './components/AboutUsModal';
import ContactModal from './components/ContactModal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👤 User State
  const [user, setUser] = useState({
    username: 'Antoine_Bats',
    email: 'antoine@bats.com',
    password: 'password123'
  });

  // 🚨 Custom Alert Modal State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    onConfirm: null
  });

  useEffect(() => {
    axios.get('http://localhost:5001/api/matches')
      .then(res => {
        setMatches(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching matches:', err);
        setLoading(false);
      });
  }, []);

  const triggerAlert = (title, message, type = 'alert', onConfirm = null) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeAlert();
      }
    });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  const handleToggleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setShowSettings(false);
      triggerAlert('Logged Out', 'You have been successfully disconnected from your account.', 'alert');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleDeleteAccount = () => {
    setIsLoggedIn(false);
    setShowSettings(false);
    triggerAlert('Account Deleted', 'Your account and all associated data have been permanently removed.', 'alert');
  };

  return (
    <div className="min-h-screen bg-[#090a15] flex flex-col font-sans w-full overflow-x-hidden relative">
      
      {/* 1. Header (Navbar) */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onToggleLogin={handleToggleLogin} 
        onOpenSettings={() => setShowSettings(true)} 
      />

      {/* 2. Main Section */}
      <div className="flex flex-col lg:flex-row gap-6 p-8 flex-grow w-full max-w-full">
        
        {/* Sidebar */}
        <SidebarFilter />

        {/* Matches Container */}
        <main className="flex-1 bg-[#111226] border border-[#232549] rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
          
          {/* Header of Matches Container */}
          <div className="border-b border-[#232549] pb-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-wide m-0">Matches</h1>
            
            {/* Filter buttons */}
            <div className="flex gap-2 text-xs">
              <button className="px-4 py-1.5 rounded-full bg-[#5c3be0] font-bold text-white cursor-pointer">All</button>
              <button className="px-4 py-1.5 rounded-full bg-[#1c1d33] border border-[#232549] text-slate-400 font-bold hover:text-white transition cursor-pointer">Upcoming</button>
              <button className="px-4 py-1.5 rounded-full bg-[#1c1d33] border border-[#232549] text-slate-400 font-bold hover:text-white transition cursor-pointer">Finished</button>
              <button className="px-4 py-1.5 rounded-full bg-red-500 font-bold text-white animate-pulse cursor-pointer">Live</button>
            </div>
          </div>

          {/* Match Cards List */}
          <div className="flex flex-col overflow-y-auto max-h-[600px] border border-[#232549]/50 rounded-2xl">
            {loading ? (
              <div className="p-8 text-center text-slate-400 font-semibold animate-pulse">
                Loading e-sport matches...
              </div>
            ) : matches.length > 0 ? (
              matches.map(match => (
                // 🧹 INLINE PLACEHOLDER (Prevents Git conflicts with Ilan's branch !)
                <div 
                  key={match.id} 
                  className="w-full border-b border-[#232549] py-4 px-6 flex items-center justify-between text-xs text-slate-300 bg-[#12132b]/30 hover:bg-[#161836]/40 transition"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-100 text-sm">{match.name}</span>
                    <span className="text-slate-500">{match.league_name}</span>
                  </div>
                  <span className="font-black text-[#5c3be0] bg-[#5c3be0]/10 px-3 py-1 rounded-full uppercase text-[10px]">
                    {match.game}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 font-semibold">
                No upcoming matches found.
              </div>
            )}
          </div>

        </main>
      </div>

      {/* 3. Footer */}
      <Footer onOpenAbout={() => setShowAbout(true)} onOpenContact={() => setShowContact(true)} />

      {/* ==================== OVERLAY MODALS ==================== */}
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLogin={() => {
            setIsLoggedIn(true);
            setShowAuthModal(false);
            triggerAlert('Welcome back!', `Logged in successfully as ${user.username}.`, 'alert');
          }}
        />
      )}

      {/* User Settings */}
      {showSettings && (
        <UserSettings 
          user={user}
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
          onClose={() => setShowSettings(false)} 
          onDeleteAccount={handleDeleteAccount}
          triggerAlert={triggerAlert}
        />
      )}

      {/* About Us & FAQ */}
      {showAbout && (
        <AboutUsModal onClose={() => setShowAbout(false)} />
      )}

      {/* Contact Us */}
      {showContact && (
        <ContactModal onClose={() => setShowContact(false)} triggerAlert={triggerAlert} />
      )}

      {/* Custom Reusable Alert / Confirm Modal */}
      <AlertModal 
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
        onCancel={closeAlert}
      />

    </div>
  );
}

export default App;