// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  subDays, 
  isWithinInterval, 
  format 
} from 'date-fns';
import Navbar from './components/NavBar'; // Preserved your capital 'B'
import SidebarFilter from './components/SideBarFilter'; // Preserved your capital 'B' and 'F'
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import UserSettings from './components/UserSettings';
import AlertModal from './components/AlertModal';
import AboutUsModal from './components/AboutUsModal';
import ContactModal from './components/ContactModal';
import FavoriteTeams from './components/FavoriteTeams';
import MatchItem from './components/MatchItem';
import MatchFilters from './components/MatchFilters';

// Helper to map PandaScore game slugs/names to our sidebar game IDs (Defensive Dev)
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

// ⚙️ DEFINITIVE MAJOR LEAGUES DATABASE (Used for precise filtering)
const MAJOR_LEAGUES = {
  lol: ['LEC', 'LCK', 'LPL', 'LCS'],
  valorant: ['VCT EMEA', 'VCT Americas', 'VCT Pacific', 'VCT CN'],
  csgo: ['PGL', 'IEM', 'ESL', 'Blast'],
  dota2: ['The International', 'Dream League', 'ESL One', 'PGL Wallachia'],
  r6: ['MENA League', 'NA League', 'SA League', 'CN League', 'AP League']
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

  // 📅 DYNAMIC WEEKLY NAVIGATION STATES
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  // 👤 User State
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
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

  // 🧹 SMART INTELLIGENT FILTER ALGORITHM
  const filteredMatches = matches.filter(match => {
    // 1. Filter by Live/Finished/Upcoming (Matches Tab Filter)
    if (activeFilter === 'Upcoming' && match.status !== 'not_started') return false;
    if (activeFilter === 'Finished' && match.status !== 'finished') return false;
    if (activeFilter === 'Live' && match.status !== 'running') return false;

    // 2. Filter by Current Selected Week (Applies to Upcoming and Finished, Live is real-time!)
    if (activeFilter !== 'Live') {
      const matchDate = new Date(match.scheduled_at);
      const isInWeek = isWithinInterval(matchDate, {
        start: currentWeekStart,
        end: currentWeekEnd
      });
      if (!isInWeek) return false;
    }

    // 3. Filter by Sidebar Checkboxes
    const rawGame = match.game_slug || match.game_name;
    const gameId = GAME_SLUG_MAP[rawGame?.toLowerCase()];
    if (!gameId) return false;

    const allowedFilters = activeFilters[gameId] || [];
    if (allowedFilters.length === 0) return false; // Game completely unchecked -> hide

    // Compile all match text metadata to perform a fuzzy check
    const matchText = `${match.league_name} ${match.serie_name} ${match.stage_name || ''}`.toUpperCase();
    const gameMajorLeagues = MAJOR_LEAGUES[gameId] || [];

    // Find if this match belongs to a major league listed in our sidebar
    const matchedMajorLeague = gameMajorLeagues.find(acronym => 
      matchText.includes(acronym.toUpperCase())
    );

    if (matchedMajorLeague) {
      // It belongs to a major league! Only show it if the user has it explicitly checked
      return allowedFilters.includes(matchedMajorLeague);
    }

    // It belongs to a minor league (not listed in sidebar).
    // We show it by default as long as the parent game is checked!
    return true;
  });

  // Filter matches for the favorite team feed (shows all matches of your team within the selected week)
  const favoriteMatches = matches.filter(match => {
    const isTeamMatch = match.teams.some(team => team.name.toLowerCase().includes(user.favoriteTeam?.toLowerCase()));
    if (!isTeamMatch) return false;

    const matchDate = new Date(match.scheduled_at);
    return isWithinInterval(matchDate, { start: currentWeekStart, end: currentWeekEnd });
  });

  const handleFilterChange = (gameId, updatedLeagues) => {
    setActiveFilters(prev => ({
      ...prev,
      [gameId]: updatedLeagues
    }));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => subDays(prev, 7));
  };

  const handleResetToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const formatWeekRange = () => {
    const startStr = format(currentWeekStart, 'dd MMM');
    const endStr = format(currentWeekEnd, 'dd MMM yyyy');
    return `${startStr} - ${endStr}`;
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

  // Handle successful login from AuthModal (Sprint 3)
  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

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
          
          {/* Favorite Team Feed */}
          {isLoggedIn && user.favoriteTeam && (
            <FavoriteTeams 
              favoriteMatches={favoriteMatches} 
              favoriteTeamName={user.favoriteTeam} 
            />
          )}

          {/* Standard Matches Container */}
          <main className="bg-[#111226] border border-[#232549] rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
            
            {/* Header of Matches Container */}
            <div className="border-b border-[#232549] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-wide m-0">Matches</h1>
              
              {/* 📅 Figma Style Weekly Navigation Bar */}
              <div className="flex items-center gap-4 bg-[#1c1d33] border border-[#232549] px-4 py-1.5 rounded-2xl self-center sm:self-auto shadow-inner select-none">
                <button 
                  onClick={handlePrevWeek} 
                  title="Previous Week"
                  className="text-slate-400 hover:text-white transition font-black text-sm cursor-pointer hover:scale-125"
                >
                  ◀
                </button>
                <span 
                  onClick={handleResetToCurrentWeek}
                  title="Reset to current week"
                  className="text-xs font-bold text-slate-200 cursor-pointer hover:text-white"
                >
                  {formatWeekRange()}
                </span>
                <button 
                  onClick={handleNextWeek} 
                  title="Next Week"
                  className="text-slate-400 hover:text-white transition font-black text-sm cursor-pointer hover:scale-125"
                >
                  ▶
                </button>
              </div>

              {/* Filter buttons */}
              <MatchFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            </div>

            {/* Match Cards List */}
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
                  No matches found for this week. Try changing the week or active filters.
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
          onLoginSuccess={handleLoginSuccess} // 👈 FIXED: We pass the real login success handler!
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