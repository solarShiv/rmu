import React from "react";
import { Button, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to, tooltip = "Back", onClick, style }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <div className="flex gap-4 items-center w-full m-2">
      <Tooltip title={tooltip}>
        <Button
          onClick={handleClick}
          style={{
            backgroundColor: "#D5E5D5",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            ...style,
          }}
        >
          <ArrowBackIcon />
        </Button>
      </Tooltip>
    </div>
  );
};

export default BackButton;
