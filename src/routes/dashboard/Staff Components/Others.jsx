import React, { useState, useEffect } from "react";
import { 
  submitTravelDocuments,
  getRecentSubmissions,
  saveRecentSubmission,
  deleteRecentSubmission
} from "../../Api/otherdata";

const Others = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    customername: "",
    customerid: "",
    customermail: "",
    customernumber: "",
    visa: "",
    passport: "",
    travelinsurance: "",
    busticket: "",
    servicesdetails: "",
    submissiondate: "",
    collectiondate: ""
  });

  // State for recent submissions
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    message: null,
    type: 'success',
    duration: 5000
  });

  // Load recent submissions on component mount
  useEffect(() => {
    setRecentSubmissions(getRecentSubmissions());
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // If customerId is changed, update customerNumber
      if (name === 'customerid') {
        newData.customernumber = value;
      }
      // If customerNumber is changed, update customerId
      else if (name === 'customernumber') {
        newData.customerid = value;
      }
      
      return newData;
    });
  };



  // Handle date input click
  const handleDateClick = (fieldName) => {
    document.getElementById(fieldName).showPicker();
  };

  // Form validation (same as before)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.customername.trim()) newErrors.customername = "Customer Name is required";
    if (!formData.customerid.trim()) newErrors.customerid = "Customer ID is required";
    
    if (!formData.customernumber.trim()) {
      newErrors.customernumber = "Customer Number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.customernumber)) {
      newErrors.customernumber = "Please enter a valid 10-15 digit phone number";
    }
    
    if (!formData.customermail.trim()) {
      newErrors.customermail = "Customer Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customermail)) {
      newErrors.customermail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      setShowConfirmation(true);
    }
    setIsSubmitting(false);
  };

  const handleConfirmation = async (confirmed) => {
    setShowConfirmation(false);
  
    if (confirmed) {
      setIsSubmitting(true);
  
      try {
        // Submit to backend API
        await submitTravelDocuments(formData);

        // Save to recent submissions
        const newSubmission = {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };

        const updatedSubmissions = saveRecentSubmission(newSubmission);
        setRecentSubmissions(updatedSubmissions);

        // Show success notification
        setNotification({
          message: "Travel document submission successful!",
          type: 'success',
          duration: 5000
        });

        // Reset form
        setFormData({
          customername: "",
          customerid: "",
          customermail: "",
          customernumber: "",
          visa: "",
          passport: "",
          travelinsurance: "",
          busticket: "",
          servicesdetails: "",
          submissiondate: "",
          collectiondate: ""
        });

      } catch (error) {
        console.error("Error submitting form:", error);
        setNotification({
          message: error.response?.data?.message || "Failed to submit travel documents",
          type: 'error',
          duration: 5000
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Fill form with recent submission
  const useRecentSubmission = (submission) => {
    setFormData({
      customername: submission.customername,
      customerid: submission.customerid,
      customermail: submission.customermail,
      customernumber: submission.customernumber,
      visa: submission.visa,
      passport: submission.passport,
      travelinsurance: submission.travelinsurance,
      busticket: submission.busticket,
      servicesdetails: submission.servicesdetails,
      submissiondate: submission.submissiondate,
      collectiondate: submission.collectiondate
    });
  };

  // Handle delete submission
  const handleDeleteSubmission = (submissionId) => {
    setSubmissionToDelete(submissionId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteSubmission = (confirmed) => {
    setShowDeleteConfirmation(false);
    
    if (confirmed) {
      const updatedSubmissions = deleteRecentSubmission(submissionToDelete);
      setRecentSubmissions(updatedSubmissions);
    }
    
    setSubmissionToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
   
      
      <div className="max-w-4xl mx-auto">
        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-green-600">Other Documents Submission</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please fill in all the required details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customername"
                value={formData.customername}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.customername 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter Customer Name"
              />
              {errors.customername && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customername}
                </p>
              )}
            </div>

            {/* Customer ID */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerid"
                maxLength={15}
                value={formData.customerid}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.customerid 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter Customer ID"
              />
              {errors.customerid && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customerid}
                </p>
              )}
            </div>

            {/* Customer Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="customermail"
                value={formData.customermail}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.customermail 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter Customer Email"
              />
              {errors.customermail && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customermail}
                </p>
              )}
            </div>

            {/* Customer Number */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={15}
                name="customernumber"
                value={formData.customernumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.customernumber 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter Customer Phone Number"
                pattern="[0-9]{10,15}"
              />
              {errors.customernumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customernumber}
                </p>
              )}
            </div>

            {/* VISA */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                VISA Details
              </label>
              <textarea
                name="visa"
                value={formData.visa}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter VISA details"
                rows="3"
              />
            </div>

            {/* PASSPORT */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                PASSPORT Details
              </label>
              <textarea
                name="passport"
                value={formData.passport}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter PASSPORT details"
                rows="3"
              />
            </div>

            {/* TRAVEL INSURANCE */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                TRAVEL INSURANCE Details
              </label>
              <textarea
                name="travelinsurance"
                value={formData.travelinsurance}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter TRAVEL INSURANCE details"
                rows="3"
              />
            </div>

            {/* BUS TICKET */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                BUS TICKET Details
              </label>
              <textarea
                name="busticket"
                value={formData.busticket}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter BUS TICKET details"
                rows="3"
              />
            </div>

            {/* SERVICES DETAILS */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                SERVICES DETAILS
              </label>
              <textarea
                name="servicesdetails"
                value={formData.servicesdetails}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter SERVICES DETAILS"
                rows="3"
              />
            </div>

      
            {/* SUBMISSION DATE */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                SUBMISSION DATE 
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="submissiondate"
                  name="submissiondate"
                  value={formData.submissiondate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                    errors.submissiondate 
                      ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                      : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                <div 
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => handleDateClick("submissiondate")}
                ></div>
                {formData.submissiondate && (
                  <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none">
                    {formatDate(formData.submissiondate)}
                  </div>
                )}
              </div>
              {errors.submissiondate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.submissiondate}
                </p>
              )}
            </div>



            {/* COLLECTION DATE */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                COLLECTION DATE
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="collectiondate"
                  name="collectiondate"
                  value={formData.collectiondate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div 
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => handleDateClick("collectiondate")}
                ></div>
                {formData.collectiondate && (
                  <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none">
                    {formatDate(formData.collectiondate)}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                  isSubmitting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                } min-w-[150px]`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>

          {/* Confirmation Popup */}
          {showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Confirm Submission</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to submit these travel documents? Please verify all details before confirmation.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleConfirmation(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmation(true)}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Submissions Card */}
        {recentSubmissions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-green-600 mb-6">Recent Submissions</h3>
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div 
                  key={submission.id} 
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition relative"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubmission(submission.id);
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div 
                    className="cursor-pointer"
                    onClick={() => useRecentSubmission(submission)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="text-green-600">Customer Name & ID:</span> {submission.customername}, {submission.customerid}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="text-green-600">Customer Mail & Number:</span> {submission.customermail}, {submission.customernumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">VISA Details:</span> {submission.visa}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">PASSPORT Details:</span> {submission.passport}
                        </p>
                      
                      </div>
                 
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">Submitted Date:</span> {formatDate(submission.submissiondate)}
                        </p>
                        {submission.collectiondate && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-green-600">Collection Date:</span> {formatDate(submission.collectiondate)}
                          </p>
                        )}

<p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">TRAVEL INSURANCE Details:</span> {submission.travelinsurance}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">BUS TICKET Details:</span> {submission.busticket}
                        </p>
                      </div>
                    </div>
                  
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                      Created: {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-3">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Delete Submission</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this submission? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => confirmDeleteSubmission(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDeleteSubmission(true)}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Others;
