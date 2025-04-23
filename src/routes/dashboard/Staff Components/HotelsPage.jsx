import React, { useState, useEffect,useRef } from "react";
import axios from "axios";



const HotelsPage = () => {
  // State for form fields - using exact backend field names (all lowercase)
  const [formData, setFormData] = useState({
    bookingid: "",
    hotelname: "",
    customername: "",
    customernumber: "", 
    customermail: "",
    noofnights: "",
    checkindate: "",
    checkoutdate: "",
    hcn: "",
    hotelcontactperson: ""
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const empId = localStorage.getItem('userEmpid');
  // State for recent bookings
  const [recentBookings, setRecentBookings] = useState([]);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    message: null,
    type: 'success',
    duration: 5000
  });
  


  // Load recent bookings from localStorage
  useEffect(() => {
    const savedBookings = localStorage.getItem("hotelBookings");
    if (savedBookings) {
      setRecentBookings(JSON.parse(savedBookings));
    }
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date input click
  const handleDateClick = (fieldName) => {
    document.getElementById(fieldName).showPicker();
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.bookingid.trim()) newErrors.bookingid = "Booking ID is required";
    if (!formData.hotelname.trim()) newErrors.hotelname = "Hotel Name is required";
    if (!formData.customername.trim()) newErrors.customername = "Customer Name is required";
    
    // Customer number validation
    if (!formData.customernumber.trim()) {
      newErrors.customernumber = "Customer Number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.customernumber)) {
      newErrors.customernumber = "Please enter a valid 10-15 digit phone number";
    }
    
    // Email validation
    if (!formData.customermail.trim()) {
      newErrors.customermail = "Customer Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customermail)) {
      newErrors.customermail = "Please enter a valid email address";
    }
    
    if (!formData.noofnights) newErrors.noofnights = "Number of Nights is required";
    if (!formData.checkindate) newErrors.checkindate = "Check-in Date is required";
    if (!formData.checkoutdate) newErrors.checkoutdate = "Check-out Date is required";
    // if (!formData.hcn.trim()) newErrors.hcn = "HCN is required";
    if (!formData.hotelcontactperson.trim()) newErrors.hotelcontactperson = "Hotel Contact Person is required";

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
        

        // Prepare the data for API - matching backend field names exactly
        const bookingData = {
          bookingid: formData.bookingid,
          hotelname: formData.hotelname,
          customername: formData.customername,
          customernumber: formData.customernumber, // Added customer number
          customermail: formData.customermail,
          noofnights: parseInt(formData.noofnights),
          checkindate: formData.checkindate,
          checkoutdate: formData.checkoutdate,
          hcn: formData.hcn,
          hotelcontactperson: formData.hotelcontactperson
        };

        console.log("Sending data to backend:", bookingData);

        // Send data to the API with proper headers
        const response = await axios.post(
          `${API_BASE_URL}/staff/AddHotelDetails`,
          bookingData,
          {
            headers: {
              "Content-Type": "application/json",
             
            }
          }
        );

        console.log("API Response:", response.data);

        // Save to recent bookings
        const newBooking = {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };

        const updatedBookings = [newBooking, ...recentBookings].slice(0, 5);
        setRecentBookings(updatedBookings);
        localStorage.setItem("hotelBookings", JSON.stringify(updatedBookings));

        // Reset form
        setFormData({
          bookingid: "",
          hotelname: "",
          customername: "",
          customernumber: "",
          customermail: "",
          noofnights: "",
          checkindate: "",
          checkoutdate: "",
          hcn: "",
          hotelcontactperson: "",
        });

      } catch (error) {
        console.error("Error submitting form:", error);
        if (error.response) {
          console.error("Backend response error:", error.response.data);
          alert(`Error: ${error.response.data.message || "Failed to submit data"}`);
        } else {
          alert("Failed to connect to server. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Fill form with recent booking
  const useRecentBooking = (booking) => {
    setFormData({
      bookingid: booking.bookingid,
      hotelname: booking.hotelname,
      customername: booking.customername,
      customernumber: booking.customernumber,
      customermail: booking.customermail,
      noofnights: booking.noofnights,
      checkindate: booking.checkindate,
      checkoutdate: booking.checkoutdate,
      hcn: booking.hcn,
      hotelcontactperson: booking.hotelcontactperson
    });
  };

  // Handle delete booking
  const handleDeleteBooking = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteBooking = (confirmed) => {
    setShowDeleteConfirmation(false);
    
    if (confirmed) {
      const updatedBookings = recentBookings.filter(booking => booking.id !== bookingToDelete);
      setRecentBookings(updatedBookings);
      localStorage.setItem("hotelBookings", JSON.stringify(updatedBookings));
    }
    
    setBookingToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
     
      <div className="max-w-4xl mx-auto">
        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-green-600">Hotel Booking Details</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please fill in all the required details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking ID */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Booking ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bookingid"
                value={formData.bookingid}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.bookingid 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter Booking ID"
              />
              {errors.bookingid && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.bookingid}
                </p>
              )}
            </div>

            {/* Hotel Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hotel Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hotelname"
                value={formData.hotelname}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.hotelname 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter Hotel Name"
              />
              {errors.hotelname && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.hotelname}
                </p>
              )}
            </div>

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

            {/* Customer Number */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customernumber"
                value={formData.customernumber}
                maxLength={15}
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

            {/* No. of Nights */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                No. of Nights <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="noofnights"
                value={formData.noofnights}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.noofnights 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter Number of Nights"
              />
              {errors.noofnights && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.noofnights}
                </p>
              )}
            </div>

            {/* Check-in Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Check-in Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="checkindate"
                  name="checkindate"
                  value={formData.checkindate}
                  onChange={handleChange}
                  // min={today}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                    errors.checkindate 
                      ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                      : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                <div 
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => handleDateClick("checkindate")}
                ></div>
                {formData.checkindate && (
                  <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none">
                    {formatDate(formData.checkindate)}
                  </div>
                )}
              </div>
              {errors.checkindate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.checkindate}
                </p>
              )}
            </div>

            {/* Check-out Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Check-out Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="checkoutdate"
                  name="checkoutdate"
                  value={formData.checkoutdate}
                  onChange={handleChange}
                  // min={today}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                    errors.checkoutdate 
                      ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                      : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                <div 
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => handleDateClick("checkoutdate")}
                ></div>
                {formData.checkoutdate && (
                  <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none">
                    {formatDate(formData.checkoutdate)}
                  </div>
                )}
              </div>
              {errors.checkoutdate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.checkoutdate}
                </p>
              )}
            </div>

            {/* HCN */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                HCN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hcn"
                value={formData.hcn}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.hcn 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter HCN"
              />
              {errors.hcn && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.hcn}
                </p>
              )}
            </div>

            {/* Hotel Contact Person */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hotel Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hotelcontactperson"
                value={formData.hotelcontactperson}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.hotelcontactperson 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter Contact Person's Name"
              />
              {errors.hotelcontactperson && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.hotelcontactperson}
                </p>
              )}
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
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Confirm</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to submit this hotel booking? Please verify all details before confirmation.
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

        {/* Recent Bookings Card */}
        {recentBookings.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-green-600 mb-6">Recent Bookings</h3>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition relative"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBooking(booking.id);
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div 
                    className="cursor-pointer"
                    onClick={() => useRecentBooking(booking)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          <span className="text-green-600">Booking ID:</span> {booking.bookingid}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">Hotel Name:</span> {booking.hotelname}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">Customer Name:</span> {booking.customername}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">Phone No:</span> {booking.customernumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">HCN:</span> {booking.hcn}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-green-600">Hotel Contact Person:</span> {booking.hotelcontactperson}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-green-600">Check-in:</span> {formatDate(booking.checkindate)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-green-600">Check-out:</span> {formatDate(booking.checkoutdate)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                      Created: {formatDate(booking.createdAt)}
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Delete Booking</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => confirmDeleteBooking(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDeleteBooking(true)}
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

export default HotelsPage;