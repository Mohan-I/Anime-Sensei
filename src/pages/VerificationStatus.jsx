// VerificationStatus.jsx
import { useAuth } from "./AuthContext";

const VerificationStatus = () => {
  const { user, emailVerified, authProvider, sendVerificationEmail, checkEmailVerification } = useAuth();
  
  if (!user) return null;
  
  // Google users are auto-verified
  if (authProvider === 'google') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="text-green-700">
            ✓ Verified with Google - Your account is fully verified
          </span>
        </div>
      </div>
    );
  }
  
  // Email/password users need verification
  if (!emailVerified) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h3 className="text-yellow-800 font-semibold mb-2">Verify Your Email</h3>
        <p className="text-yellow-700 text-sm mb-3">
          Please verify your email address to access all features.
          Check your inbox at <strong>{user.email}</strong>
        </p>
        <div className="flex gap-3">
          <button
            onClick={checkEmailVerification}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            I've verified - Check Status
          </button>
          <button
            onClick={sendVerificationEmail}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Resend Email
          </button>
        </div>
      </div>
    );
  }
  
  // Verified email/password user
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
        <span className="text-green-700">✓ Email verified</span>
      </div>
    </div>
  );
};

export default VerificationStatus;