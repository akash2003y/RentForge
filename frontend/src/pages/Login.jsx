import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // EMAIL / PASSWORD LOGIN
  // =========================
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/users/login",
        formData
      );

      // Invalid backend response
      if (typeof res.data === "string") {
        alert(res.data);
        return;
      }

      // Save session
      login(res.data);

      // Role-based redirect
      if (res.data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Invalid email or password");
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      // Firebase popup
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      // Send to backend
      const userData = {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        profilePic: firebaseUser.photoURL,
        provider: "GOOGLE"
      };

      // Backend returns real DB user
      const res = await axios.post(
        "http://localhost:8080/users/google-login",
        userData
      );

      // Save session
      login(res.data);

      // Role-based redirect
      if (res.data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">

        {/* LOGO */}
        <h1 className="text-4xl font-bold text-center mb-3">
          <span className="text-black">Rent</span>
          <span className="text-blue-600">Forge</span>
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login to manage rentals and bookings
        </p>

        {/* =========================
            EMAIL LOGIN
        ========================= */}
        <form onSubmit={handleEmailLogin} className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            Login
          </button>

        </form>

        {/* DIVIDER */}
        <div className="my-6 text-center text-gray-400 font-medium">
          OR
        </div>

        {/* =========================
            GOOGLE LOGIN
        ========================= */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:shadow-lg transition bg-white"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-6 h-6"
          />

          <span className="font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        {/* REGISTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;