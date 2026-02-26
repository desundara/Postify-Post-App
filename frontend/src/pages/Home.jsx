import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../helpers/AuthContext';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios.get(`${API_URL}/posts`, {
        headers: { accessToken: localStorage.getItem("accessToken") }
      })
      .then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setLikedPosts(response.data.likedPosts.map((like) => like.PostId));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
    }
  }, [authState.status, navigate]);

  const likePost = (postId) => {
    axios.post(
      `${API_URL}/likes`,
      { PostId: postId },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then((response) => {
      setListOfPosts(listOfPosts.map((post) => {
        if (post.id === postId) {
          if (response.data.liked) {
            return { ...post, Likes: [...post.Likes, 0] };
          } else {
            const likesArray = [...post.Likes];
            likesArray.pop();
            return { ...post, Likes: likesArray };
          }
        }
        return post;
      }));
      if (likedPosts.includes(postId)) {
        setLikedPosts(likedPosts.filter((id) => id !== postId));
      } else {
        setLikedPosts([...likedPosts, postId]);
      }
    });
  };

  if (loading) return (
    <div className="flex flex-col gap-3 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-200 h-36 rounded-2xl dark:bg-gray-800"></div>
      ))}
    </div>
  );

  if (listOfPosts.length === 0) return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center animate-fade-in">
      <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/40">
        <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-800 font-display dark:text-gray-100">No posts yet</h3>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Be the first one to write something!</p>
      <Link to="/createpost" className="btn-primary">Write a Post</Link>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 font-display sm:text-2xl dark:text-white">Feed</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">{listOfPosts.length} posts</p>
        </div>
        <Link to="/createpost" className="btn-primary text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Write</span>
          <span className="sm:hidden">Post</span>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {listOfPosts.map((post, key) => (
          <article
            key={key}
            onClick={() => navigate(`/post/${post.id}`)}
            className="card bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 p-4 sm:p-6 cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md hover:-translate-y-0.5 group animate-slide-up"
            style={{ animationDelay: `${key * 50}ms` }}
          >
            <h2 className="font-display font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="mb-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-sm font-body line-clamp-2">
              {post.postText}
            </p>
            <div className="flex items-center justify-between">
              <Link
                to={`/profile/${post.UserId}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 sm:gap-2 group/author min-w-0"
              >
                <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-bold text-white rounded-full sm:w-7 sm:h-7 bg-gradient-to-br from-brand-400 to-brand-600 font-display">
                  {post.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs text-gray-600 truncate transition-colors sm:text-sm dark:text-gray-300 font-body group-hover/author:text-brand-600 dark:group-hover/author:text-brand-400">
                  {post.username}
                </span>
              </Link>
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); likePost(post.id); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-body font-medium transition-all active:scale-90 flex-shrink-0 ${
                  likedPosts.includes(post.id)
                    ? 'bg-accent-500/10 text-accent-500 hover:bg-accent-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
              >
                <span>{likedPosts.includes(post.id) ? '🧡' : '🤍'}</span>
                <span>{post.Likes.length}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Home;