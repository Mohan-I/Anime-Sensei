// components/ChromeExtensionWarning.jsx
import React, { useEffect, useState } from 'react';

function ChromeExtensionWarning() {
  const [hasExtensionIssue, setHasExtensionIssue] = useState(false);

  useEffect(() => {
    // Check if we're in a Chrome error frame
    if (window.location.href.includes('chrome-error://')) {
      setHasExtensionIssue(true);
    }
  }, []);

  if (hasExtensionIssue) {
    return (
      <div className="fixed inset-0 bg-red-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Extension Detected</h2>
          <p className="text-gray-700 mb-4">
            A browser extension is blocking Firebase authentication. Please try:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-600">
            <li>Disabling ad blockers temporarily</li>
            <li>Disabling privacy extensions (like Privacy Badger, Ghostery)</li>
            <li>Using Incognito/Private mode</li>
            <li>Using a different browser (Firefox or Edge)</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default ChromeExtensionWarning;