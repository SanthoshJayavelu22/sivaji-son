import React, { useState, useEffect } from 'react';
import { usePDF } from 'react-to-pdf';
import { getFlightCustomers } from '../Api/Flight';
import logo from '../../assets/image.png';
import iata from '../../assets/iata.png';
import { FaCopy, FaCheck, FaDownload } from 'react-icons/fa';
import axios from 'axios';

const FlightCustomerPage = () => {
  const [flightDetails, setFlightDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [autoFillMessage, setAutoFillMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [airlineLogo, setAirlineLogo] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { toPDF, targetRef } = usePDF({
    filename: 'flight-details.pdf',
    page: { margin: 20 },
    canvas: { scale: 2 },
  });

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '10px 6px',
    textAlign: 'center'
  };

  

  // Helper function to format passenger names
  const formatPassengerNames = (passengers) => {
    if (!passengers) return 'N/A';
    if (Array.isArray(passengers)) {
      return passengers.map(p => 
        typeof p === 'object' ? p.passengername : p
      ).join(", ");
    }
    return passengers;
  };

  // Format time only (HH:MM AM/PM)
  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short', // or 'long' for full month name
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    const fetchAirlineLogo = async () => {
      if (selectedAirline?.airline) {
        try {

          const response = await axios.get(
            `${API_BASE_URL}/logo/${selectedAirline.airline}`,
            {
              responseType: 'arraybuffer',
              headers: {
                'Accept': 'image/*'
              }
            }
          );


          console.log('Airline logo response:', response.data);
          
          // Convert arraybuffer to base64
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte), ''
            )
          );
          
          const imageType = response.headers['content-type'] || 'image/png';
          const logoUrl = `data:${imageType};base64,${base64}`;
          
          setAirlineLogo(logoUrl);
        } catch (err) {
          console.error('Error fetching airline logo:', err);
          setAirlineLogo(null);
        }
      } else {
        setAirlineLogo(null);
      }
    };
    
    fetchAirlineLogo();
  }, [selectedAirline, API_BASE_URL]);
  

  // Copy flight details to clipboard
  const copyFlightDetails = () => {
    if (!selectedDetail) return;

    let detailsText = `Customer Details\n`;
    detailsText += `────────────────────\n`;
    detailsText += `Passenger Name: ${formatPassengerNames(selectedDetail.passengername)}\n`;
    detailsText += `Customer ID: ${selectedDetail.cutomerid || 'N/A'}\n`;
    detailsText += `Customer Name: ${selectedDetail.customername || '-'}\n`;
   
    detailsText += `Customer Email: ${selectedDetail.customermail || '-'}\n`;
    detailsText += `Customer Number: ${selectedDetail.customernumber || '-'}\n`;
    detailsText += `PNR: ${selectedDetail.pnr || '-'}\n\n`;

    if (selectedAirline) {
      detailsText += `Flight Details\n`;
      detailsText += `──────────────\n`;
      detailsText += `Flight Number: ${selectedAirline.flightnumber}\n`;
      detailsText += `Ticket Number: ${selectedAirline.ticketnumber || 'Not issued'}\n`;
      detailsText += `Route: ${selectedAirline.departureairport} → ${selectedAirline.arrivalairport}\n`;
      detailsText += `Departure: ${formatTime(selectedAirline.departuretime)} @ ${selectedAirline.departureairport}\n`;
      detailsText += `Arrival: ${formatTime(selectedAirline.arrivaltime)} @ ${selectedAirline.arrivalairport}\n`;
      detailsText += `Class: ${selectedAirline.travelclass}\n`;
      detailsText += `Baggage: ${selectedAirline.baggageallowance}\n`;
    }

    navigator.clipboard.writeText(detailsText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Fetch all flight customers
  useEffect(() => {
    const fetchFlightDetails = async () => {
      setLoading(true);
      try {
        const data = await getFlightCustomers();
        const detailsWithAirlines = data.map(customer => ({
          ...customer,
          airlines: customer.airlines || []
        }));
        setFlightDetails(detailsWithAirlines);
        setFilteredDetails(detailsWithAirlines);
        setError(null);
      } catch (err) {
        setError('Failed to fetch flight customer details.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, []);

  const formatDateWithDay = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter customers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDetails(flightDetails);
      setSelectedDetail(null);
      setError(null);
      return;
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = flightDetails.filter(detail => {
      const passengerNames = formatPassengerNames(detail.passengername).toLowerCase();
      return (
        (detail.cutomerid && detail.cutomerid.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
        passengerNames.includes(lowerCaseSearchTerm) ||
        (detail.customername && detail.customername.toLowerCase().includes(lowerCaseSearchTerm))
      );
    });

    setFilteredDetails(results);
    if (results.length === 0) setError('No matching customers found');
    else setError(null);
  }, [searchTerm, flightDetails]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectDetail = (detail) => {
    setSelectedDetail(detail);
    if (detail.airlines && detail.airlines.length > 0) {
      setSelectedAirline(detail.airlines[0]);
    } else {
      setSelectedAirline(null);
    }
  };

  const handleSelectAirline = (airline) => {
    setSelectedAirline(airline);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Flight Customer Details</h1>
        
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by Customer ID or Name"
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500"
          />
          {selectedDetail && (
            <div className="flex gap-2">
              <button 
                onClick={() => toPDF()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                title="Download PDF"
              >
                <FaDownload /> PDF
              </button>
              <button
                onClick={copyFlightDetails}
                className={`px-4 py-2 ${copied ? 'bg-green-600' : 'bg-purple-600'} text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2`}
                title="Copy flight details"
              >
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {autoFillMessage && (
          <div className={`p-4 mb-6 rounded-lg ${
            autoFillMessage.includes("Error") ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" :
            autoFillMessage.includes("found") ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}>
            {autoFillMessage}
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Flight Customers</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse h-16"></div>
                ))}
              </div>
            ) : filteredDetails.length === 0 ? (
              <p>No matching customers found</p>
            ) : (
              <ul className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredDetails.map((detail, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectDetail(detail)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedDetail?.id === detail.id 
                        ? 'bg-green-600 dark:bg-green-700 text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{formatPassengerNames(detail.passengername)}</div>
                    <div className="text-sm opacity-80">
                      ID: {detail.cutomerid || 'N/A'}
                    </div>
                    <div className="text-sm opacity-80">
                      Flights: {detail.airlines?.length || 0}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedDetail && (
              <div className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Customer Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <DetailItem label="Customer ID" value={selectedDetail.cutomerid || 'Not assigned'} highlight />
                  <DetailItem label="Passenger Name" value={selectedDetail.passengername} highlight formatFn={formatPassengerNames} />
                  <DetailItem label="Customer Name" value={selectedDetail.customername} />
                
                  <DetailItem label="Customer Email" value={selectedDetail.customermail} />
                  <DetailItem label="Customer Number" value={selectedDetail.customernumber} />
                  <DetailItem label="PNR" value={selectedDetail.pnr} />
                </div>

                <h3 className="text-xl font-semibold mb-4">Flight Options</h3>
                {selectedDetail.airlines?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedDetail.airlines.map((airline, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectAirline(airline)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedAirline?.id === airline.id
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="font-medium">{airline.flightnumber}</div>
                          <div className="text-sm opacity-80">
                            {airline.departureairport} → {airline.arrivalairport}
                          </div>
                          <div className="text-sm">
                            Dep: {formatTime(airline.departuretime)} | Arr: {formatTime(airline.arrivaltime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No flight details available</p>
                )}
              </div>
            )}

            {selectedAirline && (
              <div className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Flight Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <DetailItem label="Flight Number" value={selectedAirline.flightnumber} highlight />
                  <DetailItem label="Ticket Number" value={selectedAirline.ticketnumber || 'Not issued'} highlight />
                  <DetailItem label="Departure Airport" value={selectedAirline.departureairport} />
                  <DetailItem label="Arrival Airport" value={selectedAirline.arrivalairport} />
                  <DetailItem label="Departure Time" value={selectedAirline.departuretime} formatFn={formatTime} />
                  <DetailItem label="Arrival Time" value={selectedAirline.arrivaltime} formatFn={formatTime} />
                  <DetailItem label="Class" value={selectedAirline.travelclass} />
                  <DetailItem label="Baggage" value={selectedAirline.baggageallowance} />
                </div>
              </div>
            )}

            {!selectedDetail && (
              <div className="text-center py-12 rounded-lg bg-gray-100 dark:bg-gray-700">
                <p className="text-lg">
                  {filteredDetails.length === 0 && !loading 
                    ? searchTerm 
                      ? 'No matching customers found' 
                      : 'No customers available'
                    : 'Select a customer to view details'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Hidden PDF Template */}
        {selectedDetail && (
          <div ref={targetRef} style={{ position: 'absolute', left: '-9999px' }}>
           <div style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '0mm',
      backgroundColor: '#ffffff',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      color: '#333',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eaeaea'
      }}>
        <div>
          <img src={logo} alt="Company Logo" style={{ height: '80px' }} />
     
     <p></p>
        

        </div>
        <div style={{ textAlign: 'right' }}>
          
        <img
    src={airlineLogo}
    alt="Airline Logo"
    style={{ height: '50px', marginTop: '10px' }}
    onError={(e) => {
      e.target.onerror = null;
      e.target.style.display = 'none';
    }}
  />
          <div style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#2c3e50',
            marginBottom: '5px'
          }}>
            Flight Itinerary
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#7f8c8d',
            backgroundColor: '#f8f9fa',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            PNR: {selectedDetail.pnr || 'Pending'}
          </div>



          {/* <div style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#2c3e50',
            marginBottom: '5px'
          }}>
           Airline: {selectedDetail.airlines[0].airline }
          </div> */}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '10px 15px',
          fontWeight: '600',
          fontSize: '16px',
          borderLeft: '4px solid #3498db',
          marginBottom: '15px'
        }}>
          Passenger & Booking Details
        </div>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#7f8c8d' }}>Passenger Name</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
            {formatPassengerNames(selectedDetail.passengername)}
            </div>
          </div>
          <div>
            {/* <div style={{ fontSize: '14px', color: '#7f8c8d' }}>Travel Date</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
              {formatDateWithDay(selectedDetail.traveldate)}
            </div> */}
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#7f8c8d' }}>Customer Number</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
              {selectedDetail.customernumber || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '10px 15px',
          fontWeight: '600',
          fontSize: '16px',
          borderLeft: '4px solid #e74c3c',
          marginBottom: '25px'
        }}>
          Flight Schedule
        </div>
        
        {selectedDetail.airlines?.length > 0 ? (
          <div style={{
            border: '1px solid #eaeaea',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '13px'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Flight</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Class</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Ticket Number</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Departure</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Arrival</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Baggage</th>
                </tr>
              </thead>
              <tbody>
                {selectedDetail.airlines.map((airline, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #eaeaea',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                  }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500' }}>{airline.flightnumber}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {airline.travelclass}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>
                      {airline.ticketnumber }
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500' }}>{formatTime(airline.departuretime)}</div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        {airline.departureairport}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500' }}>{formatTime(airline.arrivaltime)}</div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        {airline.arrivalairport}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {airline.baggageallowance }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            textAlign: 'center',
            color: '#7f8c8d'
          }}>
            No flight details available
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa',
        borderLeft: '4px solid #f39c12',
        padding: '15px',
        marginBottom: '25px',
        borderRadius: '0 4px 4px 0'
      }}>
        <div style={{ 
          fontWeight: '600',
          fontSize: '16px',
          marginBottom: '10px',
          color: '#2c3e50'
        }}>
          Travel Information
        </div>
        <ul style={{ 
          fontSize: "13px",
          paddingLeft: "20px",
          margin: 0,
        }}>
          <li >- Complete web check-in 48 hours before departure to obtain boarding pass</li>
          <li >- Arrive at airport: 3 hours prior for international flights, 2 hours for domestic</li>
          <li >- Verify terminal information with airline before departure</li>
          <li >- For last-minute changes (within 4 hours of departure), contact airline directly</li>
          <li >- Baggage allowance and fees subject to airline policies</li>
        </ul>
      </div>

      <div style={{
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #eaeaea',
    fontSize: '11px',
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: '1.5'
  }}>
    <p style={{ 
        fontWeight: '600', 
        fontSize: '13px',
        color: '#2c3e50',
        marginBottom: '5px'
      }}>SIVAJI SON TOURS AND TRAVELS PRIVATE LIMITED</p>
   
    <p>VSD Plaza, AA Block, No 65/1, 2nd Avenue, Anna Nagar, Chennai, Tamilnadu, India - 600040</p>
    <p>Email: saranraj@sivajison.com | Phone: 9655150814, 044 - 46856688</p>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
    <img src={iata} alt="IATA Logo" style={{ height: '100px', marginTop: '10px',  }} /></div>
  </div>
    </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, highlight = false, formatFn }) => {
  const displayValue = formatFn ? formatFn(value) : value;
  
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
        {displayValue || '-'}
      </div>
    </div>
  );
};

export default FlightCustomerPage;