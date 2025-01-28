import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useLogin } from "../hooks/useLogin";

function Login() {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const { login, error, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [iconClicked, setIconClicked] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    setIconClicked(true);
    setTimeout(() => setIconClicked(false), 150);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show loading toast
    const waitToast = toast.loading("Logging in, please wait...");

    try {
      // Attempt login
      await login(formData.Email, formData.Password);

      // On success
      toast.dismiss(waitToast); // Remove the loading toast
      toast.success("Login successful! Welcome back.");
      navigate("/"); // Redirect to Home page
    } catch (err) {
      // On error
      toast.dismiss(waitToast); // Remove the loading toast
      toast.error( err.message || err.error || err || "Failed to log in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              className="input input-bordered w-full pr-10"
              placeholder="Enter your password"
              required
            />
            {/* Toggle Password Visibility Icon */}
            <button
              type="button"
              onClick={handleTogglePassword}
              className={`absolute inset-y-12 right-3 flex items-center 
              text-gray-600 transition-colors duration-150 
              ${iconClicked ? "text-gray-400" : "text-gray-600"}`}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* Redirect to Signup */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
