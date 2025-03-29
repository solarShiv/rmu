import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const sensorData = {
  "Sensor 1": { id: 1, name: "Sensor 1", type: "Temperature" },
  "Sensor 2": { id: 2, name: "Sensor 2", type: "Humidity" },
  "Sensor 3": { id: 3, name: "Sensor 3", type: "Pressure" },
  "Sensor 4": { id: 4, name: "Sensor 4", type: "Light" },
  "Sensor 5": { id: 5, name: "Sensor 5", type: "Motion" },
  "Sensor 6": { id: 6, name: "Sensor 6", type: "Proximity" },
  "Sensor 7": { id: 7, name: "Sensor 7", type: "Sound" },
};

function SensorCards() {
  const navigate = useNavigate();

  const getCardColor = (index) => {
    return index % 2 === 0 ? "#EEF1DA" : "#D5E5D5";
  };

  const handleCardClick = (sensorName) => {
    navigate(`/sensor/${sensorName}`);
  };

  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
      <Grid container spacing={2}>
        {Object.entries(sensorData).map(([name, data], index) => {
          const cardColor = getCardColor(index);
          const textColor = cardColor === "#EEF1DA" ? "black" : "black";

          return (
            <Grid item xs={12} sm={6} md={3} key={data.id}>
              <Card
                sx={{
                  backgroundColor: cardColor,
                  color: textColor,
                  borderRadius: 4,
                  boxShadow: 2,
                  padding: "10px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleCardClick(name)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography variant="body2">{data.type}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default SensorCards;
