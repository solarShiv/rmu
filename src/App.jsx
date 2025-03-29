import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import SensorDetails from "./components/Sensors/SensorDetails";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/" element={<SensorDetails />} />
          {/* <Route path="/sensor/:sensorName" element={<SensorDetails />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
