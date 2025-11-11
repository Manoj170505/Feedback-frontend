import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import feedo from "../assets/Feedo-removebg-preview.png";
import VantaClouds from "../assets/VantaClouds";
import "../assets/loader.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added for password confirmation in signup
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Password confirmation check for signup
    if (!isLogin && password !== confirmPassword) {
      setLoading(false);
      setMessage("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });

        // Check and store user data safely
        const user = response.data.user;
        if (user && user.id && user.name) {
          localStorage.setItem("userid", user.id);
          localStorage.setItem("username", user.name);
          setLoading(false);
          setMessage("Login successful!");
          navigate("/questions");
        } else {
          setLoading(false);
          setMessage("Invalid user data received from server.");
        }
      } else {
        const response = await axios.post(`${API_URL}/register`, {
          name: username,
          email,
          password,
        });
        setLoading(false);
        setMessage("Sign Up successful! You can now login.");
        setIsLogin(true);
        // Reset fields after successful signup
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Login/Signup error:", error); // Added for debugging
      setLoading(false);
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || "Something went wrong");
      } else {
        setMessage("Network or server error");
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <VantaClouds />
      <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-2 md:p-8">
        {/* Logo section */}
        <div className="flex justify-center items-center w-full md:w-1/2 md:h-1/3 mb-6 md:mb-0">
          <img
            src={feedo}
            alt="Feedo Logo"
            className="w-40 h-40 md:w-64 md:h-64 object-contain drop-shadow-lg"
          />
        </div>

        {/* Form section */}
        <div className="flex justify-center items-center w-full md:w-1/2 md:h-2/3">
          <form
            onSubmit={handleSubmit}
            className="bg-white/30 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-xl border border-white/30 max-w-xs sm:max-w-md w-full"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-white">
              {isLogin ? "Login" : "Sign Up"}
            </h2>

            {!isLogin && (
              <div className="mb-4">
                <label
                  className="block text-white text-sm sm:text-base font-medium mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-white text-sm sm:text-base font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-white text-sm sm:text-base font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            {!isLogin && (
              <div className="mb-6">
                <label
                  className="block text-white text-sm sm:text-base font-medium mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                  setUsername("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-white hover:text-gray-200 text-sm text-center focus:outline-none"
                type="button"
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Login"}
              </button>
            </div>
            {(loading || message) && (
              <div className="flex flex-col items-center mt-4">
                {loading && <span className="loader" aria-label="Loading"></span>}
                {!loading && (
                  <p className="text-center text-blue-400 font-semibold">
                    {message}
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
