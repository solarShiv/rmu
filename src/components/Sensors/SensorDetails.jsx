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
import Header from "../Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// IMEI to location mapping
const imeiToLocationMap = {
  // Section A
  "869630054647155": "Lam-Area-A13 (Laminator)",
  "869630054641893": "Lam-Area-A11 (Laminator)",
  "869630054641570": "Lam-Area-A15 (Laminator)",
  "869630054635820": "Pre-Lam-A10 (Edge Sealing Machine)",
  "869630054647270": "Post-Lam-A19 (Flipper Machine, Sun Simulator Machine)",
  "869630054642248": "Pre-Lam-A7 (Rework Gantry)",
  "869630054636075": "Post-Lam-A16 (Auto Corner Buffing Machine)",
  "869630054641455": "Post-Lam-A20 (Post el Machine, Curing Chamber)",
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

  // Section C
  "864710056637597": "C-2 PreLam (Stringer)",
  "869137069277549": "C-4 PreLam (Stringer)",
  "869137069273134": "C-8 PreLam (Laminator-Area)",
  "864710056660722": "C-10 PreLam (Laminator-Area)",
  "869137069233849": "C-12 PreLam (Laminator-Area)",
  "864710056661779": "C-15 Post-Lam (90 Visual)",
  "864710056637068": "C-19 Post-Lam (360 Visual)",
  "869137069276681": "C-20 Auto Sorting Post-Lam",

  // Section D
  "869137069230357": "D-19 Post-EL (Simulator)",
  "869137069271955": "D-6 Pre-Lam Area",
  "864710056661183": "D-4 Pre-Lam (2nd glass loader)",
  "869137069277028": "D-2 Pre-Lam (Stringer Area)",
  "864710056661266": "D-14 Post-Lam Area",
  "869137069276525": "D-17 Post-Lam (Curing Area)",
  "869137069277408": "D-8 Post-Lam (Final QC)",
  "869137069234425": "D-10 Pre-Lam (Laminator-Area)",
  "869137069273142": "D-13 Pre-Lam (Laminator-Area)",
  "869137069273175": "D-21 Post-Lam (Sorting Machine)",
};

// Section A IMEIs
const sectionAIMEIs = [
  "869630054647155",
  "869630054641893",
  "869630054641570",
  "869630054635820",
  "869630054647270",
  "869630054642248",
  "869630054636075",
  "869630054641455",
  "869630054646975",
  "869630054642545",
  "869630054647007",
  "869630054641737",
  "869630054640895",
  "869630054645142",
  "869630054642461",
  "869630054647163",
  "869630054642438",
  "864710059982404",
];

// Section D IMEIs
const sectionDIMEIs = [
  "869137069279999",
  "869137069278888",
  "869137069277777",
];

function SensorDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [section, setSection] = useState("A");
  const navigate = useNavigate();

  const getSectionForIMEI = (imei) => {
    if (sectionAIMEIs.includes(imei)) return "A";
    if (sectionDIMEIs.includes(imei)) return "D";
    return "C";
  };

  const filteredData = data.filter(
    (sensor) => getSectionForIMEI(sensor.imei) === section
  );

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
      <Header section={section} setSection={setSection} />
      <Box sx={{ p: 3, mt: 10 }}>
        <Grid container spacing={3} justifyContent="center">
          {filteredData.length > 0 ? (
            filteredData.map((sensorData) => {
              const { imei, temperature, humidity, timestamp } = sensorData;
              const location =
                imeiToLocationMap[imei] || `Section ${getSectionForIMEI(imei)} Sensor - ${imei}`;

              return (
                <Grid item xs={12} sm={6} md={4} key={imei}>
                  <Box
                    sx={{
                      position: "relative",
                      "&:hover .delete-icon": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Card
                      sx={{
                        p: 2,
                        textAlign: "center",
                        borderRadius: 3,
                        boxShadow: 3,
                        transition:
                          "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: 6,
                        },
                        position: "relative",
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

                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mt: 2 }}
                          onClick={() => navigate(`/history/${imei}`)}
                        >
                          View History
                        </Button>

                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            opacity: 0,
                            transition: "opacity 0.3s ease-in-out",
                          }}
                          className="delete-icon"
                          color="error"
                          onClick={() => deleteSensor(imei)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Typography variant="body1" color="gray">
              No sensor data available in this section.
            </Typography>
          )}
        </Grid>
      </Box>
      <ToastContainer />
    </>
  );
}

export default SensorDetails;
