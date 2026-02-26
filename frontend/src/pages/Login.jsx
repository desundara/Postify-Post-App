import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

// ✅ FIX: Moved outside component
const API_URL = process.env.REACT_APP_API_URL || '';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    axios.post(`${API_URL}/auth/login`, { username, password })
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({ username: response.data.username, id: response.data.id, status: true, loading: false });
          navigate("/");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Login failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 shadow-lg rounded-2xl bg-brand-600">
            <span className="text-xl font-bold text-white font-display">P</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display dark:text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>

        <div className="p-8 bg-white border-gray-100 shadow-sm card dark:bg-gray-900 dark:border-gray-800">
          {error && (
            <div className="px-4 py-3 mb-5 text-sm text-red-600 border border-red-200 rounded-xl bg-red-50 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 font-body">
              {error}
            </div>
          )}

          <form onSubmit={login} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-display font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-gray-900 placeholder-gray-400 border-gray-200 input-field bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-display font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-gray-900 placeholder-gray-400 border-gray-200 input-field bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 mt-2 text-base btn-primary">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></span>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-sm text-center text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/registration" className="font-medium text-brand-600 dark:text-brand-400 font-display hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;