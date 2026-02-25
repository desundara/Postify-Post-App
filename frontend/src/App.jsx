import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Registration from "./pages/Registration";
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from './helpers/AuthContext';
import { useTheme } from './helpers/ThemeContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Navbar({ authState, logout }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 max-w-6xl px-4 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 transition-transform rounded-lg shadow-md bg-brand-600 group-hover:scale-105">
            <span className="text-sm font-bold text-white font-display">P</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 font-display dark:text-white">Postify</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          {!authState.status ? (
            <>
              <Link to="/login" className="text-gray-600 btn-ghost dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40">
                Sign In
              </Link>
              <Link to="/registration" className="btn-primary">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-600 btn-ghost dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40">
                Feed
              </Link>
              <Link to="/createpost" className="text-gray-600 btn-ghost dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40">
                Write
              </Link>
              <Link to={`/profile/${authState.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-center text-xs font-bold text-white rounded-full w-7 h-7 bg-gradient-to-br from-brand-400 to-brand-600 font-display">
                  {authState.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 font-body dark:text-gray-200">{authState.username}</span>
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-500 btn-ghost dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Sign Out
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center ml-1 transition-all border border-gray-200 w-9 h-9 rounded-xl dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/auth/auth`, { headers: { accessToken: token } })
        .then(res => {
          if (!res.data.error) {
            setAuthState({ username: res.data.username, id: res.data.id, status: true, loading: false });
          } else {
            setAuthState({ username: "", id: 0, status: false, loading: false });
          }
        })
        .catch(() => setAuthState({ username: "", id: 0, status: false, loading: false }));
    } else {
      setAuthState({ username: "", id: 0, status: false, loading: false });
    }

    const handleStorageChange = () => {
      if (!localStorage.getItem("accessToken")) {
        setAuthState({ username: "", id: 0, status: false, loading: false });
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false, loading: false });
  };

  if (authState.loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-600 animate-pulse-soft"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-950">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Navbar authState={authState} logout={logout} />
          <main className="max-w-6xl px-4 py-8 mx-auto">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/createpost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/post/:id" element={<ProtectedRoute><Post /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/changepassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </main>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
