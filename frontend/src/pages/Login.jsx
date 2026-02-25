import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

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

    axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { username, password })
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
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-display font-bold text-xl">P</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-body">
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
                className="input-field bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                className="input-field bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-2 py-3 w-full text-base">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Don't have an account?{' '}
          <Link to="/registration" className="text-brand-600 dark:text-brand-400 font-display font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
