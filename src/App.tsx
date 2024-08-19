import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignInSide from "./components/Paginas/SingInSide";
import Dashboard from "./components/Paginas/Dashboard";
import SignUp from "./components/Paginas/SingUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignInSide />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
