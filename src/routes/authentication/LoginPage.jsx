// src/components/LoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, storeUserData, clearUserData } from "../Api/authApi";

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!credentials.username || !credentials.password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      
      // Use the auth service to login
      const userData = await loginUser({
        username: credentials.username,
        password: credentials.password
      });

      // Store user data using the auth service
      storeUserData(userData);

      // Log the values (remove in production)
      console.log("Login successful:", {
        role: userData.role,
        username: userData.username,
        empid: userData.empid
      });

      // Redirect based on role
      switch (userData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'staff':
          navigate('/staff');
          break;
        default:
          clearUserData();
          setError("Unauthorized role. Please contact support.");
      }
    } catch (err) {
      handleLoginError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (error) => {
    let errorMessage = "Login failed. Please try again.";
    
    switch (error.code) {
      case 'NETWORK_ERROR':
        errorMessage = "Cannot connect to server. Please check your network.";
        break;
      case 'API_ERROR':
        if (error.status === 401) {
          errorMessage = "Invalid username or password.";
        }
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    setError(errorMessage);
    console.error("Login error:", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="dark:bg-gray-800 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className="w-full p-3 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              required
              autoComplete="username"
              autoFocus
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full p-3 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;