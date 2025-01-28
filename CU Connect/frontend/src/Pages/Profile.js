import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast"; // Import Toaster and toast
import Navbar from "../Components/Navbar";
import { UpdateUserPassword } from "../endpoints/ProfileEndpoint";

const Profile = () => {
  const data = localStorage.getItem("user");
  const data1 = JSON.parse(data);
  const user = data1?.user;

  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = () => {
    setIsPasswordEditing(true);
  };

  const handlePasswordCancel = () => {
    setIsPasswordEditing(false);
    setPasswordData({ password: "", confirmPassword: "" });
  };

  const handlePasswordConfirm = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!"); 
      return;
    }
      if (passwordData.password.length > 7 &&
        /[a-z]/.test(passwordData.password) && 
        /[A-Z]/.test(passwordData.password) && 
        /\d/.test(passwordData.password) &&    
        /[^a-zA-Z\d]/.test(passwordData.password)) {
      } else {
        console.log(passwordData.password);
        toast.error("Password must be at least 8 characters long and include lowercase, uppercase, a number, and a non-alphanumeric character");
        return;
      }
  
      try {
        const res = await UpdateUserPassword(passwordData.password) 
        console.log(res) 
        setIsPasswordEditing(false);
        setPasswordData({ password: "", confirmPassword: "" });
        toast.success("Password updated successfully!"); 
        
      } catch (error) {
        console.log(error)
        toast.error("failed to update password")
      }
  };

  return (
    <>
      <Navbar />
      {/* <Toaster position="top-center" reverseOrder={false} /> Add Toaster */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
        <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg mx-3">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Profile</h1>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-gray-600">{user?.Name}</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-600">{user?.Email}</p>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <p className="mt-1 text-gray-600">{user?.UserType}</p>
            </div>
          </div>

          {/* Password Update Section */}
          {isPasswordEditing ? (
            <div className="mt-6 space-y-4">
              {/* New Password Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Cancel and Confirm Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePasswordCancel}
                  className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordConfirm}
                  className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <button
                onClick={handlePasswordUpdate}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
