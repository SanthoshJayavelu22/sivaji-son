import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMonthlyAttendance } from "../../Api/Attendance";
import { useParams } from "react-router-dom";

const MonthlyAttendancePage = () => {
  const navigate = useNavigate();
  const { staffId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [staffName, setStaffName] = useState("");

  // Get current date as default values
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // useEffect(() => {
  //   const id = localStorage.getItem('currentStaffId');
  //   if (id) {
  //     setStaffEmpid(id);
  //   }
  // }, []);

  const fetchAttendanceData = async (month, year) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getMonthlyAttendance(staffId, year, month);
      
      if (data && data.length > 0) {
        setAttendanceData(data);
        setStaffName(data[0].staffname);
        
        // Extract unique years from the data
        const years = [...new Set(data.map(item => 
          new Date(item.date).getFullYear()
        ))];
        setAvailableYears(years.sort((a, b) => b - a));
      } else {
        setAttendanceData([]);
        setStaffName("");
        setAvailableYears([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchAttendanceData(selectedMonth, selectedYear);
    }
  }, [staffId, selectedMonth, selectedYear]);

  const handleBack = () => navigate("/admin/staffattendance");

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  // Format time to 12-hour AM/PM format
  const formatTime = (timeString) => {
    if (!timeString) return "Not Recorded";
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hourNum = parseInt(hours, 10);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const hours12 = hourNum % 12 || 12;
      return `${hours12}:${minutes} ${period}`;
    } catch (err) {
      console.error("Error formatting time:", err);
      return timeString;
    }
  };

  // Filter data by selected month and year
  const filteredData = attendanceData.filter((item) => {
    const date = new Date(item.date);
    return (
      date.getMonth() + 1 === selectedMonth && 
      date.getFullYear() === selectedYear
    );
  });

  // Calculate attendance stats
  const totalDays = filteredData.length;
  const presentDays = filteredData.filter(item => item.intime).length;
  const absentDays = totalDays - presentDays;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl">Loading attendance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }



  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-4xl dark:bg-gray-900 dark:text-white bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Monthly Attendance</h1>
            {staffName && <p className="text-sm text-gray-600 dark:text-gray-300">Staff: {staffName}</p>}
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mb-4">
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              ) : (
                <option value={selectedYear}>{selectedYear}</option>
              )}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              {[...Array(12).keys()].map((m) => (
                <option key={m + 1} value={m + 1}>
                  {new Date(selectedYear, m).toLocaleString("en-US", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </div>

     

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 dark:border-gray-700 text-center">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-3">S.no</th>
                <th className="p-3">Date</th>
                <th className="p-3">Check-in Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{formatDate(item.date)}</td>
                    <td className="p-3">{formatTime(item.intime)}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.intime 
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {item.intime ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No attendance records found for selected month/year
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendancePage;