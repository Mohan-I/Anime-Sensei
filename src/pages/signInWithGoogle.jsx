import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function SignInwithGoogle() {
  const navigate = useNavigate();

  async function googleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "",
        });
        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message, { position: "bottom-center" });
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-center text-gray-500">--Or continue with--</p>
      <div
        className="flex justify-center cursor-pointer flex items-center justify-center py-2 px-20 border rounded-full hover:bg-gray-200 transition duration-200"
        onClick={googleLogin}
      > 
        <img src="./img/google.svg" alt="Google" className="w-12 h-12" />
        <span class="ml-2">Sign in with Google</span>
      </div>
    </div>
  );
}

export default SignInwithGoogle;