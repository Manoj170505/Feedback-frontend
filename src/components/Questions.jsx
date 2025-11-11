import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import feedo from "../assets/Feedo-removebg-preview.png";
const API_URL = import.meta.env.VITE_API_URL;

const Questions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleQuestionClick = (questionId) => {
    navigate("/feedpage", { state: { questionId } });
  };

  const getQuestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-[#1f183a] flex flex-col">
      <nav className="flex flex-row justify-between items-center p-3 border-b border-[#d9e3f0] bg-[#1f183a]/80 backdrop-blur-sm shadow-sm shrink-0">
        <div>
          <img
            className="w-10 sm:w-12 h-auto drop-shadow-[0_0_3px_rgba(203,212,218,0.6)]"
            src={feedo}
            alt="Feedo logo"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button className="px-2 py-1 sm:px-3 text-[#228dbd] hover:text-[#1e68fa] transition duration-200 font-medium text-xs sm:text-sm">
            Contact
          </button>
          <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium shadow-md text-xs sm:text-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-wrap justify-center items-start gap-4 p-4 mt-8">
        {isLoading ? (
          <p className="text-[#cbd4da] text-lg">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-lg">{error}</p>
        ) : questions.length === 0 ? (
          <p className="text-[#cbd4da] text-lg">No questions available.</p>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              onClick={() => handleQuestionClick(question.id)}
              className="rounded-lg border border-[#d9e3f0] p-4 flex flex-col justify-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 w-40 sm:w-48 md:w-56 lg:w-60 h-48 sm:h-52 md:h-56 lg:h-60"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderColor: "rgba(217, 227, 240, 0.5)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              }}
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-[#cbd4da]">
                Question {index + 1}
              </h2>
              <p className="text-[#cbd4da] text-xs sm:text-sm leading-snug overflow-hidden wrap-break-words">
                {question.questions}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Questions;
