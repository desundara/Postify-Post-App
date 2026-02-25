import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const changepassword = () => {
    if (!oldPassword || !newPassword) { setError("Please fill in both fields"); return; }
    if (newPassword.length < 4) { setError("New password must be at least 4 characters"); return; }

    setError(""); setLoading(true);
    axios.put(`${process.env.REACT_APP_API_URL}/auth/changepassword`,
      { oldPassword, newPassword },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    )
    .then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSuccess(true);
        setOldPassword(""); setNewPassword("");
        setTimeout(() => navigate(-1), 2000);
      }
    })
    .catch((error) => setError(error.response?.data?.error || "Failed to change password"))
    .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950/40 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">Change Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update your account password</p>
        </div>

        <div className="card bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-display font-bold text-gray-900 dark:text-white">Password changed!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-1">Redirecting you back...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-body">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-display font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="input-field bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-display font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  onKeyDown={(e) => e.key === 'Enter' && changepassword()}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => navigate(-1)} className="btn-ghost flex-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  Cancel
                </button>
                <button onClick={changepassword} disabled={loading} className="btn-primary flex-1 py-2.5">
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
