import { useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ToastNotification = ({ 
  message, 
  onClose, 
  type = 'success', 
  duration = 5000,
  position = 'top-right'
}) => {
  // Define position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  // Define color schemes based on notification type
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    dark: 'bg-gray-800'
  };

  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className={`fixed z-50 animate-fade-in ${positionClasses[position]}`}>
      <div className={`${typeClasses[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center max-w-xs md:max-w-md`}>
        <FaBell className="mr-2 flex-shrink-0" />
        <span className="flex-grow">{message}</span>
        <button 
          onClick={onClose} 
          className="ml-4 hover:opacity-80 focus:outline-none flex-shrink-0"
          aria-label="Close notification"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

ToastNotification.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'dark']),
  duration: PropTypes.number,
  position: PropTypes.oneOf([
    'top-right', 
    'top-left', 
    'bottom-right', 
    'bottom-left',
    'top-center',
    'bottom-center'
  ])
};

export default ToastNotification;