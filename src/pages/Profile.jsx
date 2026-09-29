import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
<<<<<<< HEAD
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mecha",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Shounen",
  "Seinen",
  "Psychological",
  "Sports",
  "Supernatural",
];

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [profile, setProfile] = useState({
    username: "",
    age: "",
    favoriteGenres: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data);
          // Populate editable fields from existing Firestore data
          setProfile({
            username: data.username || "",
            age: data.age || "",
            favoriteGenres: data.favoriteGenres || [],
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGenreToggle = (genre) => {
    setProfile((prev) => {
      const already = prev.favoriteGenres.includes(genre);
      return {
        ...prev,
        favoriteGenres: already
          ? prev.favoriteGenres.filter((g) => g !== genre)
          : [...prev.favoriteGenres, genre],
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      await setDoc(
        userRef,
        {
          username: profile.username,
          age: profile.age ? Number(profile.age) : "",
          favoriteGenres: profile.favoriteGenres,
        },
        { merge: true } // Never overwrite email, photo, lastWatched, etc.
      );
      // Reflect saved values back into display state
      setUserDetails((prev) => ({ ...prev, ...profile }));
      setIsEditing(false);
      toast.success("Profile updated!", { position: "top-center" });
    } catch (error) {
      toast.error("Failed to save. Please try again.", {
        position: "top-center",
      });
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };
=======
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
>>>>>>> b96a07f88943b05c32ebcbdf41eb54bd1803d162

  const handleLogout = async () => {
    try {
      await auth.signOut();
<<<<<<< HEAD
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center auth-background">
        <p className="text-white text-lg font-general uppercase">
          Loading Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen auth-background bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Avatar & Basic Info ── */}
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center space-y-3">
          <img
            src={userDetails?.photo || "/categories/avatars/cacti.svg"}
            alt="Avatar"
            className="rounded-full border-4 border-indigo-500 w-28 h-28 object-cover"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            {userDetails?.firstName || "Anime Fan"}{" "}
            {userDetails?.lastName || ""}
          </h2>
          <p className="text-gray-500 text-sm">{userDetails?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2 rounded-full transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* ── Last Watched Anime ── */}
        {userDetails?.lastWatched?.animeId ? (
          <div className="bg-white rounded-2xl shadow-md p-6 flex gap-5 items-center">
            <img
              src={userDetails.lastWatched.image}
              alt={userDetails.lastWatched.title}
              className="w-20 h-28 object-cover rounded-lg shadow"
            />
            <div className="flex-1 space-y-1">
              <p className="text-xs font-general uppercase text-indigo-500 tracking-widest">
                Last Visited
              </p>
              <h3 className="text-lg font-bold text-gray-800">
                {userDetails.lastWatched.title}
              </h3>
              <Link
                to={`/anime/${userDetails.lastWatched.animeId}`}
                className="inline-block mt-2 bg-gradient-to-r from-indigo-500 to-green-500 text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition"
              >
                Continue Watching →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-400 text-sm">
            No anime visited yet. Browse the{" "}
            <Link to="/anime" className="text-indigo-500 hover:underline">
              Anime page
            </Link>{" "}
            to get started.
          </div>
        )}

        {/* ── Preferences Panel ── */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">My Preferences</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition"
              >
                Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            /* ── View Mode ── */
            <div className="space-y-4 text-gray-700">
              <div className="flex gap-2">
                <span className="font-semibold w-32">Username:</span>
                <span>{userDetails?.username || "—"}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-32">Age:</span>
                <span>{userDetails?.age || "—"}</span>
              </div>
              <div>
                <span className="font-semibold">Favorite Genres:</span>
                {userDetails?.favoriteGenres?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userDetails.favoriteGenres.map((g) => (
                      <span
                        key={g}
                        className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="ml-2 text-gray-400">None selected</span>
                )}
              </div>
            </div>
          ) : (
            /* ── Edit Mode ── */
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  placeholder="e.g. AnimeFan99"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: e.target.value })
                  }
                  placeholder="e.g. 21"
                  min="1"
                  max="120"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favorite Genres
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => {
                    const selected = profile.favoriteGenres.includes(genre);
                    return (
                      <button
                        type="button"
                        key={genre}
                        onClick={() => handleGenreToggle(genre)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors duration-150 ${
                          selected
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white py-2.5 rounded-lg font-medium transition"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Reset fields back to what's stored in Firestore
                    setProfile({
                      username: userDetails?.username || "",
                      age: userDetails?.age || "",
                      favoriteGenres: userDetails?.favoriteGenres || [],
                    });
                    setIsEditing(false);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

=======
      navigate("/login"); // Use navigate for redirection
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-background bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {userDetails ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={userDetails.photo || "../img/categories/avatars/cacti.svg"}
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
>>>>>>> b96a07f88943b05c32ebcbdf41eb54bd1803d162
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default Profile;
=======
export default Profile;
>>>>>>> b96a07f88943b05c32ebcbdf41eb54bd1803d162
