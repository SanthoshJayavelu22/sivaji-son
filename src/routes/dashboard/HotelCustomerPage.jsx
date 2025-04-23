import React, { useState, useEffect } from 'react';
import { usePDF } from 'react-to-pdf';
import { getHotelCustomers } from '../Api/Hotel';
import logo from '../../assets/image.png';
import iata from '../../assets/iata.png';
import { FaCopy, FaCheck, FaDownload } from 'react-icons/fa';

const HotelCustomerPage = () => {
  const [hotelDetails, setHotelDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const { toPDF, targetRef } = usePDF({
    filename: 'hotel-booking-details.pdf',
    page: { margin: 20 },
    canvas: { scale: 2 },
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateWithDay = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Copy booking details to clipboard
  const copyselectedDetail = () => {
    if (!selectedDetail) return;

    let detailsText = `HOTEL BOOKING DETAILS\n`;
    detailsText += `────────────────────\n`;
    detailsText += `Booking ID: ${selectedDetail.bookingid}\n`;
    detailsText += `Guest Name: ${selectedDetail.customername}\n\n`;
    
    detailsText += `HOTEL INFORMATION\n`;
    detailsText += `─────────────────\n`;
    detailsText += `Hotel Name: ${selectedDetail.hotelname}\n`;
    detailsText += `Check-in: ${formatDateWithDay(selectedDetail.checkindate)}\n`;
    detailsText += `Check-out: ${formatDateWithDay(selectedDetail.checkoutdate)}\n`;
    detailsText += `Nights: ${selectedDetail.noofnights}\n\n`;
    
    detailsText += `CONTACT DETAILS\n`;
    detailsText += `───────────────\n`;
    detailsText += `Guest Phone: ${selectedDetail.customernumber || '-'}\n`;
    detailsText += `Guest Email: ${selectedDetail.customermail || '-'}\n`;
    detailsText += `Hotel Contact: ${selectedDetail.hotelcontactperson || '-'}\n`;
    detailsText += `Hotel Phone: ${selectedDetail.hcn || '-'}\n`;

    navigator.clipboard.writeText(detailsText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      try {
        const data = await getHotelCustomers();
        setHotelDetails(data);
        setFilteredDetails(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch hotel bookings.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDetails(hotelDetails);
      setSelectedDetail(null);
      setError(null);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = hotelDetails.filter(detail => {
      const fieldsToSearch = [
        detail.bookingid?.toString().toLowerCase(),
        detail.customername?.toLowerCase(),
        detail.hotelname?.toLowerCase(),
        detail.customernumber?.toLowerCase(),
        detail.id?.toString().toLowerCase()
      ];
      
      return fieldsToSearch.some(field => field?.includes(lowerCaseSearchTerm));
    });

    setFilteredDetails(results);
    
    if (results.length === 0) {
      setError('No matching bookings found');
    } else {
      setError(null);
    }
  }, [searchTerm, hotelDetails]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectDetail = (detail) => {
    setSelectedDetail(detail);
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Hotel Booking Management</h1>
        
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by Booking ID, Name, or Hotel"
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
                onClick={copyselectedDetail}
                className={`px-4 py-2 ${copied ? 'bg-green-600' : 'bg-purple-600'} text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2`}
                title="Copy booking details"
              >
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Bookings List</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse h-16"></div>
                ))}
              </div>
            ) : filteredDetails.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
              </div>
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
                    <div className="font-medium">{detail.customername}</div>
                    <div className="text-sm opacity-80">
                      Booking ID: {detail.bookingid}
                    </div>
                    <div className="text-sm opacity-80">
                      Hotel: {detail.hotelname} • {formatDate(detail.checkindate)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedDetail ? (
              <div className="rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Booking ID" value={selectedDetail.bookingid} highlight />
                  <DetailItem label="Customer Name" value={selectedDetail.customername} highlight />
                  <DetailItem label="Hotel Name" value={selectedDetail.hotelname} />
                  <DetailItem label="Check-in Date" value={formatDate(selectedDetail.checkindate)} />
                  <DetailItem label="Check-out Date" value={formatDate(selectedDetail.checkoutdate)} />
                  <DetailItem label="Number of Nights" value={selectedDetail.noofnights} />
                  <DetailItem label="Customer Email" value={selectedDetail.customermail} />
                  <DetailItem label="Customer Phone" value={selectedDetail.customernumber} />
                  <DetailItem label="Hotel Contact" value={selectedDetail.hotelcontactperson} />
                  <DetailItem label="Hotel Phone" value={selectedDetail.hcn} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 rounded-lg bg-gray-100 dark:bg-gray-700">
                <p className="text-lg">
                  {filteredDetails.length === 0 && !loading 
                    ? searchTerm 
                      ? 'No matching bookings found' 
                      : 'No bookings available'
                    : 'Select a booking to view details'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hidden PDF Template */}
        <div ref={targetRef} style={{ position: 'absolute', left: '-9999px' }}>
        
            {selectedDetail && (
              <>
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
        <img src={logo} alt="Company Logo" style={{ height: '60px' }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            color: '#2c3e50',
            marginBottom: '5px'
          }}>
            Hotel Accommodation Voucher
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#7f8c8d',
            backgroundColor: '#f8f9fa',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            Booking ID: {selectedDetail.bookingid}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#27ae60',
        color: 'white',
        textAlign: 'center',
        padding: '10px',
        fontWeight: '600',
        fontSize: '16px',
        marginBottom: '25px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Sivaji Son Tours and Travels Pvt Ltd
      </div>

      <div style={{}}>
        <div style={{ }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '10px 15px',
            fontWeight: '600',
            fontSize: '16px',
            borderLeft: '4px solid #3498db',
            marginBottom: '15px'
          }}>
            Guest Information
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee', width: '40%' ,fontWeight: '700' }}>Guest Name :</td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee', fontWeight: '500' }}>{selectedDetail.customername}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee' ,fontWeight: '700'}}>Contact Number:</td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>{selectedDetail.customernumber || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0' ,fontWeight: '700'}}>Email Address:</td>
                <td style={{ padding: '10px 0' }}>{selectedDetail.customermail || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '10px 15px',
            fontWeight: '600',
            fontSize: '16px',
            borderLeft: '4px solid #e74c3c',
            marginBottom: '15px'
          }}>
            Hotel Information
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee', width: '40%',fontWeight: '700' }}>Hotel Name:</td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee', fontWeight: '500' }}>{selectedDetail.hotelname}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee' ,fontWeight: '700'}}>Check-in Date:</td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>{formatDateWithDay(selectedDetail.checkindate)}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee',fontWeight: '700' }}>Check-out Date:</td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>{formatDateWithDay(selectedDetail.checkoutdate)}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee',fontWeight: '700' }}>Duration:</td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  {calculateNights(selectedDetail.checkindate, selectedDetail.checkoutdate)} nights
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0' ,fontWeight: '700'}}>Hotel Confirmation No:</td>
                <td style={{ padding: '10px 0' }}>{selectedDetail.hcn || 'Pending'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa',
        borderLeft: '4px solid #f39c12',
        padding: '15px',
        marginBottom: '25px',
        borderRadius: '0 4px 4px 0',
        marginTop: '20px',
      }}>
        <div style={{ 
          fontWeight: '600',
          fontSize: '16px',
          marginBottom: '10px',
          color: '#2c3e50'
        }}>
          Important Information
        </div>
        <ul style={{ 
          fontSize: "13px",
          paddingLeft: "20px",
          margin: 0,
          lineHeight: '1.6'
        }}>
          <li style={{ marginBottom: '0px' }}>- Present this voucher and valid photo ID at hotel reception during check-in</li>
          <li style={{ marginBottom: '0px' }}>- Standard check-in: 2:00 PM | Check-out: 12:00 PM (times may vary by property)</li>
          <li style={{ marginBottom: '0px' }}>- Early check-in/late check-out subject to availability and additional charges</li>
          <li style={{ marginBottom: '0px' }}>- Room type and amenities are subject to hotel availability</li>
          <li style={{ marginBottom: '0px' }}>- Cancellation policies vary by property, contact us for details</li>
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
              </>
            )}
         
        </div>
      </div>
    </div>
  );
};

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

export default HotelCustomerPage;