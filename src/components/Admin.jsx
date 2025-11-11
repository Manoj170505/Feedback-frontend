import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is installed
import Feedo from "../assets/Feedo-removebg-preview.png";
import feedoA from "../assets/feedoa-removebg-preview.png";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Admin = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [adminDetails, setAdminDetails] = useState({ username: "" });

  useEffect(() => {
    const userid = localStorage.getItem("userid");
    const username = localStorage.getItem("username");
    if (!userid || !username) {
      alert("Please log in as admin.");
      navigate("/adminlogin");
      return;
    }
    setAdminDetails({ username });
    fetchFeedbacks();
    fetchQuestions();
  }, [navigate]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_URL}/feedbacks`);
      setFeedbacks(response.data);
    } catch (error) {
      setError("Failed to load feedbacks. Ensure /feedbacks endpoint is added.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/questions`);
      setQuestions(response.data);
    } catch (error) {
      // Ignore error for questions fetching
    }
  };

  const handleRowClick = (feedback) => {
    const fullQuestion = questions.find(q => q.id === feedback.questid)?.questions || "Question not found";
    setSelectedRow({ ...feedback, question: fullQuestion });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }
    const userid = localStorage.getItem("userid");
    try {
      await axios.post(`${API_URL}/admin/question`, {
        questions: newQuestion,
        adminId: userid,
      });
      alert("Question added successfully!");
      setNewQuestion("");
      fetchQuestions();
    } catch (error) {
      alert("Failed to add question. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/adminlogin");
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-[#1f183a] flex flex-col">
      {/* Navigation */}
      <nav className="flex flex-row justify-between items-center px-3 py-2 border-b border-[#d9e3f0] bg-[#1f183a]/80 backdrop-blur-sm shadow-sm shrink-0">
        <div>
          <img className="w-10 h-auto sm:w-12 drop-shadow-[0_0_3px_rgba(203,212,218,0.6)]" src={Feedo} alt="Feedo logo" />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button onClick={() => navigate("/adminlogin")}
            className="px-2 py-1 sm:px-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 font-medium shadow-md text-xs sm:text-sm">
            Back
          </button>
          <button className="px-2 py-1 sm:px-3 text-[#229dbd] hover:text-[#1e68fa] transition duration-200 font-medium text-xs sm:text-sm">
            Contact
          </button>
          <button onClick={handleLogout}
            className="px-2 py-1 sm:px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium shadow-md text-xs sm:text-sm">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 flex-1 px-2 sm:px-5 py-3">
        {/* Sidebar */}
        <div className="flex flex-col items-center w-full sm:w-1/3 lg:w-1/4 mb-4 lg:mb-0">
          <img src={feedoA} alt="Admin Logo"
            className="w-32 sm:w-40 lg:w-60 h-auto drop-shadow-[0_0_3px_rgba(203,212,218,0.6)]" />
          <h2 className="text-[#cbd4da] text-lg sm:text-xl font-semibold mt-3 sm:mt-4">
            {adminDetails.username || "Username"}
          </h2>
        </div>

        {/* Main Panel */}
        <div className="flex flex-col w-full lg:w-3/4 gap-4 sm:gap-5">
          {/* Add Questions Section */}
          <div className="p-4 sm:p-6 rounded-lg border"
            style={{
              backgroundColor: "rgba(61, 108, 139, 0.5)",
              borderColor: "#d9e3f0",
              boxShadow: "0 4px 8px rgba(33, 62, 88, 0.25)",
            }}
          >
            <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Add Questions
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Enter Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="flex-1 rounded-lg p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#229dbd] focus:border-transparent"
                style={{
                  backgroundColor: "#1f183a",
                  borderColor: "#d9e3f0",
                  color: "#cbd4da",
                }}
              />
              <button
                onClick={handleAddQuestion}
                className="px-3 py-2 rounded-lg transition duration-200 font-medium shadow-md text-sm text-white"
                style={{ backgroundColor: "#1e68fa" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1672e0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e68fa")
                }
              >
                Add
              </button>
            </div>
          </div>

          {/* View Feedbacks Section */}
          <div className="p-4 sm:p-6 rounded-lg border"
            style={{
              backgroundColor: "rgba(61, 108, 139, 0.5)",
              borderColor: "#d9e3f0",
              boxShadow: "0 4px 8px rgba(33, 62, 88, 0.25)",
            }}
          >
            <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              View Feedbacks
            </h3>
            <div className="overflow-x-auto"
              style={{
                maxHeight: "350px",
              }}
            >
              {isLoading ? (
                <p className="text-[#cbd4da] text-center">Loading feedbacks...</p>
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : feedbacks.length === 0 ? (
                <p className="text-[#cbd4da] text-center">No feedbacks available.</p>
              ) : (
                <table className="w-full text-left table-fixed text-xs sm:text-sm">
                  <thead className="sticky top-0 bg-[#1f183a]">
                    <tr className="border-b border-[#d9e3f0]">
                      <th className="py-2 text-[#cbd4da] w-1/7">Name</th>
                      <th className="py-2 text-[#cbd4da] w-1/6">Question</th>
                      <th className="py-2 text-[#cbd4da] w-1/2">Messages</th>
                      <th className="py-2 text-[#cbd4da] w-1/12">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((feedback, index) => (
                      <tr
                        key={feedback.id || index}
                        className="border-b border-[#d9e3f0]/50 cursor-pointer hover:bg-[#1f183a]/50 transition-colors"
                        onClick={() => handleRowClick(feedback)}
                      >
                        <td className="px-1 py-2 text-[#cbd4da]">{feedback.name}</td>
                        <td className="px-1 py-2 text-[#cbd4da]">
                          {truncateText(questions.find(q => q.id === feedback.questid)?.questions || "N/A", 15)}
                        </td>
                        <td className="px-1 py-2 text-[#cbd4da] wrap-break-words">
                          {truncateText(feedback.messages, 50)}
                        </td>
                        <td className="px-1 py-2 text-[#cbd4da]">{feedback.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedRow && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal} role="dialog"
          aria-labelledby="modal-title"
        >
          <div
            className="p-3 sm:p-6 rounded-lg border w-full max-w-xs sm:max-w-md mx-2"
            style={{
              backgroundColor: "rgba(61, 108, 139, 0.8)",
              borderColor: "#d9e3f0",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 id="modal-title" className="text-white text-base sm:text-lg font-semibold">
                Feedback Details
              </h2>
              <button onClick={closeModal}
                className="text-[#cbd4da] hover:text-white text-xl">
                ×
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-[#cbd4da]"><strong>Name:</strong> {selectedRow.name}</p>
              <p className="text-[#cbd4da]"><strong>Question:</strong> {selectedRow.question}</p>
              <p className="text-[#cbd4da]"><strong>Message:</strong> {selectedRow.messages}</p>
              <p className="text-[#cbd4da]"><strong>Rating:</strong> {selectedRow.rating}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
