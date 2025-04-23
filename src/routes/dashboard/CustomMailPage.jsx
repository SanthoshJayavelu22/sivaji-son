import React, { useState, useEffect } from "react";
import { customerApi, mailApi } from "../Api/customMail"; // Import the API service

const CustomMailPage = () => {
  const empId = localStorage.getItem('userEmpid');
  
  // State for mail form
  const [mailData, setMailData] = useState({
    subject: "",
    content: ""
  });
  
  // State for customer list
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomerEmails, setSelectedCustomerEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch customers from API on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers from API
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerApi.getCustomers();

      // Map the API response to include email addresses
      const mappedCustomers = data.map((customer, index) => ({
        id: customer.id,
        index: index + 1,
        name: customer.customername || "Unknown",
        email: customer.customermail || "",
        phone: customer.customernumber || "N/A"
      }));

      setCustomers(mappedCustomers);
      setFilteredCustomers(mappedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      showNotification("Failed to load customer data", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = customers.filter(customer => {
        return (
          (customer.name && customer.name.toLowerCase().includes(searchTermLower)) ||
          (customer.email && customer.email.toLowerCase().includes(searchTermLower)) ||
          (customer.phone && customer.phone.toString().includes(searchTerm))
        );
      });
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  // Handle mail form changes
  const handleMailChange = (e) => {
    const { name, value } = e.target;
    setMailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle customer selection
  const handleCustomerSelect = (customerEmail) => {
    setSelectedCustomerEmails(prev => {
      if (prev.includes(customerEmail)) {
        return prev.filter(email => email !== customerEmail);
      } else {
        return [...prev, customerEmail];
      }
    });
  };

  // Select all customers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomerEmails(filteredCustomers.map(customer => customer.email));
    } else {
      setSelectedCustomerEmails([]);
    }
  };

  // Show notification
  const showNotification = (message, type, duration = 5000) => {
    setNotification({ message, type, duration });
    setTimeout(() => setNotification(null), duration);
  };

  // Send mail to selected customers
  const handleSendMail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // Validate form inputs
      if (!mailData.subject.trim() || !mailData.content.trim()) {
        throw new Error("Subject and content are required");
      }

      if (selectedCustomerEmails.length === 0) {
        throw new Error("Please select at least one customer");
      }

      // Validate email formats
      const invalidEmails = selectedCustomerEmails.filter(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      if (invalidEmails.length > 0) {
        throw new Error(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      }

      // Prepare the request data
      const mailPayload = {
        subject: mailData.subject,
        content: mailData.content,
        toaddress: selectedCustomerEmails,
      };

      // Make the API call
      await mailApi.sendMail(mailPayload);

      showNotification(
        `Email sent to ${selectedCustomerEmails.length} customer(s)`,
        'success'
      );

      // Reset form
      setMailData({ subject: "", content: "" });
      setSelectedCustomerEmails([]);
      
    } catch (error) {
      console.error("Mail sending error:", error);
      showNotification(
        error.response?.data?.message || error.message || "Failed to send email",
        'error',
        7000
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-md shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Mail Form Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-500">Send Custom Email</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Compose your message and select recipients
            </p>
          </div>

          <form onSubmit={handleSendMail} className="space-y-6">
            {/* Subject Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={mailData.subject}
                onChange={handleMailChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Email subject"
                required
              />
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={mailData.content}
                onChange={handleMailChange}
                rows="8"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Write your email content here..."
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                  isSending
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                } min-w-[150px]`}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Email"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Customer List Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-500 mb-4 md:mb-0">Customer List</h3>
            
            {/* Search Filter */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedCustomerEmails.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-green-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      S.no
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCustomerEmails.includes(customer.email)}
                            onChange={() => handleCustomerSelect(customer.email)}
                            className="h-4 w-4 text-green-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {customer.index}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {customer.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {customer.email}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        {customers.length === 0 ? "No customers available" : "No matching customers found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {filteredCustomers.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {selectedCustomerEmails.length > 0 ? (
                <span>{selectedCustomerEmails.length} customer(s) selected</span>
              ) : (
                <span>No customers selected</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomMailPage;