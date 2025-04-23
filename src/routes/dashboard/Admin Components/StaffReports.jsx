import { useState, useEffect } from "react";
import { FaChartBar, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { reportApi } from "../../Api/reportApi";

const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this report? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffReports = () => {  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [reportsPerPage] = useState(6);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchStaffReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const { reports: reportsData, total } = await reportApi.getDailyReports(
          selectedDate, 
          currentPage, 
          reportsPerPage
        );
        setReports(reportsData);
        console.log(reportsData);
        
        setTotalReports(total);
      } catch (err) {
        console.error("Error fetching staff reports:", err);
        setError("Failed to load reports. Please try again.");
        setReports([]);
        setTotalReports(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffReports();
  }, [selectedDate, currentPage, reportsPerPage]);

  const deleteReport = async () => {
    if (!reportToDelete) return;
    
    try {
      await reportApi.deleteDailyReport(reportToDelete.id);
      setReports(prev => prev.filter(report => report.id !== reportToDelete.id));
      setTotalReports(prev => prev - 1);
    } catch (err) {
      console.error("Error deleting report:", err);
      setError("Failed to delete report. Please try again.");
    } finally {
      setDeleteModalOpen(false);
      setReportToDelete(null);
    }
  };

  const totalPages = Math.ceil(totalReports / reportsPerPage) || 1;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaChartBar /> Staff Performance Reports
      </h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <label htmlFor="date-picker" className="text-gray-800 dark:text-gray-100">
          Select Date:
        </label>
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          max={getTodayDate()}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400 py-8">
          <FaSpinner className="animate-spin" />
          <span>Loading reports...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-gray-600 dark:text-gray-300">
          No reports available for {selectedDate}.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    {report.empname || "Unnamed Employee"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {report.date} 
                  </p>
                </div>
                <button
                  onClick={() => {
                    setReportToDelete(report);
                    setDeleteModalOpen(true);
                  }}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                  aria-label={`Delete report from ${report.staffname}`}
                >
                  <FaTrashAlt />
                </button>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Details:
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {report.report || "No content provided."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalReports > reportsPerPage && (
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500'
            } transition-colors`}
          >
            Previous
          </button>
          <span className="text-gray-800 dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500'
            } transition-colors`}
          >
            Next
          </button>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={deleteReport}
        onCancel={() => {
          setDeleteModalOpen(false);
          setReportToDelete(null);
        }}
      />
    </div>
  );
};

export default StaffReports;