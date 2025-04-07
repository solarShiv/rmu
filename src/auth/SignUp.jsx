import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import g3Image from "../assets/Logo/G3.jpeg"; // Assuming the image is in the assets folder
import { Box, Button, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // To toggle confirm password visibility
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Prepare data for the API call
    const signupData = { email, password,confirmPassword };

    try {
      // Send signup request to the backend API
      const response = await fetch("http://srv619650.hstgr.cloud:4042/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful signup, redirect to login page
        navigate("/");
      } else {
        // Display error message from API
        setError(data.message || "Failed to sign up. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9] px-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        {/* Image Section */}
        <div className="flex justify-center mb-4">
          <img src={g3Image} alt="G3 Logo" className="h-16 w-auto object-contain" />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-[#050505] text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-200 font-semibold text-[#a20000]">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#a20000] focus:border-transparent"
              required
            />
          </div>

          <Box mb={3}>
            <label htmlFor="password" className="block text-200 font-semibold text-[#a20000] text-left">Password</label>
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={togglePasswordVisibility}
                    sx={{ minWidth: 0, color: "grey" }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </Button>
                ),
              }}
              sx={{ width: "100%" }}
            />
          </Box>

          <Box mb={3}>
            <label htmlFor="confirmPassword" className="block text-200 font-semibold text-[#a20000] text-left">Confirm Password</label>
            <TextField
              fullWidth
              variant="outlined"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={toggleConfirmPasswordVisibility}
                    sx={{ minWidth: 0, color: "grey" }}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </Button>
                ),
              }}
              sx={{ width: "100%" }}
            />
          </Box>

          <button
            type="submit"
            style={{border:"1px solid #b38686",hover: { borderColor: "#a20000" }}}
            className="w-full border-2-gray  bg-[#a20000] text-#a20000 py-3 rounded-lg text-lg font-semibold border-4 border-[#a20000] hover:bg-red-600 hover:text-[#a20000] hover:border-red-700 transition duration-300 ease-in-out mt-4"
          >
            Submit
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/" className="text-[#a20000] font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
