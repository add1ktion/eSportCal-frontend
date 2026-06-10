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
  'counter-strike': 'csgo',
  'league-of-legends': 'lol',
  'valorant': 'valorant',
  'dota-2': 'dota2',
  'r6-siege': 'r6',
  'rainbow-six-siege': 'r6'
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Upcoming'); 

  // 👤 User Profile State
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    favoriteTeam: ''
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
    dota2: ['The International', 'Dream League', 'ESL One', 'PGL Wallachia'],
    r6: ['MENA League', 'NA League', 'SA League', 'CN League', 'AP League']
  });

  // 🔄 PERSISTENCE CHECK ON STARTUP (Sprint 3)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }

    // Fetch matches from API
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

  // Filter matches based on sidebar filters
  const filteredMatches = matches.filter(match => {
    if (activeFilter === 'Upcoming' && match.status !== 'not_started') return false;
    if (activeFilter === 'Finished' && match.status !== 'finished') return false;
    if (activeFilter === 'Live' && match.status !== 'running') return false;

    const rawGame = match.game_slug || match.game_name;
    const gameId = GAME_SLUG_MAP[rawGame?.toLowerCase()];
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
    setActiveFilters(prev => ({ ...prev, [gameId]: updatedLeagues }));
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

  // Handle successful login from AuthModal
  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  // Handle Logout by clearing all local persistence
  const handleToggleLogin = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser({ username: '', email: '', password: '', favoriteTeam: 'Karmine Corp' });
      setIsLoggedIn(false);
      setShowSettings(false);
      triggerAlert('Logged Out', 'You have been successfully disconnected from your account.', 'alert');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser({ username: '', email: '', password: '', favoriteTeam: 'Karmine Corp' });
    setIsLoggedIn(false);
    setShowSettings(false);
    triggerAlert('Account Deleted', 'Your account and all associated data have been permanently removed.', 'alert');
  };

  return (
    <div className="min-h-screen bg-[#090a15] flex flex-col font-sans w-full overflow-x-hidden relative">
      
      {/* Navbar */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onToggleLogin={handleToggleLogin} 
        onOpenSettings={() => setShowSettings(true)} 
      />

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-6 p-8 flex-grow w-full max-w-full">
        <SidebarFilter activeFilters={activeFilters} onFilterChange={handleFilterChange} />

        <div className="flex-1 flex flex-col gap-6">
          {/* Favorite Team Feed */}
          {isLoggedIn && user.favoriteTeam && (
            <FavoriteTeams 
              favoriteMatches={favoriteMatches} 
              favoriteTeamName={user.favoriteTeam} 
            />
          )}

          {/* Standard Matches Container */}
          <main className="bg-[#111226] border border-[#232549] rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="border-b border-[#232549] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-wide m-0">Matches</h1>
              <MatchFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            </div>

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
                  No matches found for this week.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer onOpenAbout={() => setShowAbout(true)} onOpenContact={() => setShowContact(true)} />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLoginSuccess={handleLoginSuccess} // 👈 Passes our beautiful login success handler!
          triggerAlert={triggerAlert}
        />
      )}

      {/* User Settings */}
      {showSettings && (
        <UserSettings 
          user={user}
          onUpdateUser={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persists profile updates!
          }}
          onClose={() => setShowSettings(false)} 
          onDeleteAccount={handleDeleteAccount}
          triggerAlert={triggerAlert}
        />
      )}

      {/* About Us */}
      {showAbout && <AboutUsModal onClose={() => setShowAbout(false)} />}

      {/* Contact Us */}
      {showContact && <ContactModal onClose={() => setShowContact(false)} triggerAlert={triggerAlert} />}

      {/* Alert Modal */}
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