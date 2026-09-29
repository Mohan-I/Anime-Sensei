// components/DebugAuth.jsx
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

function DebugAuth() {
  const { user, loading, emailVerified } = useAuth();

  useEffect(() => {
    if (!loading) {
      console.log('=== Auth Debug Info ===');
      console.log('User logged in:', !!user);
      console.log('User email:', user?.email);
      console.log('Email verified:', emailVerified);
      console.log('User UID:', user?.uid);
      console.log('Provider:', user?.providerData[0]?.providerId);
      console.log('=====================');
    }
  }, [loading, user, emailVerified]);

  if (loading) return null;

  if (user) {
    return (
      <div className="fixed bottom-4 left-4 bg-green-100 border border-green-400 text-green-700 px-3 py-1 rounded text-sm z-50">
        ✅ Logged in as: {user.email}
      </div>
    );
  }

  return null;
}

export default DebugAuth;