import React from "react";
import SensorCards from "../Sensors/Sensorcards";
import { ToastContainer } from "react-toastify";
import Header from "../Header/Header";

function Dashboard() {
  return (
    <div>
      {/* <Header /> */}
      <SensorCards />
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
