import React, { useState, useEffect } from 'react';
import { fetchOtherDetails } from '../Api/other';
import { FaCopy, FaCheck, FaDownload } from 'react-icons/fa';

const OtherCustomerPage = () => {
  // State management
  const [otherDetails, setOtherDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchOtherDetails();
        setOtherDetails(data);
        setFilteredDetails(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch other bookings.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDetails(otherDetails);
      setSelectedDetail(null);
      setError(null);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = otherDetails.filter(detail => {
      const searchFields = [
        detail.customerid?.toString().toLowerCase(),
        detail.customername?.toLowerCase(),
        detail.customernumber?.toLowerCase(),
        detail.id?.toString().toLowerCase(),
        detail.busticket?.toString().toLowerCase(),
        detail.travelinsurance?.toString().toLowerCase()
      ];

      return searchFields.some(field => field?.includes(lowerCaseSearchTerm));
    });

    setFilteredDetails(results);
    setError(results.length === 0 ? 'No matching bookings found' : null);
  }, [searchTerm, otherDetails]);

  // Event handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectDetail = (detail) => {
    setSelectedDetail(detail);
  };

  // Copy booking details to clipboard
  const copyBookingDetails = () => {
    if (!selectedDetail) return;

    let detailsText = `CUSTOMER DETAILS\n`;
    detailsText += `────────────────\n`;
    detailsText += `Booking ID: ${selectedDetail.customerid || 'N/A'}\n`;
    detailsText += `Customer Name: ${selectedDetail.customername || '-'}\n`;
    detailsText += `Customer Email: ${selectedDetail.customermail || '-'}\n`;
    detailsText += `Customer Phone: ${selectedDetail.customernumber || '-'}\n`;
    detailsText += `Customer ID: ${selectedDetail.customerid || '-'}\n`;
    detailsText += `Bus Ticket: ${selectedDetail.busticket || '-'}\n`;
    detailsText += `Travel Insurance: ${selectedDetail.travelinsurance || '-'}\n`;
    detailsText += `Collection Date: ${formatDate(selectedDetail.collectiondate)}\n`;
    detailsText += `Submission Date: ${formatDate(selectedDetail.submissiondate)}\n`;

    navigator.clipboard.writeText(detailsText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Customer Database</h1>
        
        {/* Search */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by Booking ID, Name, or Ticket Number"
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500"
          />
          {selectedDetail && (
            <button
              onClick={copyBookingDetails}
              className={`px-4 py-2 ${copied ? 'bg-green-600' : 'bg-purple-600'} text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2`}
              title="Copy booking details"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings List */}
          <div className="lg:col-span-1 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Customers List</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse h-16"></div>
                ))}
              </div>
            ) : filteredDetails.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No Customers found</p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredDetails.map((detail, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectDetail(detail)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedDetail?.id === detail.id 
                        ? 'hover:bg-green-600 hover:text-white text-black dark:text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{detail.customername}</div>
                    <div className="text-sm opacity-80">
                      Booking ID: {detail.customerid}
                    </div>
                    <div className="text-sm opacity-80">
                      Bus Ticket: {detail.busticket} • {formatDate(detail.collectiondate)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedDetail ? (
              <div className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Booking ID" value={selectedDetail.customerid} highlight />
                  <DetailItem label="Customer Name" value={selectedDetail.customername} highlight />
                  <DetailItem label="Customer Email" value={selectedDetail.customermail} />
                  <DetailItem label="Customer Phone" value={selectedDetail.customernumber} />
                  <DetailItem label="Customer ID" value={selectedDetail.customerid} />
                  <DetailItem label="Bus Ticket" value={selectedDetail.busticket} />
                  <DetailItem label="Travel Insurance" value={selectedDetail.travelinsurance} />
                  <DetailItem label="Collection Date" value={formatDate(selectedDetail.collectiondate)} />
                  <DetailItem label="Submission Date" value={formatDate(selectedDetail.submissiondate)} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 rounded-lg bg-gray-100 dark:bg-gray-700">
                <p className="text-lg">
                  {filteredDetails.length === 0 && !loading 
                    ? searchTerm 
                      ? 'No matching bookings found' 
                      : 'No bookings available'
                    : 'Select a customer to view details'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable component for detail items
const DetailItem = ({ label, value, highlight = false }) => {
  return (
    <div className={`p-4 rounded-lg ${
      highlight 
        ? 'bg-green-600 dark:bg-green-700 text-white' 
        : 'bg-gray-100 dark:bg-gray-700'
    }`}>
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className={`mt-1 font-semibold ${
        highlight ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        {value || '-'}
      </div>
    </div>
  );
};

export default OtherCustomerPage;