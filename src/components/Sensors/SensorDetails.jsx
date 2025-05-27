import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AddSensor from "./AddSensor";
import Header from "../Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

const imeiToLocationMap = {
  "869630054647155": "Lam-Area-A13 (Laminator)",
  "869630054641893": "Lam-Area-A11 (Laminator)",
  "869630054641570": "Lam-Area-A15 (Laminator)",
  "869630054635820": "Pre-Lam-A10 (Edge Sealing Machine)",
  "869630054647270": "Post-Lam-A19 (Flipper Machine,Sun Simulator Machine)",
  "869630054642248": "Pre-Lam-A7 (Rework Gantry)",
  "869630054636075": "Post-Lam-A16 (Auto Corner Buffing Machine)",
  "869630054641455": "Post-Lam-A20 (Post el Machine , Curing Chamber)",
  "869630054646975": "Pre-Lam-A9 (Pre el Machine)",
  "869630054642545": "Pre-Lam-A5 (Stringer)",
  "869630054647007": "Pre-Lam-A2 (Glass Loader)",
  "869630054641737": "Post-Lam-A17 (Auto Corner Buffing Machine)",
  "869630054640895": "Pre-Lam-A3 (Glass Loader)",
  "869630054645142": "Lam-Area-A14 (Laminator)",
  "869630054642461": "Pre-Lam-A6 (Bussing Machine)",
  "869630054647163": "UPS Room",
  "869630054642438": "UPS Room",
  "864710059982404": "Delhi Office",
};

function SensorDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ Navigation hook

  const handleIemiData = (newSensorData) => {
    setData((prevData) => [...prevData, newSensorData]);
    setOpen(false);
  };

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "http://srv619650.hstgr.cloud:4042/api/data/getLatestDataForAllIMEIs"
      );
      if (response.status === 200) {
        setData(response.data.data);
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

  const deleteSensor = async (imei) => {
    try {
      const response = await axios.post(
        "http://srv619650.hstgr.cloud:4042/api/data/delete-data",
        { imei }
      );

      if (response.status === 200) {
        toast.success(`Sensor with IMEI ${imei} deleted successfully.`);
        setData((prevData) =>
          prevData.filter((sensor) => sensor.imei !== imei)
        );
      } else {
        throw new Error("Failed to delete sensor data");
      }
    } catch (error) {
      console.error("Error deleting data:", error.message);
      toast.error("An unexpected error occurred while deleting data.");
    }
  };

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

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
              const location = imeiToLocationMap[imei] || "Unknown Location";

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
                        {location}
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
                        ⏳ Last Updated: {formatTimestamp(timestamp)}
                      </Typography>

                      {/* View History Button */}
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/history/${imei}`)} // ✅ Navigate to history
                      >
                        View History
                      </Button>

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
