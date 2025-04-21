import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import SensorDetails from "./components/Sensors/SensorDetails";
import HistorySensor from "./components/Sensors/HistorySensor"; // Import HistorySensor componen
import Login from "./auth/Login"; // Import Login component
import Signup from "./auth/SignUp"; // Import Signup component

function App() {
  return (
    <Router>
      <Routes>
        {/* Login and Signup Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/sensor" element={<SensorDetails />} />
        <Route path="/history/:imei" element={<HistorySensor/>} />
        <Route path="/signup" element={<Signup />} />

        {/* Protect the Dashboard route (only accessible after login) */}
        <Route path="/dashboard" element={<Dashboard />} />
       
        {/* Default Route */}
       
      </Routes>
    </Router>
  );
}

export default App;
