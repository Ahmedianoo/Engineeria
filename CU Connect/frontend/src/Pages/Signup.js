import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { VerifyUser } from "../endpoints/VerifyEndpoint";
import VerificationPage from "../Components/VerificationPage"; // Import the VerificationPage component

function Signup() {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "", // New ConfirmPassword field
    UserType: "",
  });

  const [isVerifying, setIsVerifying] = useState(false); // State to toggle between pages
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for showing confirm password
  const [iconClicked, setIconClicked] = useState(false); // State for click animation
  const [isLoading, setIsLoading] = useState(false); // New isLoading state to track signup process

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target; // Fixed key issue
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    setIconClicked(true); // Trigger the click animation
    setTimeout(() => setIconClicked(false), 150); // Reset animation after 150ms
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
    setIconClicked(true); // Trigger the click animation
    setTimeout(() => setIconClicked(false), 150); // Reset animation after 150ms
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const waitToast = toast.loading("Signing up, please wait...");

    setIsLoading(true); // Set loading state to true when the signup process begins

    try {
      if (!formData.Email || !formData.Name || !formData.Password || !formData.ConfirmPassword) {
        throw new Error("All fields must be filled");
      }
      if (formData.Password !== formData.ConfirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (
        !formData.Email.endsWith("@eng-st.cu.edu.eg") &&
        !formData.Email.endsWith("@cu.edu.eg")
      ) {
        throw new Error("The Email must be a CUFE mail");
      }
      if (formData.Password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }
      if (!/[0-9]/.test(formData.Password)) {
        throw new Error("Password must contain at least one number.");
      }
      if (!/[a-z]/.test(formData.Password)) {
        throw new Error("Password must contain at least one lowercase letter.");
      }
      if (!/[A-Z]/.test(formData.Password)) {
        throw new Error("Password must contain at least one uppercase letter.");
      }
      if (!/[^a-zA-Z0-9]/.test(formData.Password)) {
        throw new Error("Password must contain at least one symbol.");
      }
      // Call the signup function
      const msg = await VerifyUser(formData.Email);
      if (!msg.success) {
        throw new Error("Couldn't send verification code");
      }
      toast.dismiss(waitToast);
      toast.success("Verification code sent to your email!");
      setIsVerifying(true); // Switch to VerificationPage
    } catch (err) {
      toast.dismiss(waitToast);
      toast.error(err.message || err.error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state when the signup process is finished
    } 
  };

  // Render either the Signup Form or the Verification Page
  return (
    <>
      {isVerifying ? (
        <VerificationPage formData={formData} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="Name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter your name"
                    required
                    disabled={isLoading} // Disable input when loading
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="Email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading} // Disable input when loading
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label htmlFor="Password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="Password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    className="input input-bordered w-full pr-10"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading} // Disable input when loading
                  />
                  {/* Toggle Password Visibility Icon */}
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className={`absolute inset-y-12 right-3 flex items-center text-gray-600 transition-colors duration-150 ${iconClicked ? "text-gray-400" : "text-gray-600"}`}
                    disabled={isLoading} // Disable button when loading
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <label htmlFor="ConfirmPassword" className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="ConfirmPassword"
                    name="ConfirmPassword"
                    value={formData.ConfirmPassword}
                    onChange={handleChange}
                    className="input input-bordered w-full pr-10"
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading} // Disable input when loading
                  />
                  {/* Toggle Confirm Password Visibility Icon */}
                  <button
                    type="button"
                    onClick={handleToggleConfirmPassword}
                    className={`absolute inset-y-12 right-3 flex items-center text-gray-600 transition-colors duration-150 ${iconClicked ? "text-gray-400" : "text-gray-600"}`}
                    disabled={isLoading} // Disable button when loading
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading} // Disable the button while loading
                >
                  {isLoading ? "Signing Up..." : "Sign Up"} {/* Show loading text */}
                </button>
              </form>

              {/* Link to Login */}
              <div className="mt-4 text-center">
                <p className="text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;
