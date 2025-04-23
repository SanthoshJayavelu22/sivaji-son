import React, { useState, useEffect } from "react";
import { dailyReportService } from "../../Api/dailyReportService";

const DailyReportPage = () => {
    const empId = localStorage.getItem('userEmpid');
    const userName = localStorage.getItem('staffName');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        date: new Date().toISOString().split('T')[0]
    });

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Load reports from localStorage on component mount
    useEffect(() => {
        const loadReports = () => {
            try {
                const savedReports = localStorage.getItem('dailyReports');
                if (savedReports) {
                    const parsedReports = JSON.parse(savedReports);
                    const userReports = parsedReports.filter(report => report.empid === empId);
                    setReports(userReports);
                }
            } catch (err) {
                console.error("Error loading reports:", err);
                setError("Failed to load reports");
            }
        };

        loadReports();
    }, [empId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        
        if (!formData.description) {
            setError("Report description is required");
            return;
        }

        const newReport = {
            id: Date.now(),
            empid: empId,
            staffname: userName,
            description: formData.description,
            date: formData.date,
            status: "submitted",
            timestamp: new Date().toISOString()
        };

        try {
            setLoading(true);
            setError(null);
            
            await dailyReportService.sendDailyReport({
                empname: userName,
                empid: empId,
                report: formData.description,
                date: formData.date
            });

            setReports(prev => [newReport, ...prev]);
            
            const existingReports = JSON.parse(localStorage.getItem('dailyReports') || "[]");
            localStorage.setItem('dailyReports', JSON.stringify([...existingReports, newReport]));
            
            setFormData({
                description: "",
                date: new Date().toISOString().split('T')[0]
            });
            setShowForm(false);
        } catch (err) {
            console.error("Error submitting report:", err);
            setError(err.message || "Failed to submit report");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReport = (id) => {
        const updatedReports = reports.filter(report => report.id !== id);
        setReports(updatedReports);
        
        const allReports = JSON.parse(localStorage.getItem('dailyReports') || []);
        const filteredReports = allReports.filter(report => report.id !== id);
        localStorage.setItem('dailyReports', JSON.stringify(filteredReports));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <section className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Daily Reports</h1>
                    <p className="text-gray-600 dark:text-gray-300">Today is {currentDate}</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-md transition-colors"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "+ New Report"}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Submit Daily Report
                            </h3>
                            
                            <form onSubmit={handleSubmitReport}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Staff Name
                                            </label>
                                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                                                {userName}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Employee ID
                                            </label>
                                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                                                {empId}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Report Date
                                        </label>
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                                            {formatDate(formData.date)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                           Report Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="5"
                                            className="block w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            disabled={loading}
                                        ></textarea>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setError(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transition-colors"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-md transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </span>
                                        ) : "Submit Report"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Reports</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {reports.length} {reports.length === 1 ? 'report' : 'reports'} found
                    </p>
                </div>

                {reports.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No reports found. Submit your first report using the button above.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {reports.map((report) => (
                            <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {formatDate(report.date)} | {report.staffname} (ID: {report.empid})
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            report.status === "submitted" 
                                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" 
                                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        }`}>
                                            {report.status}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteReport(report.id)}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            title="Delete report"
                                            disabled={loading}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-3 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                    {report.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DailyReportPage;