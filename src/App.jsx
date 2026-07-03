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
import Navbar from './components/layout/NavBar';
import SidebarFilter from './components/layout/SideBarFilter';
import Footer from './components/layout/Footer';
import AuthModal from './components/auth/AuthModal';
import UserSettings from './components/auth/UserSettings';
import AlertModal from './components/common/AlertModal';
import AboutUsModal from './components/common/AboutUsModal';
import ContactModal from './components/common/ContactModal';
import FavoriteTeams from './components/matches/FavoriteTeams';
import MatchItem from './components/matches/MatchItem';
import MatchFilters from './components/matches/MatchFilters';

// Helper to map PandaScore game slugs/names to our sidebar game IDs
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

const FAVORITE_TEAMS_MAP = {
  128268: 'Karmine Corp',
  3201: 'Fnatic',
  3210: 'G2 Esports',
  136005: 'GiantX',
  137078: 'MKOI',
  3214: 'Natus Vincere',
  138612: 'Shifters',
  3212: 'SK Gaming',
  132212: 'Team Heretics',
  3213: 'Vitality'
};

// ⚙️ DEFINITIVE MAJOR LEAGUES DATABASE (Used for precise filtering)
const MAJOR_LEAGUES = {
  lol: ['LEC', 'LCK', 'LPL', 'LCS', 'Worlds', 'First Stand', 'MSI', 'EMEA Masters', 'LFL'],
  valorant: ['VCT EMEA', 'VCT Americas', 'VCT Pacific', 'VCT CN', 'Valorant Champions', 'VCT Masters'],
  csgo: ['PGL', 'IEM', 'ESL', 'Blast'],
  dota2: ['The International', 'Dream League', 'ESL One', 'PGL Wallachia'],
  r6: ['MENA League', 'NA League', 'SA League', 'CN League', 'AP League', 'Six Invitational', 'Six Major']
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot-password' | 'reset-password'
  const [resetToken, setResetToken] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Upcoming'); 
  const [expandedMatchId, setExpandedMatchId] = useState(null);

  // 📅 DYNAMIC WEEKLY NAVIGATION STATES
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  // Reset expanded match when week or filter changes
  useEffect(() => {
    setExpandedMatchId(null);
  }, [currentWeekStart, activeFilter]);

  // 👤 User State
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

  // ⚙️ ACTIVE FILTERS STATE (Persisted in localStorage)
  const [activeFilters, setActiveFilters] = useState(() => {
    const saved = localStorage.getItem('sidebarFilters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all games are keys in the parsed object
        if (parsed.lol && parsed.valorant && parsed.csgo && parsed.dota2 && parsed.r6) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved filters:", e);
      }
    }
    return {
      lol: [...MAJOR_LEAGUES.lol],
      valorant: [...MAJOR_LEAGUES.valorant],
      csgo: [...MAJOR_LEAGUES.csgo],
      dota2: [...MAJOR_LEAGUES.dota2],
      r6: [...MAJOR_LEAGUES.r6]
    };
  });

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sidebarFilters', JSON.stringify(activeFilters));
  }, [activeFilters]);

  // ⚙️ UX AUTO-SWITCH EFFECT: Automatically toggles between Finished/Upcoming based on selected week
  useEffect(() => {
    const today = new Date();
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });

    if (currentWeekStart < startOfThisWeek) {
      setActiveFilter('Finished'); // Week in the past -> show finished matches
    } else {
      setActiveFilter('Upcoming'); // Week in the future/present -> show upcoming matches
    }
  }, [currentWeekStart]); // Triggers every time you click next/prev week!

  // Fetch user favorites directly from PostgreSQL!
  const fetchUserFavorites = async (token, currentUser) => {
    try {
      const res = await axios.get('http://localhost:5001/api/user/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dbFavorites = res.data.favorites;
      if (dbFavorites && dbFavorites.length > 0) {
        const savedTeamId = dbFavorites[0].pandascore_team_id;
        const savedTeamName = FAVORITE_TEAMS_MAP[savedTeamId] || 'Karmine Corp';
        
        setUser(prev => ({
          ...prev,
          username: currentUser.username,
          email: currentUser.email,
          favoriteTeam: savedTeamName
        }));
      }
    } catch (err) {
      console.error('Error fetching favorites from DB:', err);
    }
  };

  // 🔄 PERSISTENCE CHECK ON STARTUP
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      fetchUserFavorites(token, parsedUser);
    }

    // Check URL parameters for password reset token
    const params = new URLSearchParams(window.location.search);
    const rToken = params.get('resetToken');
    if (rToken) {
      setResetToken(rToken);
      setAuthModalMode('reset-password');
      setShowAuthModal(true);
      // Clean query params from URL bar for clean UX
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check URL parameters for OAuth successful redirect
    const ssoToken = params.get('token');
    const ssoUserRaw = params.get('user');
    if (ssoToken && ssoUserRaw) {
      try {
        const ssoUser = JSON.parse(decodeURIComponent(ssoUserRaw));
        handleLoginSuccess(ssoUser, ssoToken);
        // Clean query params from URL bar for clean UX
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error('Failed to parse SSO user from URL params:', err);
      }
    }

    // Fetch matches from local Postgres cache
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

    if (activeFilter !== 'Live') {
      const matchDate = new Date(match.scheduled_at);
      const isInWeek = isWithinInterval(matchDate, {
        start: currentWeekStart,
        end: currentWeekEnd
      });
      if (!isInWeek) return false;
    }

    const rawGame = match.game_slug || match.game_name;
    const gameId = GAME_SLUG_MAP[rawGame?.toLowerCase()];
    if (!gameId) return false;

    const allowedFilters = activeFilters[gameId] || [];
    if (allowedFilters.length === 0) return false;

    const matchText = `${match.league_name} ${match.serie_name} ${match.stage_name || ''}`.toUpperCase();
    const gameMajorLeagues = MAJOR_LEAGUES[gameId] || [];

    const matchedMajorLeague = gameMajorLeagues.find(acronym => {
      const u = acronym.toUpperCase();
      if (gameId === 'lol') {
        if (u === 'MSI') {
          return matchText.includes('MID-SEASON INVITATIONAL') || matchText.includes('MSI');
        }
        if (u === 'WORLDS') {
          return matchText.includes('WORLD CHAMPIONSHIP') || matchText.includes('WORLDS');
        }
      }
      if (gameId === 'valorant') {
        if (u === 'VCT CN') {
          return (matchText.includes('CHINA') || matchText.includes('CN')) && matchText.includes('VCT');
        }
        if (u === 'VALORANT CHAMPIONS') {
          return matchText.includes('CHAMPIONS') || matchText.includes('VALORANT CHAMPIONS');
        }
        if (u === 'VCT MASTERS') {
          return matchText.includes('MASTERS') || matchText.includes('VCT MASTERS');
        }
      }
      if (gameId === 'r6') {
        if (acronym === 'NA League') {
          return matchText.includes('NORTH AMERICA LEAGUE') || matchText.includes('NA LEAGUE');
        }
        if (acronym === 'AP League') {
          return matchText.includes('ASIA PACIFIC LEAGUE') || matchText.includes('AP LEAGUE');
        }
        if (acronym === 'MENA League') {
          return matchText.includes('EUROPE MENA LEAGUE') || matchText.includes('MENA LEAGUE');
        }
      }
      return matchText.includes(u);
    });

    if (matchedMajorLeague) {
      return allowedFilters.includes(matchedMajorLeague);
    }

    return true;
  });

  // Filter matches for the favorite team feed (not bound to the selected week)
  const favoriteMatches = matches.filter(match => {
    return match.teams.some(team => team.name.toLowerCase().includes(user.favoriteTeam?.toLowerCase()));
  });

  const handleFilterChange = (gameId, updatedLeagues) => {
    setActiveFilters(prev => ({ ...prev, [gameId]: updatedLeagues }));
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

  // Handle successful login
  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    fetchUserFavorites(token, userData);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser({ username: '', email: '', password: '', favoriteTeam: '' });
    setIsLoggedIn(false);
    setShowSettings(false);
    triggerAlert('Logged Out', 'You have been successfully disconnected from your account.', 'alert');
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await axios.delete('http://localhost:5001/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser({ username: '', email: '', password: '', favoriteTeam: '' });
      setIsLoggedIn(false);
      setShowSettings(false);
      triggerAlert('Account Deleted', 'Your account and all associated data have been permanently removed.', 'alert');
    } catch (err) {
      console.error('Error deleting account from DB:', err);
      triggerAlert('Error', 'Failed to delete your account from the database.', 'alert');
    }
  };

  return (
    <div className="min-h-screen bg-[#090a15] flex flex-col font-sans w-full overflow-x-hidden relative">
      
      {/* Header */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onOpenLogin={() => { setAuthModalMode('login'); setShowAuthModal(true); }}
        onOpenRegister={() => { setAuthModalMode('register'); setShowAuthModal(true); }}
        onLogout={handleLogout}
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
            <div className="flex flex-col border border-[#232549]/50 rounded-2xl">
              {loading ? (
                <div className="p-8 text-center text-slate-400 font-semibold animate-pulse">
                  Loading e-sport matches...
                </div>
              ) : filteredMatches.length > 0 ? (
                filteredMatches.map(match => (
                  <MatchItem 
                    key={match.id} 
                    match={match} 
                    isExpanded={expandedMatchId === match.id}
                    onToggleExpand={() => setExpandedMatchId(expandedMatchId === match.id ? null : match.id)}
                  />
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
          initialMode={authModalMode}
          resetToken={resetToken}
          onClose={() => { setShowAuthModal(false); setResetToken(''); }} 
          onLoginSuccess={handleLoginSuccess}
          triggerAlert={triggerAlert}
        />
      )}

      {/* User Settings */}
      {showSettings && (
        <UserSettings 
          user={user}
          onUpdateUser={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
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