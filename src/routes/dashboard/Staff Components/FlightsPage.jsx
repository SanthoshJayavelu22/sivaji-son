import { useState, useEffect,useRef } from "react";
import axios from "axios";

import CreatableSelect from 'react-select/creatable';

const FlightsPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    customerId: "",
    ticketNumber: "", 
    customerMail: "",
    customerName: "",
    customerNumber: "",
    passengerNames: [""], 
    issueDate: "",
    // travelDate: "",
    pnr: "",
    issuedStaffDetails: "",
    airlines: [{
      airline: "",
      flightNumber: "",
      departureAirport: "",
      arrivalAirport: "",
      departureTime: "",
      arrivalTime: "",
      travelClass: "Economy",
      baggageAllowance: ""
    }]
  });

  const API_BASE_URL = "http://192.168.1.9:8080";
  const empId = localStorage.getItem('userEmpid');
  // State for recent bookings
  const [recentBookings, setRecentBookings] = useState([]);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [airlines, setAirlines] = useState([]);
const [loadingAirlines, setLoadingAirlines] = useState(false);
const airlineOptions = airlines;
  // Add these states for task monitoring
  const [tasks, setTasks] = useState([]);
  const prevTasksRef = useRef([]);
    // State for airport options
    const [departureAirports, setDepartureAirports] = useState([]);
    const [arrivalAirports, setArrivalAirports] = useState([]);
    const [loadingAirports, setLoadingAirports] = useState({
      departure: false,
      arrival: false
    });
    
    const [notification, setNotification] = useState({
      message: null,
      type: 'success',
      duration: 5000
    });

    const addPassenger = () => {
      setFormData(prev => ({
        ...prev,
        passengerNames: [...prev.passengerNames, ""]
      }));
    };
    
    const removePassenger = (index) => {
      if (formData.passengerNames.length <= 1) return;
      
      setFormData(prev => ({
        ...prev,
        passengerNames: prev.passengerNames.filter((_, i) => i !== index)
      }));
    };
    
    const handlePassengerNameChange = (index, value) => {
      setFormData(prev => {
        const newPassengerNames = [...prev.passengerNames];
        newPassengerNames[index] = value;
        
        return {
          ...prev,
          passengerNames: newPassengerNames
        };
      });
    };

     // Function to check for new tasks
  const checkForNewTasks = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) return;
      
      const response = await axios.get(
        `${API_BASE_URL}/staff/ViewTask/${empId}`,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && Array.isArray(response.data)) {
        const apiTasks = response.data.map((task, index) => ({
          id: task.taskId || index,
          name: task.taskName || task.task || "Unnamed Task",
          status: task.status || "pending",
          ...task
        }));

        // Check for new tasks only after initial load
        if (prevTasksRef.current.length > 0 && apiTasks.length > prevTasksRef.current.length) {
          const newTasks = apiTasks.filter(newTask => 
            !prevTasksRef.current.some(oldTask => oldTask.id === newTask.id)
          );
          
          if (newTasks.length > 0) {
            setNotification({
              message: `New task assigned: "${newTasks[0].name}"`,
              type: 'success',
              duration: 6000
            });
          }
        }

        setTasks(apiTasks);
        prevTasksRef.current = apiTasks;
      }
    } catch (err) {
      console.error("Error checking tasks:", err);
    }
  };

    // Add this useEffect for task polling
    useEffect(() => {
      // Initial check
      checkForNewTasks();
      
      // Set up polling every 5 seconds for new tasks
      const taskInterval = setInterval(checkForNewTasks, 5000);
      
      return () => clearInterval(taskInterval);
    }, [empId]);
  
    // Fetch airport codes
    useEffect(() => {
      const fetchAirports = async () => {
        try {
          setLoadingAirports(prev => ({...prev, departure: true, arrival: true}));
          const response = await axios.get(`${API_BASE_URL}/staff/GetAirportCode`);
          
          const formattedAirports = response.data.map(airport => ({
            value: airport.airportcode,
            label: airport.airportcode
          }));
  
          setDepartureAirports(formattedAirports);
          setArrivalAirports(formattedAirports);
        } catch (error) {
          console.error("Error fetching airports:", error);
          // Fallback to hardcoded airports
         
         
          setArrivalAirports(fallbackAirports);
        } finally {
          setLoadingAirports({ departure: false, arrival: false });
        }
      };
  
      fetchAirports();
    }, []);

