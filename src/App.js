import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import HomePage from "./Components/HomePage";
import LoginPage from "./Components/Login/LoginPage";
import React from "react";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
