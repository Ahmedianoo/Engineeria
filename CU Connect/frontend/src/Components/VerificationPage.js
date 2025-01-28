import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSignup } from "../hooks/useSignup"; // Import the useSignup hook
import { useNavigate } from "react-router-dom";

const VerificationPage = ({ formData }) => {
  const { signup, isLoading, error } = useSignup(); // Get the signup function and loading state from the hook
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [failedAttempts, setFailedAttempts] = useState(0); // To track failed attempts
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  // Timer state (10 minutes countdown)
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft === 0) {
      // When time runs out, refresh the page
      window.location.reload();
    }

    const timerId = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      }
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/\d/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if OTP is valid
    if (otp.join("").length !== 6 || otp.includes("")) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    const OTP = otp.join(""); // Convert OTP array to a string

    try {
      // Call the signup function from the useSignup hook with formData and OTP
      await signup(formData.Name, formData.Email, formData.Password, formData.UserType, OTP);
      toast.success("Account verified successfully!");
      navigate("/"); // Redirect to home or dashboard
    } catch (err) {
      toast.error(err.message || "OTP verification failed. Please try again.");
      
      // Increment failed attempts
      setFailedAttempts((prev) => prev + 1);

      // If failed attempts exceed 3, refresh the page
      if (failedAttempts + 1 >= 3) {
        toast.error("You have exceeded the maximum number of attempts. The page will now refresh.");
        window.location.reload(); // Refresh page after 3 failed attempts
      }
    }
  };

  // Function to format the time left (HH:MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Verify Your Account</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit verification code sent to your email.
        </p>

        {/* Display countdown timer */}
        <div className="text-red-500 text-center mb-6">
          Time left: {formatTime(timeLeft)}
        </div>

        {/* Display failed attempts count */}
        <div className="text-red-500 text-center mb-6">
          Failed Attempts: {failedAttempts} / 3
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center text-xl border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full py-2 text-white rounded-lg"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationPage;
