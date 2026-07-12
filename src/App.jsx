import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  subDays, 
  isWithinInterval, 
  format,
  isSameDay
} from 'date-fns';
import Navbar from './components/layout/NavBar';
import SidebarFilter from './components/layout/SideBarFilter';
import Footer from './components/layout/Footer';
import AuthModal from './components/auth/AuthModal';
import UserSettings from './components/auth/UserSettings';
import FavoriteTeamModal from './components/auth/FavoriteTeamModal';
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
  'cs2': 'csgo',
  'counter-strike': 'csgo',
  'counter-strike-2': 'csgo',
  'league-of-legends': 'lol',
  'valorant': 'valorant',
  'dota-2': 'dota2',
  'r6-siege': 'r6',
  'rainbow-six-siege': 'r6'
};



// ⚙️ DEFINITIVE MAJOR LEAGUES DATABASE (Used for precise filtering)
const MAJOR_LEAGUES = {
  lol: ['LEC', 'LCK', 'LPL', 'LCS', 'Worlds', 'First Stand', 'MSI', 'EMEA Masters', 'LFL'],
  valorant: ['VCT EMEA', 'VCT Americas', 'VCT Pacific', 'VCT CN', 'Valorant Champions', 'VCT Masters'],
  csgo: ['PGL', 'IEM', 'ESL', 'Blast'],
  dota2: ['The International', 'Dream League', 'ESL One', 'PGL Wallachia'],
  r6: ['Europe League', 'North America League', 'Brazil League', 'LATAM League', 'Asia Pacific League', 'Six Invitational', 'Six Major']
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot-password' | 'reset-password'
  const [resetToken, setResetToken] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
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
  const [selectedDay, setSelectedDay] = useState(null);

  // Reset expanded match and selected day when week or filter changes
  useEffect(() => {
    setExpandedMatchId(null);
    setSelectedDay(null);
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
          // If the saved R6 filters do not contain the new Tier 1 leagues, reset R6 filters to new defaults
          const hasNewLeagues = parsed.r6.some(l => ['Europe League', 'North America League', 'Brazil League'].includes(l));
          if (!hasNewLeagues) {
            parsed.r6 = [...MAJOR_LEAGUES.r6];
          }
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
      const res = await axios.get(`${API_BASE_URL}/api/user/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dbFavorites = res.data.favorites;
      if (dbFavorites && dbFavorites.length > 0) {
        const savedTeamName = dbFavorites[0].team_name || '';
        
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

  // Handle successful login
  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    fetchUserFavorites(token, userData);
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

    // Check URL parameters for email verification result
    const verified = params.get('verified');
    if (verified) {
      if (verified === 'true') {
        triggerAlert('Email Verified!', 'Your account has been successfully verified! You can now log in.', 'alert');
        setAuthModalMode('login');
        setShowAuthModal(true);
      } else if (verified === 'already') {
        triggerAlert('Already Verified', 'Your email is already verified. You can log in.', 'alert');
        setAuthModalMode('login');
        setShowAuthModal(true);
      } else {
        triggerAlert('Verification Error', 'The verification link is invalid or has expired.', 'alert');
      }
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
    axios.get(`${API_BASE_URL}/api/matches`)
      .then(res => {
        setMatches(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching matches:', err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to determine if a match passes active sidebar filters (game & league)
  const isMatchPassedFilters = (match) => {
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
        if (acronym === 'Europe League') {
          return matchText.includes('EUROPE LEAGUE') || matchText.includes('EUROPE MENA LEAGUE') || matchText.includes('MENA LEAGUE');
        }
        if (acronym === 'North America League') {
          return matchText.includes('NORTH AMERICA LEAGUE') || matchText.includes('NA LEAGUE');
        }
        if (acronym === 'LATAM League') {
          return matchText.includes('LATAM LEAGUE') || matchText.includes('SOUTH AMERICA LEAGUE') || matchText.includes('SA LEAGUE');
        }
        if (acronym === 'Asia Pacific League') {
          return matchText.includes('ASIA PACIFIC LEAGUE') || matchText.includes('AP LEAGUE') || matchText.includes('JAPAN LEAGUE') || matchText.includes('SOUTH KOREA LEAGUE') || matchText.includes('OCEANIA LEAGUE') || matchText.includes('CN LEAGUE');
        }
        if (acronym === 'Six Major') {
          return matchText.includes('SIX MAJOR') || matchText.includes('MAJOR');
        }
      }
      if (gameId === 'dota2') {
        if (u === 'DREAM LEAGUE') {
          return matchText.includes('DREAM LEAGUE') || matchText.includes('DREAMLEAGUE');
        }
      }
      return matchText.includes(u);
    });

    if (matchedMajorLeague) {
      return allowedFilters.includes(matchedMajorLeague);
    }

    return true;
  };

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

    if (selectedDay) {
      const matchDate = new Date(match.scheduled_at);
      if (!isSameDay(matchDate, selectedDay)) return false;
    }

    return isMatchPassedFilters(match);
  });

  // Filter matches for the favorite team feed (bound to the selected week)
  const favoriteMatches = matches.filter(match => {
    const isFavoriteTeam = match.teams.some(team => team.name.toLowerCase().includes(user.favoriteTeam?.toLowerCase()));
    if (!isFavoriteTeam) return false;

    const matchDate = new Date(match.scheduled_at);
    const isInWeek = isWithinInterval(matchDate, {
      start: currentWeekStart,
      end: currentWeekEnd
    });
    if (!isInWeek) return false;

    if (selectedDay) {
      if (!isSameDay(matchDate, selectedDay)) return false;
    }

    return isMatchPassedFilters(match);
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

  function triggerAlert(title, message, type = 'alert', onConfirm = null) {
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
  }

  function closeAlert() {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }

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
        await axios.delete(`${API_BASE_URL}/api/user/me`, {
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
        onOpenFavorites={() => setShowFavoritesModal(true)} 
      />

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-6 p-8 flex-grow w-full max-w-full">
        <SidebarFilter activeFilters={activeFilters} onFilterChange={handleFilterChange} />

        <div className="flex-1 flex flex-col gap-6">
          {/* 📅 Global Weekly Navigation Bar (Option 2) */}
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111226] border border-[#232549] p-4 rounded-3xl shadow-xl select-none">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-300 mr-2">Calendar:</span>
              
              <button 
                onClick={handlePrevWeek} 
                title="Previous week"
                className="flex items-center justify-center w-10 h-[46px] rounded-xl border bg-[#1c1d33] border-[#232549] text-slate-400 hover:bg-[#232549] hover:text-white transition-all duration-200 cursor-pointer font-bold text-xs hover:scale-102"
              >
                ◀
              </button>
              
              <button 
                onClick={handleResetToCurrentWeek}
                title="Reset to current week"
                className="flex items-center justify-center px-4 h-[46px] rounded-xl border bg-[#1c1d33] border-[#232549] text-xs font-bold text-slate-200 hover:bg-[#232549] hover:text-white transition-all duration-200 cursor-pointer hover:scale-102"
              >
                {formatWeekRange()}
              </button>

              <button 
                onClick={handleNextWeek} 
                title="Next week"
                className="flex items-center justify-center w-10 h-[46px] rounded-xl border bg-[#1c1d33] border-[#232549] text-slate-400 hover:bg-[#232549] hover:text-white transition-all duration-200 cursor-pointer font-bold text-xs hover:scale-102"
              >
                ▶
              </button>
            </div>

            {/* 7 Days Daily Strip Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pr-2 custom-scrollbar">
              {Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)).map((day) => {
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const dayName = format(day, 'EEE'); // "Mon", "Tue"...
                const dayNum = format(day, 'dd'); // "20", "21"...

                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`flex flex-col items-center justify-center min-w-[50px] py-1.5 px-2.5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-102 ${
                      isSelected
                        ? 'bg-[#5c3be0] border-[#7351f5] text-white shadow-md shadow-[#5c3be0]/20'
                        : 'bg-[#1c1d33] border-[#232549] text-slate-400 hover:bg-[#232549] hover:text-white'
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold tracking-wider select-none">{dayName}</span>
                    <span className="text-xs font-extrabold select-none mt-0.5">{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

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
              <h1 className="text-3xl font-bold tracking-wide m-0">Matchs</h1>

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
          onClose={() => setShowSettings(false)} 
          onDeleteAccount={handleDeleteAccount}
          triggerAlert={triggerAlert}
        />
      )}

      {/* Favorite Team Selection */}
      {showFavoritesModal && (
        <FavoriteTeamModal
          user={user}
          onUpdateUser={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }}
          onClose={() => setShowFavoritesModal(false)}
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