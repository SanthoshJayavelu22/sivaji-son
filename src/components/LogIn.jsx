import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LogIn = ({ isOpen, onClose, onSignUpClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validate = () => {
    let valid = true;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Sign-up successful!");
      onClose(); // Close the popup after successful submission
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
        >
          <div className="w-full max-w-lg px-4">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="px-6 py-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-center text-[var(--primary)]">Login</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form className="mt-6" onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900 font-[Roboto]">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={`block w-full mt-2 p-4 border ${
                          emailError ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-900 font-[Roboto]">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={`block w-full mt-2 p-4 border ${
                          passwordError ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 font-[Roboto]">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className={`block w-full mt-2 p-4 border ${
                          confirmPasswordError ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {confirmPasswordError && (
                        <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 text-white bg-[var(--primary)] rounded-md hover:bg-green-900 transition duration-300 font-[Roboto]"
                    >
                      Login
                    </button>
                    <p className="mt-2 text-center text-gray-600 font-[Roboto]">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSignUpClick}
              className="text-blue-600 hover:underline font-[Roboto]"
            >
              Sign up here
            </button>
          </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogIn;