import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import LogIn from "./Login";
import SignUp from "./SignUp";
import Sivajison from "../assets/images/SIVAJI_SON_LOGO.png";

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  const location = useLocation(); // Get the current location

  // Close the menu when the location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div>
      {/* Navbar with fixed positioning */}
      <nav className="bg-white border-gray-200 fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="flex flex-wrap items-center justify-between mx-auto p-5 max-w-7xl">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src={Sivajison}
              className="w-52 md:w-32 h-16"
              alt="Sivaji Son Logo"
            />
          </Link>
          <button
            data-collapse-toggle="navbar-dropdown"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-dropdown"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:block md:w-auto`}
            id="navbar-dropdown"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <Link
                  to="/"
                  className={`block py-2 px-3 text-gray-900 font-[Roboto] md:p-0 relative md:hover:text-[var(--primary)] ${
                    location.pathname === "/" ? "text-green-900" : ""
                  }`}
                >
                  Home
                  {location.pathname === "/" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-900"></span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`block py-2 px-3 text-gray-900 font-[Roboto] rounded-sm md:hover:text-[var(--primary)] md:border-0 md:p-0 relative ${
                    location.pathname === "/about" ? "text-green-900" : ""
                  }`}
                >
                  About Us
                  {location.pathname === "/about" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-900"></span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`block py-2 px-3 text-gray-900 font-[Roboto] rounded-sm md:hover:text-[var(--primary)] md:border-0 md:p-0 relative ${
                    location.pathname === "/services" ? "text-green-900" : ""
                  }`}
                >
                  Services
                  {location.pathname === "/services" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-900"></span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block py-2 px-3 font-[Roboto] rounded-sm md:hover:text-[var(--primary)] md:border-0 md:p-0 relative ${
                    location.pathname === "/contact" ? "text-green-900" : ""
                  }`}
                >
                  Contact Us
                  {location.pathname === "/contact" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-900"></span>
                  )}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setIsLoginOpen(true)}
                  className="flex gap-2 py-2 px-3 font-[Roboto] rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[var(--primary)] md:p-0"
                >
                  <FaUserCircle size="30" /> Log in/Sign up
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Login and Signup Modals */}
      <LogIn
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignUpClick={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />

      <SignUp
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onLoginClick={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
};

export default Header;
