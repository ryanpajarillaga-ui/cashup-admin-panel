import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminUsers from "./Components/AdminUsers";
import Consumers from "./Components/Consumers";
import ContactSupport from "./Components/ContactSupport";
import Header from "./Components/Header";
import HomePage from "./Components/HomePage";
import LicenseVerification from "./Components/LicenseVerification";
import LoginPage from "./Components/Login/LoginPage";
import Merchants from "./Components/Merchants";
import React from "react";
import Test from "./Components/Test";
import VerticalNav from "./Components/VerticalNav";
import axios from "axios";

// Set a header specifically for POST requests
axios.defaults.headers.post["ngrok-skip-browser-warning"] = "1";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/adminusers" element={<AdminUsers />} />
        <Route path="/merchants" element={<Merchants />} />
        <Route path="/consumers" element={<Consumers />} />
        <Route path="/contactsupport" element={<ContactSupport />} />
        <Route path="/licenseverification" element={<LicenseVerification />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
