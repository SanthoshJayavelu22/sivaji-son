import React from 'react';
import { usePDF } from 'react-to-pdf';
import logo from '../../assets/image.png';
import iata from '../../assets/iata.png';

function PdfCreator() {
  const { toPDF, targetRef } = usePDF({
    filename: 'document.pdf',
    page: {
      margin: 20,
    },
    canvas: {
      scale: 2,
    },
  });

  return (
    <div className="pdf-container">
      {/* Hidden PDF content that will still be captured by react-to-pdf */}
      <div 
        ref={targetRef}
        style={{
          position: 'absolute',
          left: '-9999px', // Move off-screen
          width: '210mm',
          minHeight: '297mm',
          padding: '15mm',
          backgroundColor: 'white',
          boxSizing: 'border-box',
          fontFamily: "'Arial', sans-serif",
        }}
      >
        {/* Header with logos */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #ffdf59',
          paddingBottom: '10px'
        }}>
          <img 
            src={logo}
            alt="Sivaji Son" 
            style={{ height: '70px' }} 
          />
          <img 
            src="https://assets.airtrfx.com/media-em/ai/logos/ai-large-default.svg" 
            alt="Air India" 
            style={{ height: '30px' }} 
          />
        </div>

        {/* PNR Section */}
        <div style={{
          backgroundColor: '#ffdf59',
          padding: '10px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '18px',
          marginBottom: '20px',
          border: '1px solid black'
        }}>
          AIRLINE PNR: XXXXXXXXXX
        </div>

        {/* Passenger Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#ffdf59', fontWeight: 'bold' }}>
              <th style={{ border: '1px solid black', padding: '8px' }}>Passengers</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Ticket Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '8px' }}>Mr. SARANRAJ SIVAJI</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>0445600510112</td>
            </tr>
          </tbody>
        </table>

        {/* Flight Itinerary */}
        <h3 style={{
          fontWeight: 'bold',
          margin: '15px 0',
          color: '#ffdf59',
          textShadow: '1px 1px 1px black'
        }}>
          FLIGHT ITINERARY
        </h3>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#ffdf59', fontWeight: 'bold' }}>
              <th style={{ border: '1px solid black', padding: '8px' }}>Flight</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Class</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Departing</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Arriving</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Baggage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '8px' }}>AI 603</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>Economy</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>Fri 28 Mar 2025 Chennai (MAA) 23:30 Terminal 1</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>Sat 29 Mar 2025 Kochi (COK) 02:15 Terminal 2</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>15KG</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ fontWeight: "bold", marginTop: "30px", marginBottom: "10px" }}>Important Information:</h3>
        <ul style={{ fontSize: "14px", padding: "0 15px", marginLeft: 'auto', marginRight: 'auto', marginBottom: "30px", listStyle: 'revert' }}>
          <li>You must web check-in on the airline website and obtain a boarding pass.</li>
          <li>Reach the airport at least 2 hours prior for domestic flights and 4 hours prior for international flights.</li>
          <li>Check departure terminal with the airline first.</li>
          <li>Date & Time is based on the local time of the destination.</li>
          <li>Use the Airline PNR for all correspondence with the airline.</li>
          <li>For rescheduling/cancellation within 4 hours of departure, contact the airline directly.</li>
          <li>Your ability to travel is at the sole discretion of airport authorities.</li>
        </ul>

        {/* Footer */}
        <div style={{ 
          marginTop: '30px',
          textAlign: 'center',
          fontSize: '12px',
          borderTop: '1px solid #ccc',
          paddingTop: '10px'
        }}>
          <p>SIVAJI SON TOURS AND TRAVELS PRIVATE LIMITED</p>
          <p>Email: saranraj@sivajison.com | Phone: 9655150814, 044 - 46856688</p>
          <p>VSD Plaza, AA Block, No 65/1, 2nd Avenue, Anna Nagar, Chennai, Tamilnadu, India - 600040</p>
          <img 
            src={iata}
            alt="IATA Logo" 
            style={{ height: '50px', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto' }} 
          />
        </div>
      </div>
      
      {/* Visible download button */}
      <div className="controls" style={{ marginTop: '20px' }}>
        <button 
          onClick={() => toPDF()} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default PdfCreator;