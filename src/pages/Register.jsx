import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        email,
        firstName: fname,
        lastName: lname,
        photo: "",
      });

      toast.success("User Registered Successfully!", {
        position: "top-center",
      });
      navigate("/anime"); // Navigate to /anime after successful registration
    } catch (error) {
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md animate-fade-in">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Sign Up
        </h3>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            onChange={(e) => setFname(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out"
          />
          <input
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLname(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded transition duration-300 ease-in-out"
          >
            Register
          </button>
          <p className="text-center text-sm text-gray-600">
            Already Registered?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;