// components/GoogleSignIn.jsx
// import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { toast } from "react-toastify";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { signInWithPopup } from "firebase/auth";

function GoogleSignIn({ disabled = false }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const hasProcessedRedirect = useRef(false);

  useEffect(() => {
    // Only process redirect result once
    if (hasProcessedRedirect.current) return;
    
    const handleGoogleSignIn = async () => {
  if (disabled || loading) return;

  setLoading(true);
  const provider = new GoogleAuthProvider();
  
  provider.addScope('profile');
  provider.addScope('email');
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const { user } = result;
    
    // Handle user creation/update here
    // Then navigate to profile
    navigate("/profile");
  } catch (error) {
    console.error("Sign-in error:", error);
    if (error.code !== 'auth/popup-closed-by-user') {
      toast.error("Failed to sign in. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};    
    handleRedirectResult();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    if (disabled || loading) return;

    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      await signInWithRedirect(auth, provider);
      // Page will redirect to Google
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("Failed to start Google sign-in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled || loading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
            <span>Redirecting to Google...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </>
        )}
      </button>
    </div>
  );
}

export default GoogleSignIn;