import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminUsers from "./Components/AdminUsers";
import Consumers from "./Components/Consumers";
import ContactSupport from "./Components/ContactSupport";
import HomePage from "./Components/HomePage";
import LoginPage from "./Components/Login/LoginPage";
import Merchants from "./Components/Merchants";
import React from "react";
import Test from "./Components/Test";

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
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
