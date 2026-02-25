import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center animate-fade-in">
      <p className="font-mono text-6xl font-bold text-brand-200 dark:text-brand-900 mb-2 select-none">404</p>
      <h1 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-2">Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400 font-body text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}

export default PageNotFound;
