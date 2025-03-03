import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("User data not found.");
        }
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]); // Add navigate as dependency

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Use navigate for redirection
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {userDetails ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={userDetails.photo || "https://via.placeholder.com/150"} // Placeholder if no photo
                alt="Profile"
                className="rounded-full border w-32 h-32 object-cover"
              />
            </div>
            <h3 className="text-2xl font-semibold text-center">
              Welcome {userDetails.firstName} 🙏🙏
            </h3>
            <div>
              <p className="text-gray-700">
                Email: <span className="font-medium">{userDetails.email}</span>
              </p>
              <p className="text-gray-700">
                First Name:{" "}
                <span className="font-medium">{userDetails.firstName}</span>
              </p>
              {userDetails.lastName && (
                <p className="text-gray-700">
                  Last Name:{" "}
                  <span className="font-medium">{userDetails.lastName}</span>
                </p>
              )}
            </div>
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded transition duration-300 ease-in-out"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;