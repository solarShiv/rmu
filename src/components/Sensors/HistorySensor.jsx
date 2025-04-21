import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";

const HistorySensor = () => {
  const { imei } = useParams();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const imeiToLocationMap = {
    "869630054647155": "Lam-Area-A13",
    "869630054641893": "Lam-Area-A11",
    "869630054641570": "Lam-Area-A15",
    "869630054635820": "Pre-Lam-A10",
    "869630054647270": "Post-Lam-A19",
    "869630054642248": "Pre-Lam-A7",
    "869630054636075": "Post-Lam-A16",
    "869630054641455": "Post-Lam-A20",
    "869630054646975": "Pre-Lam-A9",
    "869630054642545": "Pre-Lam-A5",
    "869630054647007": "Pre-Lam-A2",
    "869630054641737": "Post-Lam-A17",
    "869630054640895": "Pre-Lam-A3",
    "869630054645142": "Lam-Area-A14",
    "869630054642461": "Pre-Lam-A6",
    "869630054647163": "UPS Room",
    "869630054642438": "UPS Room",
    "864710059982404": "Delhi Office",
  };
  
  const location = imeiToLocationMap[imei] || "Unknown Location";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://srv619650.hstgr.cloud:4042/api/data/getData/${imei}`
        );
        if (response.status === 200) {
          const sortedData = response.data.tempData || [];
          sortedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setHistoryData(sortedData);
        } else {
          setError("No data found for this IMEI.");
        }
      } catch (error) {
        console.error("Failed to fetch history data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [imei]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (historyData.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="textSecondary">
          No data found for this IMEI.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2, px: 1 }}>
        
      <Typography variant="h4" gutterBottom sx={{ color: "#a20000", fontWeight: "bold" }}>
        📊 History for IMEI: {imei}
      </Typography>
 <Typography variant="h5" sx={{ color: "#a20000", fontWeight: "bold", mb: 0.5 }}>
    📍 Location: {location}
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{
          backgroundColor: "#a20000",
          color: "white",
          mb: 3,
          "&:hover": { backgroundColor: "#870000" },
        }}
      >
        ← Go Back
      </Button>

      <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e", borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#a20000" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>📅 Timestamp</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>🌡 Temperature (°C)</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>💧 Humidity (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData.map((entry, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover": { backgroundColor: "#2e2e2e" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell sx={{ color: "#f1f1f1" }}>
                  {new Date(entry.timestamp).toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: "#f1f1f1" }}>
                  {entry.temperature ?? "N/A"}°C
                </TableCell>
                <TableCell sx={{ color: "#f1f1f1" }}>
                  {entry.humidity ?? "N/A"}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HistorySensor;
