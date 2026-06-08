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
import FavoriteTeams from './components/FavoriteTeams';
import MatchItem from './components/MatchItem';
import MatchFilters from './components/MatchFilters';

const GAME_SLUG_MAP = {
  'cs-go': 'csgo',
  'cs-2': 'csgo',
  'league-of-legends': 'lol',
  'valorant': 'valorant',
  'dota-2': 'dota2'
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All'); // 👈 State des filtres d'Ilan

  // 👤 User State
  const [user, setUser] = useState({
    username: 'Antoine_Bats',
    email: 'antoine@bats.com',
    password: 'password123',
    favoriteTeam: 'Karmine Corp'
  });

  // 🚨 Custom Alert Modal State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    onConfirm: null
  });

  // ⚙️ ACTIVE FILTERS STATE
  const [activeFilters, setActiveFilters] = useState({
    lol: ['LEC', 'LCK', 'LPL', 'LCS'],
    valorant: ['VCT EMEA', 'VCT Americas', 'VCT Pacific', 'VCT CN'],
    csgo: ['PGL', 'IEM', 'ESL', 'Blast'],
    dota2: ['The International', 'Dream League', 'ESL One', 'PGL Wallachia']
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

  // 🧹 FUZZY FILTER ALGORITHM + Ilan's "Live/Finished" Filters
  const filteredMatches = matches.filter(match => {
    // 1. Filter by Live/Finished/Upcoming (Ilan's Filter)
    if (activeFilter === 'Upcoming' && match.status !== 'not_started') return false;
    if (activeFilter === 'Finished' && match.status !== 'finished') return false;
    if (activeFilter === 'Live' && match.status !== 'running') return false;

    // 2. Filter by Sidebar Checkboxes
    const gameId = GAME_SLUG_MAP[match.game_slug];
    if (!gameId) return false;

    const allowedLeagues = activeFilters[gameId] || [];
    if (allowedLeagues.length === 0) return false;

    return allowedLeagues.some(leagueAcronym => 
      match.league_name.toUpperCase().includes(leagueAcronym.toUpperCase()) ||
      match.serie_name.toUpperCase().includes(leagueAcronym.toUpperCase()) ||
      match.stage_name?.toUpperCase().includes(leagueAcronym.toUpperCase())
    );
  });

  // Filter matches for the favorite team feed
  const favoriteMatches = matches.filter(match => 
    match.teams.some(team => team.name.toLowerCase().includes(user.favoriteTeam?.toLowerCase()))
  );

  const handleFilterChange = (gameId, updatedLeagues) => {
    setActiveFilters(prev => ({
      ...prev,
      [gameId]: updatedLeagues
    }));
  };

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
        
        {/* Sidebar Filter */}
        <SidebarFilter activeFilters={activeFilters} onFilterChange={handleFilterChange} />

        {/* Dynamic vertical stack */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* 👥 Dynamic Favorite Teams Banner (Figma Logged In with Ilan's Design !) */}
          {isLoggedIn && user.favoriteTeam && (
            <FavoriteTeams 
              favoriteMatches={favoriteMatches} 
              favoriteTeamName={user.favoriteTeam} 
            />
          )}

          {/* ==================== STANDARD MATCHES CONTAINER ==================== */}
          <main className="bg-[#111226] border border-[#232549] rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
            
            {/* Header of Matches Container */}
            <div className="border-b border-[#232549] pb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-wide m-0">Matches</h1>
              
              {/* Filter buttons using Ilan's component */}
              <MatchFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            </div>

            {/* Match Cards List (Rendering Ilan's MatchItem dynamically !) */}
            <div className="flex flex-col overflow-y-auto max-h-[500px] border border-[#232549]/50 rounded-2xl">
              {loading ? (
                <div className="p-8 text-center text-slate-400 font-semibold animate-pulse">
                  Loading e-sport matches...
                </div>
              ) : filteredMatches.length > 0 ? (
                filteredMatches.map(match => (
                  <MatchItem key={match.id} match={match} />
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 font-semibold text-sm">
                  No upcoming matches match your active filters.
                </div>
              )}
            </div>

          </main>
        </div>

      </div>

      {/* 3. Footer */}
      <Footer onOpenAbout={() => setShowAbout(true)} onOpenContact={() => setShowContact(true)} />

      {/* OVERLAY MODALS */}
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