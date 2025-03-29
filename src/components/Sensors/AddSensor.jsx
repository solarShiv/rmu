import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

const AddSensor = ({ open, setOpen, onClose, onSendData }) => {
  //   const [open, setOpen] = useState(false);
  const [imeiNo, setimeiNo] = useState("");

  // Modal style
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setimeiNo("");
  };

  // Handle input change
  const handleimeiChange = (event) => {
    setimeiNo(event.target.value);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (imeiNo.trim()) {
      onSendData(imeiNo); // Pass data to parent
      setimeiNo(""); // Reset input field
      onClose(); // Close modal
    }
  };

  return (
    <div>
      {/* Add Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add IMEI
      </Button>

      {/* Modal */}
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="imei-modal-title"
        aria-describedby="imei-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="imei-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Enter IMEI Number
          </Typography>

          <TextField
            label="IMEI Number"
            variant="outlined"
            value={imeiNo}
            onChange={handleimeiChange}
            fullWidth
            margin="normal"
          />

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              //   disabled={loading}
            >
              {/* {loading ? <CircularProgress size={24} /> : "Submit"} */}
              Submit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              //   disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AddSensor;
