import { useState, useEffect } from "react";
import { FaSpinner, FaCheckCircle, FaTrash } from "react-icons/fa";
import { attendanceService } from "../../Api/attendanceService";

const AttendancePage = () => {
  // User data from localStorage
  const userName = localStorage.getItem('staffName');
  const empId = localStorage.getItem('userEmpid');
  
  // State management
  const [fullName, setFullName] = useState(userName);
  const [employeeId, setEmployeeId] = useState(empId);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recentRecords, setRecentRecords] = useState([]);
  const [attendanceRegistered, setAttendanceRegistered] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);

  // Check attendance status on component mount
  const checkAttendanceStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await attendanceService.checkAttendance(empId, today);
      
      if (response.data && response.data.length > 0) {
        setAttendanceRegistered(true);
        setSuccess("Your attendance for today is already registered");
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error checking attendance:", error);
    } finally {
      setLoadingCheck(false);
    }
  };

  // Load recent records from localStorage
  const loadRecentRecords = () => {
    const savedRecords = localStorage.getItem('recentAttendanceRecords');
    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const validRecords = parsedRecords.filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate > oneWeekAgo;
        });
        
        setRecentRecords(validRecords);
        
        if (validRecords.length !== parsedRecords.length) {
          localStorage.setItem('recentAttendanceRecords', JSON.stringify(validRecords));
        }
      } catch (error) {
        console.error("Error parsing saved records:", error);
        localStorage.removeItem('recentAttendanceRecords');
      }
    }
  };

  // Update current date/time
  const updateDateTime = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    setCurrentDateTime(now.toLocaleDateString("en-US", options));
  };

  // Effects
  useEffect(() => {
    checkAttendanceStatus();
    loadRecentRecords();
    updateDateTime();
    
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (recentRecords.length > 0) {
      localStorage.setItem('recentAttendanceRecords', JSON.stringify(recentRecords));
    }
  }, [recentRecords]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (attendanceRegistered) return;
    
    setErrors({});
    setSuccess("");
    setIsSubmitting(true);

    // Validation
    let validationErrors = {};
    if (!fullName.trim()) validationErrors.fullName = "Full Name is required";
    if (!employeeId.trim()) validationErrors.employeeId = "Employee ID is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const attendanceData = {
        empid: employeeId,
        staffname: fullName,
      };

      await attendanceService.registerAttendance(attendanceData);

      const newRecord = {
        id: Date.now(),
        fullName,
        employeeId,
        date: currentDateTime,
        timestamp: new Date().toISOString()
      };

      setRecentRecords(prev => [newRecord, ...prev].slice(0, 10));
      setSuccess("Attendance recorded successfully!");
      setShowSuccess(true);
      setAttendanceRegistered(true);
      
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setSuccess(error.message || "Failed to submit attendance");
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete record handler
  const handleDelete = (id) => {
    const updatedRecords = recentRecords.filter((record) => record.id !== id);
    setRecentRecords(updatedRecords);
  };

  // Format date for display
  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loadingCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-green-500">
            Attendance Record
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Record your daily attendance
          </p>
        </div>

        <div className="relative max-w-md mx-auto mt-12 md:mt-16">
          <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="px-8 py-10 sm:px-10 sm:py-12">
              {showSuccess && (
                <div className={`p-4 mb-6 rounded-lg border ${
                  success.includes("Failed") 
                    ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                    : "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                } animate-fade-in`}>
                  <p>{success}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Staff Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`block w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border ${
                        errors.fullName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      readOnly={!!userName}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className={`block w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border ${
                        errors.employeeId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      readOnly={!!empId}
                    />
                    {errors.employeeId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employeeId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Date & Time
                    </label>
                    <div className="p-3 px-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                      <p className="text-gray-900 dark:text-gray-200 font-medium">
                        {currentDateTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || attendanceRegistered}
                      className={`w-full px-6 py-3.5 text-lg font-semibold text-white rounded-lg shadow-md ${
                        isSubmitting 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : attendanceRegistered
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                      } focus:ring-4 focus:ring-green-400 dark:focus:ring-green-600 transition-colors flex items-center justify-center gap-2`}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Processing...
                        </>
                      ) : attendanceRegistered ? (
                        <>
                          <FaCheckCircle />
                          Attendance Submitted
                        </>
                      ) : (
                        "Submit Attendance"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {recentRecords.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Recent Attendance
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last 7 days • {recentRecords.length} records
                </span>
              </div>
              <ul className="space-y-3">
                {recentRecords.map((record) => (
                  <li
                    key={record.id}
                    className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {record.fullName} <span className="text-gray-500 dark:text-gray-400">({record.employeeId})</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {formatDateDisplay(record.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      title="Delete record"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AttendancePage;