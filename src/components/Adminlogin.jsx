import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FeedoA from "../assets/feedoa-removebg-preview.png";
import VantaClouds from "../assets/VantaClouds";
import "../assets/loader.css";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        name,
        password,
      });

      setTimeout(() => {
        setLoading(false);
        setMessage("Login successful!");
        navigate("/admin");
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        if (error.response && error.response.data) {
          setMessage(error.response.data.error || "Something went wrong");
        } else {
          setMessage("Network or server error");
        }
      }, 1500);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <VantaClouds />
      <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:justify-between p-4">
        {/* Logo Section */}
        <div className="flex justify-center items-center w-full md:w-1/2 mb-8 md:mb-0">
          <img src={FeedoA} alt="Feedo Logo" className="max-w-xs md:max-w-sm" />
        </div>

        {/* Form Section */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-white/30 max-w-md w-full"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">
              Admin Login
            </h2>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-medium mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="username"
                type="text"
                placeholder="Enter your username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-white text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col space-y-4">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
              >
                Login
              </button>
            </div>

            {(loading || message) && (
              <div className="flex flex-col items-center mt-4">
                {loading && <span className="loader"></span>}
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