// Fetch airline data
useEffect(() => {
  const fetchAirlines = async () => {
    try {
      setLoadingAirlines(true);
      const response = await axios.get(`${API_BASE_URL}/staff/GetAirline`);
      
      const formattedAirlines = response.data.map(airline => ({
        value: airline.airline,
        label: airline.airline
      }));

      setAirlines(formattedAirlines);
    } catch (error) {
      console.error("Error fetching airlines:", error);
      // Fallback to hardcoded airlines
    
     
    } finally {
      setLoadingAirlines(false);
    }
  };

  fetchAirlines();
}, []);
  
  // Load recent bookings from localStorage
  useEffect(() => {
    const savedBookings = localStorage.getItem("flightBookings");
    if (savedBookings) {
      setRecentBookings(JSON.parse(savedBookings));
    }
  }, []);


  const addAirline = () => {
    if (formData.airlines.length >= 8) return;
    
    setFormData(prev => ({
      ...prev,
      airlines: [
        ...prev.airlines,
        {
          airline: "",
          ticketNumber: "",
          flightNumber: "",
          departureAirport: "",
          arrivalAirport: "",
          departureTime: "",
          arrivalTime: "",
          travelClass: "Economy",
          baggageAllowance: ""
        }
      ]
    }));
  };
  
  const removeAirline = (index) => {
    if (formData.airlines.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      airlines: prev.airlines.filter((_, i) => i !== index)
    }));
  };
  
  const handleAirlineChange = (index, e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newAirlines = [...prev.airlines];
      newAirlines[index] = {
        ...newAirlines[index],
        [name]: value
      };
      
      return {
        ...prev,
        airlines: newAirlines
      };
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
      if (name === 'customerId') {
        newData.customerNumber = value;
      }
      // If customerNumber is changed, update customerId
      else if (name === 'customerNumber') {
        newData.customerId = value;
      }
      
      return newData;
    });
  };

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

  // Handle date input click
  const handleDateClick = (fieldName) => {
    document.getElementById(fieldName).showPicker();
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Customer fields validation
    if (!formData.customerName.trim()) newErrors.customerName = "Customer Name is required";
    if (!formData.customerMail.trim()) newErrors.customerMail = "Customer Email is required";
    if (!formData.customerNumber.trim()) newErrors.customerNumber = "Customer Number is required";
    if (!formData.customerId.trim()) newErrors.customerId = "Customer ID is required";
  //   if (!formData.passengerName.trim()) newErrors.passengerName = "Passenger Name is required";
  //       //  Passenger names validation
  // if (!formData.passengerNames || formData.passengerNames.length === 0) {
  //   newErrors.passengerNames = "At least one passenger name is required";
  // } else {
  //   const passengerErrors = [];
  //   formData.passengerNames.forEach((name, index) => {
  //     if (!name.trim()) {
  //       passengerErrors[index] = "Passenger name is required";
  //     }
  //   });
    
  //   if (passengerErrors.length > 0) {
  //     newErrors.passengerNames = passengerErrors;
  //   }
  // }
    if (!formData.issueDate) newErrors.issueDate = "Issue Date is required";
    // if (!formData.travelDate) newErrors.travelDate = "Travel Date is required";
    if (!formData.pnr.trim()) newErrors.pnr = "PNR is required";
    if (!formData.issuedStaffDetails.trim()) newErrors.issuedStaffDetails = "Issued Staff Details are required";
  
    // Validate each airline
    formData.airlines.forEach((airline, index) => {
      if (!airline.airline?.trim()) newErrors[`airline-${index}`] = "Airline is required";
      if (!airline.ticketNumber?.trim()) newErrors[`ticketNumber-${index}`] = "Ticket Number is required";
      if (!airline.flightNumber?.trim()) newErrors[`flightNumber-${index}`] = "Flight Number is required";
      if (!airline.departureAirport?.trim()) newErrors[`departureAirport-${index}`] = "Departure Airport is required";
      if (!airline.arrivalAirport?.trim()) newErrors[`arrivalAirport-${index}`] = "Arrival Airport is required";
      if (!airline.departureTime?.trim()) newErrors[`departureTime-${index}`] = "Departure Time is required";
      if (!airline.arrivalTime?.trim()) newErrors[`arrivalTime-${index}`] = "Arrival Time is required";
      if (!airline.baggageAllowance?.trim()) newErrors[`baggageAllowance-${index}`] = "Baggage Allowance is required";
      if (!airline.travelClass?.trim()) newErrors[`travelClass-${index}`] = "Travel Class is required";
    });


  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // API call to submit flight details using Axios
  const submitFlightDetails = async (bookingData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/staff/AddFlightDetails`,
        {
          customername: bookingData.customerName,
          customernumber: bookingData.customerNumber,
          customermail: bookingData.customerMail,
          cutomerid: bookingData.customerId,
          passengername: bookingData.passengerNames.map(passengername => ({ passengername })),
          issuedate: bookingData.issueDate,
          pnr: bookingData.pnr,
          issuedstaffdetails: bookingData.issuedStaffDetails,
          airlines: bookingData.airlines.map(airline => ({
            airline: airline.airline,
            ticketnumber: airline.ticketNumber,
            flightnumber: airline.flightNumber,
            departureairport: airline.departureAirport,
            arrivalairport: airline.arrivalAirport,
            departuretime: airline.departureTime,
            arrivaltime: airline.arrivalTime,
            travelclass: airline.travelClass,
            baggageallowance: airline.baggageAllowance
          }))
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error submitting flight details:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form before showing confirmation
    const isValid = validateForm();
    
    if (!isValid) {
      setIsSubmitting(false);
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(`[name="${firstErrorKey.split('-')[0]}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return; // Exit if not valid
    }
    
    setShowConfirmation(true);
    setIsSubmitting(false);
  };

// Handle confirmation

const handleConfirmation = async (confirmed) => {
  setShowConfirmation(false);
  
  if (confirmed) {
    setIsSubmitting(true);
    
    try {
      // Submit to API
      const response = await submitFlightDetails(formData);
      console.log('API Response:', response); // Log the response
      
      // Save to recent bookings
      const newBooking = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      const updatedBookings = [newBooking, ...recentBookings].slice(0, 5);
      setRecentBookings(updatedBookings);
      localStorage.setItem("flightBookings", JSON.stringify(updatedBookings));
      
      // Show success notification
      setNotification({
        message: "Flight booking submitted successfully!",
        type: 'success',
        duration: 5000
      });
      
      // Reset form
      setFormData({
        customerId: "",
        ticketNumber: "", 
        customerMail: "",
        customerName: "",
        customerNumber: "",
        passengerNames: [],
        issueDate: "",
        // travelDate: "",
        pnr: "",
        issuedStaffDetails: "",
        airlines: [{
          airline: "",
          flightNumber: "",
          ticketNumber: "",
          departureAirport: "",
          arrivalAirport: "",
          departureTime: "",
          arrivalTime: "",
          travelClass: "Economy",
          baggageAllowance: ""
        }]
      });
    } catch (error) {
      console.error("Submission failed:", error);
      setNotification({
        message: error.response?.data?.message || "Failed to submit flight details",
        type: 'error',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  }
};

  // Fill form with recent booking
  const useRecentBooking = (booking) => {
    setFormData({
      customerName: booking.customerName || "",
      ticketNumber: booking.ticketNumber || "",
      customerNumber: booking.customerNumber || "",
      customerMail: booking.customerMail || "",
      customerId: booking.customerId,
      passengerNames: booking.passengerNames || [""], // Updated to handle array
      issueDate: booking.issueDate,
      // travelDate: booking.travelDate,
      pnr: booking.pnr,
      issuedStaffDetails: booking.issuedStaffDetails,
      airlines: booking.airlines || [{
        airline: "",
        flightNumber: "",
        ticketNumber: "",
        departureAirport: "",
        arrivalAirport: "",
        departureTime: "",
        arrivalTime: "",
        travelClass: "Economy",
        baggageAllowance: ""
      }]
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
      localStorage.setItem("flightBookings", JSON.stringify(updatedBookings));
    }
    
    setBookingToDelete(null);
  };

   // Departure Airport Select Component
   const DepartureAirportSelect = ({ index, value, error }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Departure Airport <span className="text-red-500">*</span>
      </label>
      <CreatableSelect
        options={departureAirports}
        isLoading={loadingAirports.departure}
        value={value ? { 
          value: value, 
          label: departureAirports.find(opt => opt.value === value)?.label || value
        } : null}
        onChange={(selectedOption) => {
          handleAirlineChange(index, {
            target: {
              name: 'departureAirport',
              value: selectedOption ? selectedOption.value : ''
            }
          });
        }}
        placeholder={loadingAirports.departure ? "Loading..." : "Select departure airport"}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  const ArrivalAirportSelect = ({ index, value, error }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Arrival Airport <span className="text-red-500">*</span>
      </label>
      <CreatableSelect
        options={arrivalAirports}
        isLoading={loadingAirports.arrival}
        value={value ? { 
          value: value, 
          label: arrivalAirports.find(opt => opt.value === value)?.label || value
        } : null}
        onChange={(selectedOption) => {
          handleAirlineChange(index, {
            target: {
              name: 'arrivalAirport',
              value: selectedOption ? selectedOption.value : ''
            }
          });
        }}
        placeholder={loadingAirports.arrival ? "Loading..." : "Select arrival airport"}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      


      <div className="max-w-5xl mx-auto">
        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-green-600">Flight Ticket Booking</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please fill in all the required details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer ID */}
                        <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerId"
                maxLength={15}
                value={formData.customerId}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.customerId 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="CUST-12345"
              />
              {errors.customerId && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customerId}
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
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.customerName 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="John Doe"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customerName}
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
                name="customerMail"
              
                value={formData.customerMail}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.customerMail 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="john@example.com"
              />
              {errors.customerMail && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customerMail}
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
                name="customerNumber"
                maxLength={15}
                value={formData.customerNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.customerNumber 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="+1234567890"
              />
              {errors.customerNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.customerNumber}
                </p>
              )}
            </div>



  

      
     {/* Passenger Names Section */}
<div className=" space-y-2">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Passenger Names <span className="text-red-500">*</span>
  </label>
  
  {formData.passengerNames.map((name, index) => (
    <div key={index} className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => handlePassengerNameChange(index, e.target.value)}
        className={`flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
          errors.passengerNames?.[index] 
            ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
            : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        placeholder={`Passenger ${index + 1} Name`}
      />
      
      {formData.passengerNames.length > 1 && (
        <button
          type="button"
          onClick={() => removePassenger(index)}
          className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  ))}
  
  <button
    type="button"
    onClick={addPassenger}
    className="mt-2 px-3 py-1 text-sm rounded-md bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
  >
    + Add Passenger
  </button>
  
  {errors.passengerNames && typeof errors.passengerNames === 'string' && (
    <p className="text-red-500 text-sm mt-1 flex items-center">
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {errors.passengerNames}
    </p>
  )}
</div>

            {/* Issue Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                    errors.issueDate 
                      ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                      : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                <div 
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => handleDateClick("issueDate")}
                ></div>
                {formData.issueDate && (
                  <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none">
                    {formatDate(formData.issueDate)}
                  </div>
                )}
              </div>
              {errors.issueDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.issueDate}
                </p>
              )}
            </div>

            {/* Travel Date */}
            {/* <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Travel Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                    errors.travelDate 
                      ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                      : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                <div 
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => handleDateClick("travelDate")}
                ></div>
                {formData.travelDate && (
                  <div className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none">
                    {formatDate(formData.travelDate)}
                  </div>
                )}
              </div>
              {errors.travelDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.travelDate}
                </p>
              )}
            </div> */}



            {/* PNR */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                PNR <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pnr"
                value={formData.pnr}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.pnr 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="PNR12345"
              />
              {errors.pnr && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.pnr}
                </p>
              )}
            </div>


              {/* Issued Staff Details */}
    <div className=" space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Issued Staff Name <span className="text-red-500">*</span>
              </label>
              <input
                name="issuedStaffDetails"
                value={formData.issuedStaffDetails}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                  errors.issuedStaffDetails 
                    ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                    : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                rows="3"
                placeholder="Staff name"
              />
              {errors.issuedStaffDetails && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.issuedStaffDetails}
                </p>
              )}
            </div>

        

            {/* Airlines Section */}
<div className="md:col-span-2">


  <div className="space-y-6">
    {formData.airlines.map((airline, index) => (
      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative">
        {formData.airlines.length > 1 && (
          <button
            type="button"
            onClick={() => removeAirline(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
          Flight {index + 1}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  

          {/* Ticket Number Field */}
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Ticket Number <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    name="ticketNumber"
    value={airline.ticketNumber}
    onChange={(e) => handleAirlineChange(index, e)}
    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
      errors[`airline-${index}`] 
        ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
        : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
    placeholder="Ticket number"
  />
  {errors.ticketNumber && (
    <p className="text-red-500 text-sm mt-1">{errors.ticketNumber}</p>
  )}
</div>

          {/* Flight Number */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Flight Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="flightNumber"
              value={airline.flightNumber}
              onChange={(e) => handleAirlineChange(index, e)}
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                errors[`flightNumber-${index}`] 
                  ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
                  : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="UA123"
            />
            {errors[`flightNumber-${index}`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`flightNumber-${index}`]}</p>
            )}
          </div>

<div className="space-y-1">
       
        {/* Departure Airport */}
        <DepartureAirportSelect
          index={index}
          value={airline.departureAirport}
          error={errors[`departureAirport-${index}`]}
        />
        
      
      </div>


      <div className="space-y-1">
       
     
        {/* Arrival Airport */}
        <ArrivalAirportSelect
          index={index}
          value={airline.arrivalAirport}
          error={errors[`arrivalAirport-${index}`]}
        />
        
        {/* Other fields... */}
      </div>

        
      
      {/* Departure Date & Time */}
{/* Departure Date & Time */}
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Departure Date & Time <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <input
      type="datetime-local"
      id={`departureTime-${index}`}
      name="departureTime"
      value={airline.departureTime}
      onChange={(e) => handleAirlineChange(index, e)}
      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
        errors[`departureTime-${index}`] 
          ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
          : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer`}
    />
    <div 
      className="absolute inset-0 cursor-pointer"
      onClick={() => document.getElementById(`departureTime-${index}`).showPicker()}
    ></div>
    {/* {airline.departureTime && (
      <div className="absolute right-3 top-2 text-gray-500 dark:text-gray-400 pointer-events-none">
        {formatDateTime(airline.departureTime)}
      </div>
    )} */}
  </div>
  {errors[`departureTime-${index}`] && (
    <p className="text-red-500 text-sm mt-1">{errors[`departureTime-${index}`]}</p>
  )}
</div>

{/* Arrival Date & Time */}

<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Arrival Date & Time <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <input
      type="datetime-local"
      id={`arrivalTime-${index}`}
      name="arrivalTime"
      value={airline.arrivalTime}
      onChange={(e) => handleAirlineChange(index, e)}
      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
        errors[`arrivalTime-${index}`] 
          ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
          : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer`}
    />
    <div 
      className="absolute inset-0 cursor-pointer"
      onClick={() => document.getElementById(`arrivalTime-${index}`).showPicker()}
    ></div>
    {/* {airline.arrivalTime && (
      <div className="absolute right-3 top-2 text-gray-500 dark:text-gray-400 pointer-events-none">
        {formatDateTime(airline.arrivalTime)}
      </div>
    )} */}
  </div>
  {errors[`arrivalTime-${index}`] && (
    <p className="text-red-500 text-sm mt-1">{errors[`arrivalTime-${index}`]}</p>
  )}
</div>


               

{/* Airline Dropdown */}
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Airline <span className="text-red-500">*</span>
  </label>
  <CreatableSelect
    options={airlineOptions}
    isLoading={loadingAirlines}
    value={airline.airline ? { 
      value: airline.airline, 
      label: airline.airline 
    } : null}
    onChange={(selectedOption) => {
      handleAirlineChange(index, {
        target: {
          name: 'airline',
          value: selectedOption ? selectedOption.value : ''
        }
      });
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && e.target.value && !airlineOptions.some(opt => opt.value === e.target.value)) {
        handleAirlineChange(index, {
          target: {
            name: 'airline',
            value: e.target.value
          }
        });
      }
    }}
    placeholder={loadingAirlines ? "Loading airlines..." : "Search or type a custom airline..."}
    formatCreateLabel={(inputValue) => `Use custom: "${inputValue}"`}
    noOptionsMessage={({ inputValue }) => 
      inputValue ? `Press Enter to use "${inputValue}"` : 'No options available'
    }
    isValidNewOption={(inputValue) => 
      inputValue.trim() !== '' && 
      !airlineOptions.some(opt => opt.value.toLowerCase() === inputValue.toLowerCase())
    }
    createOptionPosition="first"
    className="react-select-container"
    classNamePrefix="react-select"
  />
  {errors[`airline-${index}`] && (
    <p className="text-red-500 text-sm mt-1">{errors[`airline-${index}`]}</p>
  )}
</div>

          {/* Travel Class */}
          <div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Travel Class <span className="text-red-500">*</span>
  </label>
  <select
    name="travelClass"
    value={airline.travelClass}
    onChange={(e) => handleAirlineChange(index, e)}
    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
      errors[`travelClass-${index}`] 
        ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
        : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
  >
    <option value="">Select Travel Class</option>
    <option value="Economy">Economy</option>
    <option value="Premium Economy">Premium Economy</option>
    <option value="Business">Business</option>
    <option value="First Class">First Class</option>
  </select>
  {errors[`travelClass-${index}`] && (
    <p className="text-red-500 text-sm mt-1">{errors[`travelClass-${index}`]}</p>
  )}
</div>

          {/* Baggage Allowance */}
          <div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Baggage Allowance <span className="text-red-500">*</span>
  </label>
  <input
    name="baggageAllowance"
    value={airline.baggageAllowance}
    onChange={(e) => handleAirlineChange(index, e)}
    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
      errors[`baggageAllowance-${index}`] 
        ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-700" 
        : "border-gray-300 dark:border-gray-600 focus:border-green-600 focus:ring-green-200 dark:focus:ring-green-800"
    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
    placeholder="e.g., 15KG or 2x23kg"
  />
  {errors[`baggageAllowance-${index}`] && (
    <p className="text-red-500 text-sm mt-1">{errors[`baggageAllowance-${index}`]}</p>
  )}
</div>

          <div className="flex justify-end  mt-5">
  
    <button
      type="button"
      onClick={addAirline}
      disabled={formData.airlines.length >= 8}
      className={`px-3 py-1 text-sm rounded-md ${
        formData.airlines.length >= 8 
          ? "bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
          : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
      }`}
    >
      + Add Flight
    </button>
  </div>
        </div>
      </div>
    ))}
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
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Confirm</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to submit this flight booking? Please verify all details before confirmation.
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
               {/* In the recent bookings display */}
<p className="font-medium text-gray-900 dark:text-white">
  <span className="text-green-600">Passengers:</span> {booking.passengerNames.join(", ")}
</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-600">Customer Name & ID:</span> {booking.customerName}, (ID: {booking.customerId})
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-600">Contact Mail & No:</span> {booking.customerMail}, (Ph no: {booking.customerNumber})
                </p>
              </div>
              <div>
             
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-600">PNR:</span> {booking.pnr}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-600">Issue Date:</span> {formatDate(booking.issueDate)}
              </p>
              {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-600">Travel Date:</span> {formatDate(booking.travelDate)}
              </p> */}
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-600">Staff Name:</span> {booking.issuedStaffDetails}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Created: {formatDate(booking.createdAt)}
              </p>
            </div>

            {/* Display Airlines data */}
            {booking.airlines && booking.airlines.map((airline, idx) => (
              <div key={idx} className="mt-2 border-t pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-600">Flight {idx + 1} Flight Number & Airline:</span> {airline.flightNumber}, {airline.airline}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-600"> Ticket Number:</span> {airline.ticketNumber}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-600">Route:</span> {airline.departureAirport} → {airline.arrivalAirport}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-600">Time:</span> {airline.departureTime} - {airline.arrivalTime}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-600">Class:</span> {airline.travelClass}, <span className="text-green-600">Baggage:</span> {airline.baggageAllowance}
                </p>
              </div>
            ))}
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

export default FlightsPage;