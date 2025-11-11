import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import feedo from "../assets/Feedo-removebg-preview.png";

const Feedpage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("5");
  const [questionId, setQuestionId] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [userid, setUserid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const storedUserid = localStorage.getItem("userid");
    if (!storedUserid) {
      alert("Please log in first.");
      navigate("/");
      return;
    }
    setUserid(storedUserid);

    if (location.state?.questionId) {
      setQuestionId(location.state.questionId);
      fetchQuestionText(location.state.questionId);
    } else {
      alert("No question selected. Please go back and select a question.");
      setIsLoadingQuestion(false);
    }
  }, [location.state, navigate]);

  const fetchQuestionText = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/questions`);
      const questions = response.data;
      const question = questions.find((q) => q.id === id);
      if (question) {
        setQuestionText(question.questions);
      } else {
        setQuestionText("Question not found.");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      setQuestionText("Failed to load question.");
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !feedback || !questionId || !userid) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/feedback`, {
        name: username,
        messages: feedback,
        rating: parseInt(rating),
        userid,
        questid: questionId,
      });
      console.log("Feedback submitted:", response.data);
      alert("Feedback submitted successfully!");
      setUsername("");
      setFeedback("");
      setRating("5");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const remainingChars = 500 - feedback.length;

  return (
    <div className="min-h-screen bg-[#1f183a] flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-3 py-2 border-b border-[#d9e3f0] bg-[#1f183a]/80 backdrop-blur-sm shadow-sm shrink-0">
        <div>
          <img
            className="w-10 h-auto sm:w-12 drop-shadow-[0_0_3px_rgba(203,212,218,0.6)]"
            src={feedo}
            alt="Feedo logo"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/questions")}
            className="px-2 py-1 sm:px-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 font-medium shadow-md text-xs sm:text-sm"
          >
            Back
          </button>
          <button className="px-2 py-1 sm:px-3 text-[#228dbd] hover:text-[#1e68fa] transition duration-200 font-medium text-xs sm:text-sm">
            Contact
          </button>
          <button
            onClick={handleLogout}
            className="px-2 py-1 sm:px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium shadow-md text-xs sm:text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 md:px-8 flex justify-center items-start">
        <div className="w-full max-w-3xl space-y-6">
          {/* Welcome Section */}
          <section
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: "rgba(61, 108, 139, 0.5)",
              borderColor: "#d9e3f0",
              boxShadow: "0 4px 8px rgba(33, 62, 88, 0.25)",
            }}
          >
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              Welcome to Feedo!
            </h1>
            <p className="text-base text-[#cbd4da] text-center mb-4">
              Your go-to platform for sharing and receiving feedback.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-lg p-2 w-full md:w-1/3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#229dbd] focus:border-transparent"
                style={{
                  backgroundColor: "#1f183a",
                  borderColor: "#d9e3f0",
                  color: "#cbd4da",
                }}
              />
            </div>
          </section>

          {/* Feedback Form Section */}
          <section
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: "rgba(61, 108, 139, 0.5)",
              borderColor: "#d9e3f0",
              boxShadow: "0 4px 8px rgba(33, 62, 88, 0.25)",
              color: "#cbd4da",
            }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Submit Your Feedback
            </h2>

            <div
              className="mb-4 p-4 rounded-lg border"
              style={{ backgroundColor: "rgba(31, 24, 58, 0.8)", borderColor: "#d9e3f0" }}
            >
              <h3 className="text-lg font-medium text-white mb-2">Question:</h3>
              {isLoadingQuestion ? (
                <p className="text-[#cbd4da]">Loading question...</p>
              ) : (
                <p className="text-[#cbd4da]">{questionText}</p>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <textarea
                  placeholder="Write your feedback here... (min 500 characters)"
                  maxLength={500}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="rounded-lg p-2 w-full h-24 resize-none text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#229dbd] focus:border-transparent"
                  style={{
                    backgroundColor: "#1f183a",
                    borderColor: "#d9e3f0",
                    color: "#cbd4da",
                  }}
                ></textarea>
                <p className="text-xs text-[#cbd4da]">{remainingChars} characters remaining</p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[#cbd4da]">
                  <label htmlFor="rating" className="font-medium text-sm">
                    Rate us (1-5):
                  </label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="rounded-lg p-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#229dbd]"
                    style={{
                      backgroundColor: "#1f183a",
                      borderColor: "#d9e3f0",
                      color: "#cbd4da",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((val) => (
                      <option key={val} className="bg-[#1f183a] text-[#cbd4da]" value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-white px-6 py-2 rounded-lg transition duration-200 font-medium shadow-md text-sm disabled:opacity-50"
                    style={{ backgroundColor: "#1e68fa" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1672e0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e68fa")}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Feedpage;
