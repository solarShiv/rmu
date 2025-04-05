import { useState } from "react";
import { useNavigate } from "react-router-dom";
import g3Image from "../assets/Logo/G3.jpeg"; // Assuming the image is in the assets folder
import { Box, Button, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Prepare payload for API call
    const loginData = { email, password };

    try {
      // Send login request to the backend API
      const response = await fetch("http://srv619650.hstgr.cloud:4042/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token or user data in localStorage or context if needed
        localStorage.setItem("token", data.token); // Store token if returned
        navigate("/sensor"); // Redirect to the dashboard after successful login
      } else {
        // Display error if login failed
        setError(data.message || "Failed to log in. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9]">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
        {/* Image Section */}
        <div className="flex justify-center mb-4">
          <img src={g3Image} alt="G3 Logo" className="h-16 w-auto object-contain" />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-[#050505]">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-200 font-semibold text-[#a20000] text-left">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 ml-0"
              required
            />
          </div>

            <Box mb={3}>
            <label htmlFor="password" className="block text-200 font-semibold text-[#a20000] text-left">Password</label>
                    <TextField
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <Button
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ minWidth: 0, color: "grey" }}
                          >
                            {showPassword ?<Visibility />: <VisibilityOff />  }
                          </Button>
                        ),
                      }}
                      sx={{ width: "100%" }}
                    />
                  </Box>

          <button
            type="submit"
            style={{border:"1px solid #b38686",hover: { borderColor: "#a20000" }
            }}
            className="w-full bg-[#b38686] text-[#a20000] py-3 rounded-lg text-lg font-semibold  mt-6"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#a20000] font-semibold">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
