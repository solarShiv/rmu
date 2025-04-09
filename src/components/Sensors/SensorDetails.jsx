import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AddSensor from "./AddSensor";
import Header from "../Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTint, faTrash } from "@fortawesome/free-solid-svg-icons";

// Mapping of IMEI numbers to sensor locations
const imeiToLocationMap = {
  "869630054647155": "A13",
  "869630054641893": "A11",
  "869630054641570": "A15",
  "869630054635820": "A10",
  "869630054647270": "A19",
  "869630054642248": "A7",
  "869630054636075": "A16",
  "869630054641455": "A20",
  "869630054646975": "A9",
  "869630054642545": "A5",
  "869630054647007": "A2",
  "869630054641737": "A17",
  "869630054640895": "A3",
  "869630054645142": "A14",
  "869630054642461": "A6",
  "869630054647163": "UPS Room",
  "869630054642438": "UPS Room",
  "864710059982404": "Delhi Office",
};

function SensorDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  // Callback function to receive data from AddSensor
  const handleIemiData = (newSensorData) => {
    setData((prevData) => [...prevData, newSensorData]); // Add new sensor data to the list
    setOpen(false); // Close the modal after adding data
  };

  // Fetch all sensor data from the API
  const getData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data for all IMEIs from the API
      const response = await axios.get(
        "http://srv619650.hstgr.cloud:4042/api/data/getLatestDataForAllIMEIs"
      );

      if (response.status === 200) {
        const sensorData = response.data.data; // Extracting the data field from the response
        setData(sensorData); // Set the received data
      } else {
        throw new Error("Failed to fetch sensor data");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      toast.error("An unexpected error occurred while fetching data.");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a sensor data
  const deleteSensor = async (imei) => {
    try {
      const response = await axios.post(
        "http://srv619650.hstgr.cloud:4042/api/data/delete-data", 
        { imei }  // Passing the IMEI in the request body
      );

      if (response.status === 200) {
        toast.success(`Sensor with IMEI ${imei} deleted successfully.`);
        // Remove the deleted sensor data from the state
        setData((prevData) => prevData.filter((sensor) => sensor.imei !== imei));
      } else {
        throw new Error("Failed to delete sensor data");
      }
    } catch (error) {
      console.error("Error deleting data:", error.message);
      toast.error("An unexpected error occurred while deleting data.");
    }
  };

  useEffect(() => {
    getData(); // Fetch data initially
    const interval = setInterval(() => {
      getData(); // Fetch data every 60 seconds
    }, 60000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString(); // Convert timestamp to local string
  };

  // If data is loading, show a spinner
  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  console.log("Data:", data); // Log the sensor data for debugging

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          position: "sticky",
          zIndex: "1000",
          top: "65px",
        }}
      >
        <AddSensor
          open={open}
          setOpen={setOpen}
          onClose={() => setOpen(false)}
          onSendData={handleIemiData}
        />
      </div>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          {data.length > 0 ? (
            data.map((sensorData, index) => {
              const { imei, temperature, humidity, timestamp } = sensorData;
              const location = imeiToLocationMap[imei] || "Unknown Location"; // Get the location by IMEI
              return (
                <Grid item xs={12} sm={6} md={4} key={imei}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#000", mb: 2 }}
                      >
                        Location: {location} {/* Display the location */}
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#1976d2" }}>
                        IMEI No.: {imei}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1.1rem", color: "red" }}
                      >
                        🌡 Temperature:{" "}
                        <strong>{temperature || "N/A"}°C</strong>
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1.1rem", color: "skyblue" }}
                      >
                        <FontAwesomeIcon icon={faTint} /> Humidity:{" "}
                        <strong>{humidity || "N/A"}%</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        ⏳ Last Updated:{" "}
                        {formatTimestamp(timestamp)}
                      </Typography>
                      {/* Delete Button */}
                      <IconButton
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        color="error"
                        onClick={() => deleteSensor(imei)} // Delete the sensor when clicked
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography variant="body1" color="gray">
              No sensor data available.
            </Typography>
          )}
        </Grid>
      </Box>
      <ToastContainer />
    </>
  );
}

export default SensorDetails;
