// components/AuthLoading.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function AuthLoading() {
  const location = useLocation();
  
  // Show loading when returning from Google
  if (location.search.includes('code=')) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Completing Sign In</h2>
          <p className="text-gray-600 mt-2">Please wait while we verify your account...</p>
        </div>
      </div>
    );
  }
  
  return null;
}

export default AuthLoading;