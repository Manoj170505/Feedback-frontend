import "./App.css";
import Login from "./components/Login.jsx";
import Feedpage from "./components/Feedpage.jsx";
import Questions from "./components/Questions.jsx";
import Admin from "./components/Admin.jsx";
import Adminlogin from "./components/Adminlogin.jsx";
import React from "react";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";

const App = () => {
  return (
    <HashRouter basename="/Feedback-frontend">
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/adminlogin" element={<Adminlogin />} />

        {/* protected routes */}
        <Route
          path="/feedpage"
          element={
            <PrivateRoute>
              <Feedpage />
            </PrivateRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <PrivateRoute>
              <Questions />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
