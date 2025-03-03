import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignInwithGoogle from "./signInWithGoogle";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
      navigate("/profile"); // Navigate to /profile after successful login
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-background bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md animate-fade-in">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Login
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              className="mt-1 block w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded transition duration-300 ease-in-out"
            >
              Submit
            </button>
          </div>
          <p className="text-center text-sm text-gray-600">
            New user{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register Here
            </a>
          </p>
          <SignInwithGoogle />
        </form>
      </div>
    </div>
  );
}

export default Login;