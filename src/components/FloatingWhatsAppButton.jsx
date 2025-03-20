import React, { useEffect, useState } from 'react';

const FloatingWhatsAppButton = () => {
  const phoneNumber = '1234567890'; // Replace with your phone number
  const message = encodeURIComponent('Hello, I have a question about your product.'); // Optional pre-filled message
  const [showTooltip, setShowTooltip] = useState(false);

  // Function to handle the tooltip loop
  useEffect(() => {
    let interval;

    const startTooltipLoop = () => {
      // Show the tooltip after 2 seconds
      setTimeout(() => {
        setShowTooltip(true);

        // Hide the tooltip after 7 seconds
        setTimeout(() => {
          setShowTooltip(false);
        }, 7000); // 7 seconds
      }, 2000); // 2 seconds
    };

    // Start the loop
    startTooltipLoop();
    interval = setInterval(startTooltipLoop, 9000); // Repeat every 9 seconds (2s delay + 7s visible)

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        aria-label="Chat with us on WhatsApp"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-8 h-8"
        />
      </a>

      {/* Chatbox-Style Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-14 right-10 bg-white text-gray-600 text-sm px-3 py-2 rounded-lg shadow-md w-32 animate-slideIn">
          {/* Tooltip Text */}
          <p>Chat with us</p>

          {/* Tooltip Tail (Triangle) */}
          <div
            className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45"
            style={{ boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.1)' }}
          />
        </div>
      )}
    </div>
  );
};

export default FloatingWhatsAppButton;