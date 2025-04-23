// src/components/RemindingCustomerPage.jsx
import React, { useState, useEffect } from "react";
import { FaTrash, FaPlane, FaHotel, FaBell, FaHistory } from "react-icons/fa";
import { 
  getFlightReminders, 
  getHotelReminders 
} from "../Api/reminderApi";

const RemindingCustomerPage = () => {
  // State management
  const [flightCustomers, setFlightCustomers] = useState([]);
  const [hotelCustomers, setHotelCustomers] = useState([]);
  const [recentlyNotified, setRecentlyNotified] = useState(() => {
    const saved = localStorage.getItem("recentlyNotified");
    return saved ? JSON.parse(saved) : [];
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Persist recentlyNotified to localStorage
  useEffect(() => {
    localStorage.setItem("recentlyNotified", JSON.stringify(recentlyNotified));
  }, [recentlyNotified]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [flightData, hotelData] = await Promise.all([
          getFlightReminders(),
          getHotelReminders()
        ]);

        const transformedFlight = transformCustomerData(flightData, "Flight");
        const transformedHotel = transformCustomerData(
          hotelData, 
          "Hotel", 
          transformedFlight.length + 1
        );

        const notifiedIds = new Set(recentlyNotified.map(c => c.id));
        
        setFlightCustomers(transformedFlight.filter(c => !notifiedIds.has(c.id)));
        setHotelCustomers(transformedHotel.filter(c => !notifiedIds.has(c.id)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  // Handle notification confirmation
  const handleNotifyClick = (customer) => {
    setSelectedCustomer(customer);
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed && selectedCustomer) {
      const customerWithTimestamp = {
        ...selectedCustomer,
        notifiedAt: new Date().toISOString()
      };
      
      setRecentlyNotified(prev => [customerWithTimestamp, ...prev]);
      
      // Remove from original list
      if (selectedCustomer.booking === "Flight") {
        setFlightCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
      } else {
        setHotelCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
      }
    }
    setShowConfirmation(false);
  };

  // Handle deletion of notified customers
  const handleRemoveNotified = (index) => {
    setCustomerToDelete(index);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = (confirmed) => {
    if (confirmed && customerToDelete !== null) {
      setRecentlyNotified(prev => {
        const updated = [...prev];
        updated.splice(customerToDelete, 1);
        return updated;
      });
    }
    setShowDeleteConfirmation(false);
    setCustomerToDelete(null);
  };

  const clearAllNotified = () => {
    if (recentlyNotified.length > 0 && 
        window.confirm("Are you sure you want to clear all recently notified customers?")) {
      setRecentlyNotified([]);
    }
  };

  // Utility function to transform customer data
  const transformCustomerData = (data, type, startId = 1) => {
    return data.map((customer, index) => ({
      id: startId + index,
      name: customer.customername,
      email: customer.customermail,
      number: customer.customernumber,
      booking: type,
      date: type === "Flight" ? customer.traveldate : customer.checkindate,
      notified: false,
    }));
  };

  // Loading state with better UI
  if (loading) {
    return (
      <div className="min-h-screen p-6 max-w-6xl mx-auto flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-green-500 rounded-full mb-4 flex items-center justify-center">
            <FaBell className="text-white text-2xl" />
          </div>
          <div className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            Loading Customer Data
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            Please wait while we fetch your reminders...
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6 max-w-md">
            <div className="bg-green-600 h-2.5 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with better UI
  if (error) {
    return (
      <div className="min-h-screen p-6 max-w-6xl mx-auto flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full mb-4 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen p-4 md:p-6 max-w-6xl mx-auto">
      <div className="dark:bg-gray-900 dark:text-white bg-white p-4 md:p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <FaBell className="text-green-600 dark:text-green-400 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Customers to Notify for Tomorrow 
          </h2>
        </div>

        {/* Flight Customers Table */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaPlane className="text-blue-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Flight Reminders
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 ml-2">
              {flightCustomers.length}
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="dark:bg-gray-800 bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold">#</th>
                  <th className="p-3 text-left text-sm font-semibold">Name</th>
                  <th className="p-3 text-left text-sm font-semibold">Email</th>
                  <th className="p-3 text-left text-sm font-semibold">Phone</th>
                  <th className="p-3 text-left text-sm font-semibold">Travel Date</th>
                  <th className="p-3 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {flightCustomers.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3 text-sm whitespace-nowrap">{index + 1}</td>
                    <td className="p-3 font-medium text-sm whitespace-nowrap">{customer.name}</td>
                    <td className="p-3 text-sm whitespace-nowrap">{customer.email}</td>
                    <td className="p-3 text-sm whitespace-nowrap">{customer.number}</td>
                    <td className="p-3 text-sm whitespace-nowrap">{customer.date}</td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => handleNotifyClick(customer)}
                        className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded-md transition-colors flex items-center gap-1.5 text-sm"
                      >
                        <FaBell className="text-xs" />
                        Notify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {flightCustomers.length === 0 && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30">
                No flight reminders found for tomorrow
              </div>
            )}
          </div>
        </div>

        {/* Hotel Customers Table */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaHotel className="text-purple-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Hotel Reminders
            </h3>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300 ml-2">
              {hotelCustomers.length}
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="dark:bg-gray-800 bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold">#</th>
                  <th className="p-3 text-left text-sm font-semibold">Name</th>
                  <th className="p-3 text-left text-sm font-semibold">Email</th>
                  <th className="p-3 text-left text-sm font-semibold">Phone</th>
                  <th className="p-3 text-left text-sm font-semibold">Check-in Date</th>
                  <th className="p-3 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {hotelCustomers.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3 text-sm whitespace-nowrap">{index + 1}</td>
                    <td className="p-3 font-medium text-sm whitespace-nowrap">{customer.name}</td>
                    <td className="p-3 text-sm whitespace-nowrap">{customer.email}</td>
                    <td className="p-3 text-sm whitespace-nowrap">{customer.number}</td>
                    <td className="p-3 text-sm whitespace-nowrap">{customer.date}</td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => handleNotifyClick(customer)}
                        className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded-md transition-colors flex items-center gap-1.5 text-sm"
                      >
                        <FaBell className="text-xs" />
                        Notify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hotelCustomers.length === 0 && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30">
                No hotel reminders found for tomorrow
              </div>
            )}
          </div>
        </div>

        {/* Recently Notified Customers */}
        {recentlyNotified.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FaHistory className="text-gray-500 dark:text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Recently Notified Customers
                </h3>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 ml-2">
                  {recentlyNotified.length}
                </span>
              </div>
              <button
                onClick={clearAllNotified}
                className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-4 rounded-md transition-colors text-sm flex items-center gap-1.5"
              >
                <FaTrash className="text-xs" />
                Clear All
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full">
                <thead className="dark:bg-gray-800 bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold">#</th>
                    <th className="p-3 text-left text-sm font-semibold">Name</th>
                    <th className="p-3 text-left text-sm font-semibold">Email</th>
                    <th className="p-3 text-left text-sm font-semibold">Phone</th>
                    <th className="p-3 text-left text-sm font-semibold">Booking</th>
                    <th className="p-3 text-left text-sm font-semibold">Date</th>
                    <th className="p-3 text-left text-sm font-semibold">Notified At</th>
                    <th className="p-3 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentlyNotified.map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3 text-sm whitespace-nowrap">{index + 1}</td>
                      <td className="p-3 font-medium text-sm whitespace-nowrap">{customer.name}</td>
                      <td className="p-3 text-sm whitespace-nowrap">{customer.email}</td>
                      <td className="p-3 text-sm whitespace-nowrap">{customer.number}</td>
                      <td className="p-3 text-sm whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.booking === "Flight" 
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        }`}>
                          {customer.booking}
                        </span>
                      </td>
                      <td className="p-3 text-sm whitespace-nowrap">{customer.date}</td>
                      <td className="p-3 text-sm whitespace-nowrap">
                        {customer.notifiedAt ? new Date(customer.notifiedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveNotified(index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Confirmation Modals */}
        {showConfirmation && (
          <ConfirmationModal
            title={`Notify ${selectedCustomer?.name}?`}
            message="Are you sure you want to send a reminder to this customer?"
            onConfirm={() => handleConfirmation(true)}
            onCancel={() => handleConfirmation(false)}
            icon={<FaBell className="text-green-500 text-2xl" />}
          />
        )}

        {showDeleteConfirmation && (
          <ConfirmationModal
            title="Delete Notification Record"
            message="Are you sure you want to delete this entry? This action cannot be undone."
            onConfirm={() => confirmDelete(true)}
            onCancel={() => confirmDelete(false)}
            confirmText="Delete"
            confirmColor="red"
            icon={<FaTrash className="text-red-500 text-2xl" />}
          />
        )}
      </div>
    </div>
  );
};

// Enhanced Confirmation Modal Component
const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "green",
  icon
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
      <div className="flex flex-col items-center text-center">
        {icon && <div className="mb-4">{icon}</div>}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex justify-center space-x-4 w-full">
          <button 
            onClick={onCancel} 
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-6 py-2 rounded-md transition-colors flex-1"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`bg-${confirmColor}-600 hover:bg-${confirmColor}-700 text-white px-6 py-2 rounded-md transition-colors flex-1`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default RemindingCustomerPage;