import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import {
  FiDownload,
  FiUser,
  FiPhone,
  FiMail,
  FiHome,
  FiCalendar,
  FiClock,
  FiSearch,
  FiHelpCircle,
  FiPhoneCall,
  FiMapPin,
  FiChevronRight
} from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaRegStar, FaStar } from 'react-icons/fa';
import logo from '../../../assets/image.png';
import iata from '../../../assets/iata.png';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4 border-b border-gray-200">
          <div className="flex items-center">
            <img src={logo} alt="Company Logo" className="h-10 md:h-12" />
          </div>
          
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <a href="#" className="text-sm md:text-base text-gray-600 hover:text-green-600 transition-colors font-medium">Home</a>
            <a href="#" className="text-sm md:text-base text-gray-600 hover:text-green-600 transition-colors font-medium">About Us</a>
            <a href="#" className="text-sm md:text-base text-gray-600 hover:text-green-600 transition-colors font-medium">Contact Us</a>
          </div>

          <button 
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-2">
            <a href="#" className="block px-3 py-2 text-sm rounded-md font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">Home</a>
            <a href="#" className="block px-3 py-2 text-sm rounded-md font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">About Us</a>
            <a href="#" className="block px-3 py-2 text-sm rounded-md font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">Contact Us</a>
          </div>
        )}
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-8 pb-6 md:pt-12 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">About Us</h3>
            <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
              Sivaji Son Tours and Travels is a leading travel agency providing exceptional travel experiences since 2005.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2">
              <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors flex items-center"><FiChevronRight className="mr-1 h-3 w-3" /> Home</a></li>
              <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors flex items-center"><FiChevronRight className="mr-1 h-3 w-3" /> About Us</a></li>
              <li><a href="#" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors flex items-center"><FiChevronRight className="mr-1 h-3 w-3" /> Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Contact Us</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400">
              <li className="flex items-start">
                <FiPhoneCall className="mt-0.5 md:mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p>+91 9655150814</p>
                  <p>044 - 46856688</p>
                </div>
              </li>
              <li className="flex items-start">
                <FiMail className="mt-0.5 md:mt-1 mr-2 flex-shrink-0" />
                <p>saranraj@sivajison.com</p>
              </li>
              <li className="flex items-start">
                <FiMapPin className="mt-0.5 md:mt-1 mr-2 flex-shrink-0" />
                <p>
                  VSD Plaza, AA Block, No 65/1,<br />
                  2nd Avenue, Anna Nagar,<br />
                  Chennai, Tamilnadu, India - 600040
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 md:pt-6 text-center text-xs md:text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sivaji Son Tours and Travels Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const CustomerBookingPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hotelBookings, setHotelBookings] = useState([]);
  const [flightBookings, setFlightBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [airlineLogo, setAirlineLogo] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { toPDF: toHotelPDF, targetRef: hotelTargetRef } = usePDF({
    filename: 'hotel-booking.pdf',
    page: {
      margin: 20,
      format: 'A4',
      orientation: 'portrait'
    }
  });

  const { toPDF: toFlightPDF, targetRef: flightTargetRef } = usePDF({
    filename: 'flight-booking.pdf',
    page: {
      margin: 20,
      format: 'A4',
      orientation: 'portrait'
    }
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchAirlineLogo = async (airlineName) => {
    if (!airlineName) return null;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/logo/${airlineName}`, {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'image/*',
        },
      });

      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      const imageType = response.headers['content-type'] || 'image/png';
      return `data:${imageType};base64,${base64}`;
    } catch (error) {
      console.error('Error fetching airline logo:', error);
      return null;
    }
  };

  const fetchBookingDetails = async () => {
    if (!phoneNumber.match(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,7}$/)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');
    setHotelBookings([]);
    setFlightBookings([]);
    setAirlineLogo(null);
   
    try {
      const [hotelResponse, flightResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/customer/hotel/${phoneNumber}`),
        axios.get(`${API_BASE_URL}/customer/flight/${phoneNumber}`)
      ]);

      if (hotelResponse.data && hotelResponse.data.length > 0) {
        setHotelBookings(hotelResponse.data);
      }

      if (flightResponse.data && flightResponse.data.length > 0) {
        setFlightBookings(flightResponse.data);
        
        const firstAirline = flightResponse.data[0]?.airlines?.[0]?.airline;
        if (firstAirline) {
          const logo = await fetchAirlineLogo(firstAirline);
          setAirlineLogo(logo);
        }
      }

      if (hotelResponse.data.length > 0 || flightResponse.data.length > 0) {
        setShowSuccess(true);
      } else {
        setError('No bookings found for this phone number');
      }
    } catch (err) {
      setError('Failed to fetch booking details. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPassengerNames = (passengers) => {
    if (!passengers) return 'N/A';
    
    if (Array.isArray(passengers)) {
      return passengers
        .map(p => p?.passengername || p)
        .filter(Boolean)
        .join(', ') || 'N/A';
    }
    
    return typeof passengers === 'string' ? passengers : 'N/A';
  };

  const handleDownloadHotelPdf = async () => {
    try {
      await new Promise(resolve => {
        const img = new Image();
        img.src = logo;
        img.onload = resolve;
        img.onerror = resolve;
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      await toHotelPDF();
    } catch (err) {
      setError('Failed to generate hotel PDF. Please try again.');
      console.error('PDF generation error:', err);
    }
  };

  const handleDownloadFlightPdf = async () => {
    try {
      await toFlightPDF();
    } catch (err) {
      setError('Failed to generate flight PDF. Please try again.');
      console.error('PDF generation error:', err);
    }
  };

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

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Your Bookings Details</h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                  Find and manage your flight and hotel bookings by entering your phone number below
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center text-gray-800">
                  <FiSearch className="mr-2 text-green-600" />
                  Find Your Bookings
                </h2>
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number (e.g., +91 9876543210)"
                      className="pl-10 w-full px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm md:text-base"
                      maxLength="15"
                    />
                  </div>
                  <button
                    onClick={fetchBookingDetails}
                    disabled={loading}
                    className="px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium text-sm md:text-base"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </span>
                    ) : (
                      <>
                        <FiSearch className="mr-2" />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 md:p-4 mb-4 md:mb-6 rounded-lg bg-red-100 text-red-700 border border-red-200 flex items-start text-sm md:text-base">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {error}
                </div>
              )}

              {showSuccess && (
                <div className="p-3 md:p-4 mb-4 md:mb-6 rounded-lg bg-green-100 text-green-700 border border-green-200 flex items-start text-sm md:text-base">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {hotelBookings.length > 0 && flightBookings.length > 0 
                    ? 'Hotel and flight bookings found successfully!' 
                    : hotelBookings.length > 0 
                      ? 'Hotel booking found successfully!' 
                      : 'Flight booking found successfully!'}
                </div>
              )}

              {(hotelBookings.length > 0 || flightBookings.length > 0) && (
                <div className="space-y-6 md:space-y-8">
                  {hotelBookings.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                      <div className="p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3 md:gap-4">
                          <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                              <FiHome className="mr-2 text-green-600" />
                              Hotel Booking Information
                            </h2>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                              {hotelBookings.length} booking{hotelBookings.length > 1 ? 's' : ''} found
                            </p>
                          </div>
                          <button
                            onClick={handleDownloadHotelPdf}
                            className="flex items-center px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto justify-center font-medium text-sm md:text-base"
                          >
                            <FiDownload className="mr-2" />
                            Download Voucher
                          </button>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                          {hotelBookings.map((booking, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4 md:pb-6 mb-4 md:mb-6 last:border-b-0 last:pb-0 last:mb-0">
                              <HotelBookingDetails
                                bookingDetails={booking}
                                formatDate={formatDate}
                                formatDateWithDay={formatDateWithDay}
                                calculateNights={calculateNights}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {flightBookings.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                      <div className="p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3 md:gap-4">
                          <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                              <FiCalendar className="mr-2 text-blue-600" />
                              Flight Booking Information
                            </h2>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                              {flightBookings.length} booking{flightBookings.length > 1 ? 's' : ''} found
                            </p>
                          </div>
                          <button
                            onClick={handleDownloadFlightPdf}
                            className="flex items-center px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto justify-center font-medium text-sm md:text-base"
                          >
                            <FiDownload className="mr-2" />
                            Download Ticket
                          </button>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                          {flightBookings.map((booking, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4 md:pb-6 mb-4 md:mb-6 last:border-b-0 last:pb-0 last:mb-0">
                              <FlightBookingDetails
                                bookingDetails={booking}
                                formatTime={formatTime}
                                formatPassengerNames={formatPassengerNames}
                                airlineLogo={airlineLogo}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: '-9999px' }}>
          {hotelBookings.length > 0 && (
            <div ref={hotelTargetRef}>
              {hotelBookings.map((booking, index) => (
                <div key={`hotel-pdf-${index}`}>
                  <HotelPdfTemplate
                    bookingDetails={booking}
                    logo={logo}
                    iata={iata}
                    formatDateWithDay={formatDateWithDay}
                    formatTime={formatTime}
                    calculateNights={calculateNights}
                  />
                </div>
              ))}
            </div>
          )}

          {flightBookings.length > 0 && (
            <div ref={flightTargetRef}>
              {flightBookings.map((booking, index) => (
                <div key={`flight-pdf-${index}`}>
                  <FlightPdfTemplate
                    bookingDetails={booking}
                    logo={logo}
                    iata={iata}
                    airlineLogo={airlineLogo}
                    formatTime={formatTime}
                    formatDateWithDay={formatDateWithDay}
                    formatPassengerNames={formatPassengerNames}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

const HotelBookingDetails = ({ bookingDetails, formatDate, formatDateWithDay, calculateNights }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <DetailCard
          icon={<FiUser className="text-green-500" />}
          label="Guest Name"
          value={bookingDetails.customername}
          highlight
        />
        <DetailCard
          icon={<FiHome className="text-green-500" />}
          label="Booking ID"
          value={bookingDetails.bookingid}
        />
        <DetailCard
          icon={<FiMail className="text-green-500" />}
          label="Contact Email"
          value={bookingDetails.customermail}
        />
        <DetailCard
          icon={<FiPhone className="text-green-500" />}
          label="Contact Number"
          value={bookingDetails.customernumber}
        />
      </div>

      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
          <FiHome className="mr-2 text-green-500" />
          Hotel Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <DetailCard
            label="Hotel Name"
            value={bookingDetails.hotelname}
            highlight
          />
          <DetailCard
            label="Hotel Contact"
            value={bookingDetails.hotelcontactperson}
          />
          <DetailCard
            label="Check-in Date"
            value={formatDate(bookingDetails.checkindate)}
          />
          <DetailCard
            label="Check-out Date"
            value={formatDate(bookingDetails.checkoutdate)}
          />
          <DetailCard
            label="Number of Nights"
            value={calculateNights(bookingDetails.checkindate, bookingDetails.checkoutdate)}
          />
          <DetailCard
            label="Confirmation Number"
            value={bookingDetails.hcn || 'Not provided'}
          />
        </div>
      </div>
    </>
  );
};

const FlightBookingDetails = ({ bookingDetails, formatPassengerNames, formatTime, airlineLogo }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <DetailCard
          icon={<FiUser className="text-green-500" />}
          label="Passenger Name"
          value={formatPassengerNames(bookingDetails.passengername)}
          highlight
        />
        <DetailCard
          icon={<FiMail className="text-green-500" />}
          label="Contact Email"
          value={bookingDetails.customermail}
        />
        <DetailCard
          icon={<FiPhone className="text-green-500" />}
          label="Contact Number"
          value={bookingDetails.customernumber}
        />
        <DetailCard
          icon={<FiUser className="text-green-500" />}
          label="Customer Name"
          value={bookingDetails.customername}
        />
        <DetailCard
          icon={<FiHome className="text-green-500" />}
          label="PNR Number"
          value={bookingDetails.pnr}
        />
      </div>

      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
          <FiCalendar className="mr-2 text-blue-500" />
          Flight Details
        </h3>
        {bookingDetails.airlines?.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {bookingDetails.airlines.map((airline, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2 md:mb-3">
                  {airlineLogo && (
                    <img 
                      src={airlineLogo} 
                      alt="Airline Logo" 
                      className="h-6 md:h-8 mr-2 md:mr-3"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <h4 className="text-sm md:text-base font-semibold">
                    {airline.airline} - {airline.flightnumber}
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                  <DetailCard
                    icon={<FiClock className="text-green-500" />}
                    label="Flight Number"
                    value={airline.flightnumber}
                  />
                  <DetailCard
                    icon={<FiHome className="text-green-500" />}
                    label="Ticket Number"
                    value={airline.ticketnumber || 'Not issued'}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <DetailCard
                    label="Departure"
                    value={`${airline.departureairport} at ${formatTime(airline.departuretime)}`}
                  />
                  <DetailCard
                    label="Arrival"
                    value={`${airline.arrivalairport} at ${formatTime(airline.arrivaltime)}`}
                  />
                  <DetailCard
                    label="Class"
                    value={airline.travelclass}
                  />
                  <DetailCard
                    label="Baggage Allowance"
                    value={airline.baggageallowance}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm md:text-base text-gray-500">No flight details available</p>
        )}
      </div>
    </>
  );
};

const HotelPdfTemplate = ({ bookingDetails, logo, iata, formatDateWithDay, formatTime, calculateNights }) => {
  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '12px',
      backgroundColor: '#ffffff',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      color: '#333',
      boxSizing: 'border-box',
      fontSize: '0.875rem',
      lineHeight: '1.5'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eaeaea'
      }}>
        <img src={logo} alt="Company Logo" style={{ height: '50px' }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#2c3e50',
            marginBottom: '5px'
          }}>
            Hotel Accommodation Voucher
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#7f8c8d',
            backgroundColor: '#f8f9fa',
            padding: '3px 6px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            Booking ID: {bookingDetails.bookingid}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#27ae60',
        color: 'white',
        textAlign: 'center',
        padding: '8px',
        fontWeight: '600',
        fontSize: '0.875rem',
        marginBottom: '20px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Sivaji Son Tours and Travels Pvt Ltd
      </div>

      <div style={{}}>
        <div style={{ }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '8px 12px',
            fontWeight: '600',
            fontSize: '0.875rem',
            borderLeft: '4px solid #3498db',
            marginBottom: '12px'
          }}>
            Guest Information
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', width: '40%', fontWeight: '600' }}>Guest Name :</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: '500' }}>{bookingDetails.customername}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: '600' }}>Contact Number:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{bookingDetails.customernumber || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: '600' }}>Email Address:</td>
                <td style={{ padding: '8px 0' }}>{bookingDetails.customermail || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '15px' }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '8px 12px',
            fontWeight: '600',
            fontSize: '0.875rem',
            borderLeft: '4px solid #e74c3c',
            marginBottom: '12px'
          }}>
            Hotel Information
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', width: '40%', fontWeight: '600' }}>Hotel Name:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: '500' }}>{bookingDetails.hotelname}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: '600' }}>Check-in Date:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formatDateWithDay(bookingDetails.checkindate)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: '600' }}>Check-out Date:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formatDateWithDay(bookingDetails.checkoutdate)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: '600' }}>Duration:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  {calculateNights(bookingDetails.checkindate, bookingDetails.checkoutdate)} nights
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: '600' }}>Hotel Confirmation No:</td>
                <td style={{ padding: '8px 0' }}>{bookingDetails.hcn || 'Pending'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa',
        borderLeft: '4px solid #f39c12',
        padding: '12px',
        marginBottom: '20px',
        borderRadius: '0 4px 4px 0',
        marginTop: '15px',
      }}>
        <div style={{ 
          fontWeight: '600',
          fontSize: '0.875rem',
          marginBottom: '8px',
          color: '#2c3e50'
        }}>
          Important Information
        </div>
        <ul style={{ 
          fontSize: "0.75rem",
          paddingLeft: "15px",
          margin: 0,
          lineHeight: '1.5'
        }}>
          <li style={{ marginBottom: '4px' }}>- Present this voucher and valid photo ID at hotel reception during check-in</li>
          <li style={{ marginBottom: '4px' }}>- Standard check-in: 2:00 PM | Check-out: 12:00 PM (times may vary by property)</li>
          <li style={{ marginBottom: '4px' }}>- Early check-in/late check-out subject to availability and additional charges</li>
          <li style={{ marginBottom: '4px' }}>- Room type and amenities are subject to hotel availability</li>
          <li style={{ marginBottom: '0px' }}>- Cancellation policies vary by property, contact us for details</li>
        </ul>
      </div>

      <div style={{
        marginTop: '30px',
        paddingTop: '15px',
        borderTop: '1px solid #eaeaea',
        fontSize: '0.6875rem',
        color: '#7f8c8d',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        <p style={{ 
            fontWeight: '600', 
            fontSize: '0.75rem',
            color: '#2c3e50',
            marginBottom: '4px'
          }}>SIVAJI SON TOURS AND TRAVELS PRIVATE LIMITED</p>
       
        <p>VSD Plaza, AA Block, No 65/1, 2nd Avenue, Anna Nagar, Chennai, Tamilnadu, India - 600040</p>
        <p>Email: saranraj@sivajison.com | Phone: 9655150814, 044 - 46856688</p>
      </div>
    </div>
  );
};

const FlightPdfTemplate = ({ bookingDetails, logo, iata, airlineLogo, formatTime, formatDateWithDay, formatPassengerNames }) => {
  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '12px',
      backgroundColor: '#ffffff',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      color: '#333',
      boxSizing: 'border-box',
      fontSize: '0.875rem',
      lineHeight: '1.5'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eaeaea'
      }}>
        <div>
          <img src={logo} alt="Company Logo" style={{ height: '50px' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          {airlineLogo && (
            <img 
              src={airlineLogo} 
              alt="Airline Logo" 
              style={{ height: '40px', marginTop: '5px' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#2c3e50',
            marginBottom: '5px'
          }}>
            Flight Itinerary
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#7f8c8d',
            backgroundColor: '#f8f9fa',
            padding: '3px 6px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            PNR: {bookingDetails.pnr || 'Pending'}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '8px 12px',
          fontWeight: '600',
          fontSize: '0.875rem',
          borderLeft: '4px solid #3498db',
          marginBottom: '12px'
        }}>
          Passenger & Booking Details
        </div>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>Passenger Name</div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {formatPassengerNames(bookingDetails.passengername)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>Customer Number</div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {bookingDetails.customernumber || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '8px 12px',
          fontWeight: '600',
          fontSize: '0.875rem',
          borderLeft: '4px solid #e74c3c',
          marginBottom: '15px'
        }}>
          Flight Schedule
        </div>
        
        {bookingDetails.airlines?.length > 0 ? (
          <div style={{
            border: '1px solid #eaeaea',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.75rem'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Flight</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Class</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Ticket Number</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Departure</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Arrival</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Baggage</th>
                </tr>
              </thead>
              <tbody>
                {bookingDetails.airlines.map((airline, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #eaeaea',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                  }}>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: '500' }}>{airline.flightnumber}</div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {airline.travelclass}
                    </td>
                    <td style={{ padding: '10px', fontWeight: '500' }}>
                      {airline.ticketnumber}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: '500' }}>{formatTime(airline.departuretime)}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#7f8c8d' }}>
                        {airline.departureairport}
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: '500' }}>{formatTime(airline.arrivaltime)}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#7f8c8d' }}>
                        {airline.arrivalairport}
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {airline.baggageallowance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '15px',
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
        padding: '12px',
        marginBottom: '20px',
        borderRadius: '0 4px 4px 0'
      }}>
        <div style={{ 
          fontWeight: '600',
          fontSize: '0.875rem',
          marginBottom: '8px',
          color: '#2c3e50'
        }}>
          Travel Information
        </div>
        <ul style={{ 
          fontSize: "0.75rem",
          paddingLeft: "15px",
          margin: 0,
        }}>
          <li style={{ marginBottom: '4px' }}>- Complete web check-in 48 hours before departure to obtain boarding pass</li>
          <li style={{ marginBottom: '4px' }}>- Arrive at airport: 3 hours prior for international flights, 2 hours for domestic</li>
          <li style={{ marginBottom: '4px' }}>- Verify terminal information with airline before departure</li>
          <li style={{ marginBottom: '4px' }}>- For last-minute changes (within 4 hours of departure), contact airline directly</li>
          <li style={{ marginBottom: '0px' }}>- Baggage allowance and fees subject to airline policies</li>
        </ul>
      </div>

      <div style={{
        marginTop: '30px',
        paddingTop: '15px',
        borderTop: '1px solid #eaeaea',
        fontSize: '0.6875rem',
        color: '#7f8c8d',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        <p style={{ 
            fontWeight: '600', 
            fontSize: '0.75rem',
            color: '#2c3e50',
            marginBottom: '4px'
          }}>SIVAJI SON TOURS AND TRAVELS PRIVATE LIMITED</p>
       
        <p>VSD Plaza, AA Block, No 65/1, 2nd Avenue, Anna Nagar, Chennai, Tamilnadu, India - 600040</p>
        <p>Email: saranraj@sivajison.com | Phone: 9655150814, 044 - 46856688</p>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <img src={iata} alt="IATA Logo" style={{ height: '80px', marginTop: '15px' }} />
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value, highlight = false }) => {
  return (
    <div className={`p-3 md:p-4 rounded-lg border ${
      highlight ? 'border-green-300 bg-green-50' : 'border-gray-200'
    } transition-all hover:shadow-sm`}>
      <div className="flex items-center mb-1">
        {icon && <span className="mr-1 md:mr-2">{icon}</span>}
        <span className="text-xs md:text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className={`text-sm md:text-base font-semibold ${
        highlight ? 'text-green-700' : 'text-gray-800'
      }`}>
        {value || '-'}
      </div>
    </div>
  );
};

export default CustomerBookingPage;