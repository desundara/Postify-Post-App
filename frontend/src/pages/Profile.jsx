import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

// ✅ FIX: Moved outside component so useEffect doesn't need it as a dependency
const API_URL = process.env.REACT_APP_API_URL || '';

function Profile() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      axios.get(`${API_URL}/auth/basicinfo/${id}`),
      axios.get(`${API_URL}/posts/byUserId/${id}`)
    ])
    .then(([userRes, postsRes]) => {
      setUsername(userRes.data.username);
      setListOfPosts(postsRes.data || []);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.response?.status === 404 ? "User not found" : "Failed to load profile");
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="h-40 mb-4 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      {[1, 2].map(i => <div key={i} className="h-24 mb-3 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>)}
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center px-4 py-20 animate-fade-in">
      <p className="text-center text-gray-500 dark:text-gray-400 font-body">{error}</p>
      <button onClick={() => navigate("/")} className="mt-4 btn-primary">Go Home</button>
    </div>
  );

  const isOwnProfile = authState.username === username;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Profile header */}
      <div className="p-6 mb-5 text-center bg-white border-gray-100 shadow-sm card dark:bg-gray-900 dark:border-gray-800 sm:p-8">
        <div className="flex items-center justify-center mx-auto mb-3 text-2xl font-extrabold text-white shadow-md w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 font-display">
          {username?.[0]?.toUpperCase()}
        </div>
        <h1 className="mb-1 text-lg font-extrabold text-gray-900 font-display sm:text-xl dark:text-white">{username}</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 font-body">{listOfPosts.length} posts</p>

        {isOwnProfile && (
          <button
            onClick={() => navigate('/changepassword')}
            className="w-full mt-4 text-sm text-gray-600 border border-gray-200 btn-ghost dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 dark:border-gray-700 sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change Password
          </button>
        )}
      </div>

      {/* Posts */}
      <h2 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase font-display dark:text-gray-500">Posts</h2>
      <div className="flex flex-col gap-3">
        {listOfPosts.length === 0 ? (
          <div className="p-8 text-center bg-white border-gray-100 shadow-sm card dark:bg-gray-900 dark:border-gray-800">
            <p className="text-sm text-gray-400 dark:text-gray-500 font-body">No posts yet.</p>
          </div>
        ) : (
          listOfPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              className="card bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 p-4 sm:p-6 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md hover:-translate-y-0.5 group transition-all"
            >
              <h3 className="font-display font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                {post.title}
              </h3>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm font-body line-clamp-2">{post.postText}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <span>🤍</span>
                <span>{post.Likes?.length || 0} likes</span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;