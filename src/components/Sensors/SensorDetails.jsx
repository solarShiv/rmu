import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../ReusableComp/BackButton";
import axios from "axios";
import url from "../../utils/API_Url";
import Header from "../Header/Header";
import { toast, ToastContainer } from "react-toastify";
import AddSensor from "./AddSensor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTint } from "@fortawesome/free-solid-svg-icons"; // Importing the humidity icon


const imeiList = [
  "869630054635820",
  "869630054641893",
  "869630054641836",
  "869630054641778",
  "869630054641570",
  "869630054636075",
  "869630054641810",
  "869630054647270",
  "869630054647155",
  "864710059982404",
];

function SensorDetails() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [data6, setData6] = useState([]);
  const [data7, setData7] = useState([]);
  const [data8, setData8] = useState([]);
  const [data9, setData9] = useState([]);
  const [data10, setData10] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [receiveImei, setRecieveImei] = useState("");
  const [receiveImeiData, setReceiveImeiData] = useState([]);
  const [error, setError] = useState(null);
  //   const [key, setKey] = useState(0);
  //   const { sensorName } = useParams();
  //   const sensor = sensorData[sensorName];

  const latestreceiveImeiData =
    receiveImeiData.length > 0
      ? receiveImeiData[receiveImeiData.length - 1]
      : null;

  // console.log("data4", latestreceiveImeiData);
  // console.log("Received EMI:", receiveImei);
  //// 869630054635820
  // Callback function to receive data from child
  const handleIemiData = (data) => {
    setRecieveImei(data);
    setReceiveImeiData([]);
    setOpen(false);
  };

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);

      const requests = imeiList.map((imei) =>
        axios.get(`${url}/data/getData/${imei}`)
      );
      const responses = await Promise.allSettled(requests);

      console.log("responses", responses);

      // Extract successful responses
      const results = responses.map((res, index) =>
        res.status === "fulfilled" ? res.value.data.tempData : []
      );
      // Assign results to state variables
      setData1(results[0]);
      setData2(results[1]);
      setData3(results[2]);
      setData4(results[3]);
      setData5(results[4]);
      setData6(results[5]);
      setData7(results[6]);
      setData8(results[7]);
      setData9(results[8]);
      setData10(results[9]);

      // Handle errors
      const failedRequests = responses.filter(
        (res) => res.status === "rejected"
      );
      if (failedRequests.length > 0) {
        toast.error(`${failedRequests.length} request(s) failed.`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract the latest data from each dataset
  const latestData1 = data1.length > 0 ? data1[data1.length - 1] : null;
  const latestData2 = data2.length > 0 ? data2[data2.length - 1] : null;
  const latestData3 = data3.length > 0 ? data3[data3.length - 1] : null;
  const latestData4 = data4.length > 0 ? data4[data4.length - 1] : null;
  const latestData5 = data5.length > 0 ? data5[data5.length - 1] : null;
  const latestData6 = data6.length > 0 ? data6[data6.length - 1] : null;
  const latestData7 = data7.length > 0 ? data7[data7.length - 1] : null;
  const latestData8 = data8.length > 0 ? data8[data8.length - 1] : null;
  const latestData9 = data9.length > 0 ? data9[data9.length - 1] : null;
  const latestData10 = data10.length > 0 ? data10[data10.length - 1] : null;
  // ${receiveImei}
  const fetchImeiData = async () => {
    if (!receiveImei) {
      setError("No IMEI provided");
      toast.error("No IMEI provided");
      return;
    }
    // setError(null);
    try {
      setLoading(true);
      const resp = await axios.get(`${url}/data/getData/${receiveImei}`);
      setReceiveImeiData(resp.data.tempData);
      // console.log("API Response:", resp.data);
    } catch (err) {
      if (err.response) {
        // Server responded with a status code (e.g., 404)
        const status = err.response.status;
        const message = err.response.data?.message || "An error occurred";
        if (status === 404) {
          // setError(`No data found for IMEI: ${receiveImei}`);
          toast.error(`No data found for IMEI: ${receiveImei}`);
        } else {
          setError(message);
          toast.error(message);
        }
      } else if (err.request) {
        // Request was made but no response received (e.g., network error)
        setError("Network error: Unable to reach the server");
        toast.error("Network error: Unable to reach the server");
      } else {
        // Other errors (e.g., setup issues)
        // setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
      toast.error(err);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImeiData();
  }, [receiveImei]); // Runs whe

  useEffect(() => {
    getData(); // Fetch data initially

    const interval = setInterval(() => {
      getData(); // Fetch data every 70 seconds
    }, 70000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  //   if (!sensor) {
  //     return <Typography variant="h6">Sensor data not found!</Typography>;
  //   }

  const formatTimestamp = (timestamp) => {
    // Handle UNIX timestamp (convert to number)
    if (!isNaN(timestamp)) {
      return new Date(timestamp * 1000).toLocaleString();
    }
    // Handle "YYYY-MM-DD HH:mm:ss" format
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // if (!latestData1 && !latestData2 && !latestData3) {
  //   return (
  //     <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
  //       <Typography variant="h6">No data available</Typography>
  //     </Box>
  //   );
  // }

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
          {[
            latestData1,
            latestData2,
            latestData3,
            latestData4,
            latestData5,
            latestData6,
            latestData7,
            latestData8,
            latestData9,
            latestData10,
            latestreceiveImeiData,
          ].map((data, index) =>
            data ? (
              <Grid item xs={12} sm={6} md={6} key={index}>
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
                      className="border-b-2 border-black"
                    >
                      <span>Sensor {index + 1}</span>
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      IMEI No. : {data?.imei}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "1.1rem", color: "#d32f2f" }}
                    >
                      🌡 Temperature: <strong>{data?.temperature}°C</strong>
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "1.1rem", color: "#87CEEB" }}
                    >
                      <FontAwesomeIcon icon={faTint} /> Humidity: <strong>{data?.humidity}%</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      ⏳ Last Updated: {formatTimestamp(data?.timestamp)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              <>
                {!receiveImei ? null : (
                  <Grid item xs={12} sm={6} md={6}>
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
                          className="border-b-2 border-black"
                        >
                          <span>Sensor {index + 1}</span>
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#1976d2" }}
                        >
                          IMEI No. : {receiveImei}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#1976d2" }}
                        >
                          No Data Available
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </>
            )
          )}
        </Grid>
      </Box>

      <ToastContainer />
    </>
  );
}

export default SensorDetails;
