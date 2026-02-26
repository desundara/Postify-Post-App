import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Post() {
  const { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/posts/byId/${id}`),
      axios.get(`${API_URL}/comments/${id}`)
    ])
    .then(([postRes, commentsRes]) => {
      setPostObject(postRes.data);
      setComments(commentsRes.data);
      setLoading(false);
    })
    .catch((err) => { console.error(err); setLoading(false); });
  }, [id]);

  const addComment = () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("accessToken");
    if (!token) { alert("Please login first!"); return; }

    axios.post(`${API_URL}/comments`,
      { commentText: newComment, postId: id },
      { headers: { accessToken: token } }
    )
    .then((response) => {
      if (response.data.error) {
        alert(`Error: ${response.data.error}`);
      } else {
        setComments([...comments, response.data]);
        setNewComment("");
      }
    })
    .catch((err) => { console.error(err); alert("Error adding comment"); });
  };

  const deleteComment = (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: { accessToken: localStorage.getItem("accessToken") }
    })
    .then(() => setComments(comments.filter((c) => c.id !== commentId)))
    .catch(() => alert("Failed to delete comment"));
  };

  const deletePost = (postId) => {
    if (!window.confirm("Delete this post?")) return;
    axios.delete(`${API_URL}/posts/${postId}`, {
      headers: { accessToken: localStorage.getItem("accessToken") }
    })
    .then(() => navigate("/"))
    .catch(() => alert("Failed to delete post"));
  };

  const editPost = (option) => {
    if (option === "title") {
      const newTitle = prompt("Enter New Title:");
      if (!newTitle?.trim()) return;
      axios.post(`${API_URL}/posts/title`,
        { newTitle, id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      ).then(() => setPostObject({ ...postObject, title: newTitle }))
        .catch(() => alert("Failed to update title"));
    } else {
      const newPostText = prompt("Enter New Text:");
      if (!newPostText?.trim()) return;
      axios.post(`${API_URL}/posts/postText`,
        { newText: newPostText, id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      ).then(() => setPostObject({ ...postObject, postText: newPostText }))
       .catch(() => alert("Failed to update post"));
    }
  };

  if (loading) return (
    <div className="max-w-5xl px-0 mx-auto animate-pulse">
      <div className="w-32 mb-5 bg-gray-200 rounded-lg h-7 dark:bg-gray-800"></div>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">
        <div className="bg-gray-200 lg:col-span-2 h-72 dark:bg-gray-800 rounded-2xl"></div>
        <div className="bg-gray-200 h-72 dark:bg-gray-800 rounded-2xl"></div>
      </div>
    </div>
  );

  const isOwner = authState.username === postObject.username;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Back button */}
      <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-5 group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Feed
      </button>

      {/* Stacked on mobile, side-by-side on lg */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">

        {/* Post card */}
        <div className="lg:col-span-2">
          <div className="p-5 bg-white border-gray-100 shadow-sm card dark:bg-gray-900 dark:border-gray-800 sm:p-8">
            <div
              className={`mb-4 ${isOwner ? 'cursor-pointer group' : ''}`}
              onClick={() => isOwner && editPost("title")}
            >
              {isOwner && (
                <span className="block mb-1 text-xs transition-opacity opacity-0 text-brand-500 dark:text-brand-400 font-body group-hover:opacity-100">
                  ✏️ Click to edit title
                </span>
              )}
              <h1 className="text-xl font-extrabold leading-tight text-gray-900 transition-colors font-display sm:text-2xl dark:text-white hover:text-brand-600 dark:hover:text-brand-400">
                {postObject.title}
              </h1>
            </div>

            <div
              className={`mb-6 ${isOwner ? 'cursor-pointer group' : ''}`}
              onClick={() => isOwner && editPost("postText")}
            >
              {isOwner && (
                <span className="block mb-1 text-xs transition-opacity opacity-0 text-brand-500 dark:text-brand-400 font-body group-hover:opacity-100">
                  ✏️ Click to edit content
                </span>
              )}
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap dark:text-gray-300 font-body sm:text-base">
                {postObject.postText}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link to={`/profile/${postObject.UserId}`} className="flex items-center gap-2 group">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display">
                  {postObject.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 transition-colors font-body dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {postObject.username}
                </span>
              </Link>
              {isOwner && (
                <button
                  onClick={() => deletePost(postObject.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Post
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comments panel */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-white border-gray-100 shadow-sm card dark:bg-gray-900 dark:border-gray-800 sm:p-5">
            <h3 className="mb-4 text-sm font-bold text-gray-900 font-display dark:text-white">
              Comments <span className="font-normal text-gray-400 dark:text-gray-500">({comments.length})</span>
            </h3>

            {/* Add comment */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a comment..."
                autoComplete="off"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
                className="flex-1 min-w-0 py-2 text-sm text-gray-900 placeholder-gray-400 border-gray-200 input-field bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                className="flex items-center justify-center flex-shrink-0 text-white transition-colors w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            {/* Comments list */}
            <div className="flex flex-col gap-3 pr-1 overflow-y-auto max-h-80 lg:max-h-96">
              {comments.length === 0 ? (
                <p className="py-6 text-sm text-center text-gray-400 dark:text-gray-500 font-body">No comments yet. Be first!</p>
              ) : (
                comments.map((comment, key) => (
                  <div key={key} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 group">
                    <p className="mb-2 text-sm text-gray-700 dark:text-gray-200 font-body">{comment.commentText}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-body">@{comment.username}</span>
                      {authState.username === comment.username && (
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="text-xs text-red-400 transition-colors opacity-0 hover:text-red-500 group-hover:opacity-100 font-body"
                        >
                          delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;