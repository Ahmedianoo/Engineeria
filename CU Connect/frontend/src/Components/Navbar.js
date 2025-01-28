import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { FaBars } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";

function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Determine which links to show based on the user type
  const renderLinks = () => {
    const userType = user?.user?.UserType;
    // console.log(userType)
    if (userType === "student") {
      return (
        <>
          <li>
            <Link to="/" className="hover:bg-gray-300 mx-4">
              Home
            </Link>
          </li>
          <li>
            <Link to="/projects" className="hover:bg-gray-300 mx-4">
              Projects
            </Link>
          </li>
          <li>
            <Link to="/activity" className="hover:bg-gray-300 mx-4">
              Activities
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:bg-gray-300 mx-4">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/connection" className="hover:bg-gray-300 mx-4">
              Connections
            </Link>
          </li>
        </>
      );
    } else if (userType === "teacherTA") {
      return (
        <>
          <li>
            <Link to="/" className="hover:bg-gray-300 mx-4">
              Home
            </Link>
          </li>
          <li>
            <Link to="/projects" className="hover:bg-gray-300 mx-4">
              Projects
            </Link>
          </li>
        </>
      );
    } if (userType === "teacherDoctor") {
      return (
        <>
          <li>
            <Link to="/" className="hover:bg-gray-300 mx-4">
              Home
            </Link>
          </li>
          <li>
            <Link to="/Subjects" className="hover:bg-gray-300 mx-4">
              Subjects
            </Link>
          </li>
          <li>
            <Link to="/projects" className="hover:bg-gray-300 mx-4">
              Projects
            </Link>
          </li>
        </>
      );
    } 
    else if (userType === "admin") {
      return (
        <>
          <li>
            <Link to="/" className="hover:bg-gray-300 mx-4">
              Home
            </Link>
          </li>
          <li>
            <Link to="/projects" className="hover:bg-gray-300 mx-4">
              Projects
            </Link>
          </li>
          <li>
            <Link to="/activity" className="hover:bg-gray-300 mx-4">
              Activities
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:bg-gray-300 mx-4">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/admin" className="hover:bg-gray-300 mx-4">
              AdminDashboard
            </Link>
          </li>

        </>
      );
    }

    return null; // Default case for unhandled UserType
  };

  return (
    <div className="navbar bg-base-100 bg-gray-200">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost md:hidden"
            onClick={toggleMobileMenu}
          >
            <FaBars className="h-5 w-5" />
          </div>

          <ul
            tabIndex={0}
            className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ${isMobileMenuOpen ? "block" : "hidden"
              }`}
          >
            {renderLinks()}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          Cu Connect
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1">{renderLinks()}</ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        {user ? (
          <button onClick={handleLogout} className="btn btn-error">
            Logout
          </button>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="btn btn-ghost">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
