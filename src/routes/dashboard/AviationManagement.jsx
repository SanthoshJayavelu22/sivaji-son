import { useState } from 'react';
import { Plane, MapPin, Upload } from 'lucide-react';
import { addAirline, addAirport } from '../Api/aviationApi';

const AviationManagement = () => {
  const [activeTab, setActiveTab] = useState('airlines');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [newAirline, setNewAirline] = useState({ name: '', logo: null });
  const [newAirport, setNewAirport] = useState({ code: '' });

  const handleAirlineSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await addAirline(newAirline);
      setSuccess('Airline added successfully!');
      setNewAirline({ name: '', logo: null });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add airline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAirportSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await addAirport(newAirport.code);
      setSuccess('Airport added successfully!');
      setNewAirport({ code: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add airport');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Header with tabs */}
      <div className="flex border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab('airlines')}
          className={`flex-1 py-4 px-6 text-center font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-200 ${
            activeTab === 'airlines'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500 bg-green-50 dark:bg-gray-700'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Plane className="h-4 w-4" />
          Airlines
        </button>
        <button
          onClick={() => setActiveTab('airports')}
          className={`flex-1 py-4 px-6 text-center font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-200 ${
            activeTab === 'airports'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500 bg-green-50 dark:bg-gray-700'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <MapPin className="h-4 w-4" />
          Airports
        </button>
      </div>

      {/* Content area */}
      <div className="p-6">
        {/* Status messages */}
        {error && (
          <div className="mb-4 p-3 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-2">
            <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg flex items-start gap-2">
            <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Airlines Form */}
        {activeTab === 'airlines' && (
          <form onSubmit={handleAirlineSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Airline Name</label>
              <input
                type="text"
                value={newAirline.name}
                onChange={(e) => setNewAirline({...newAirline, name: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter airline name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo</label>
              <label className="flex items-center gap-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <Upload size={14} className="text-gray-500 dark:text-gray-400" />
                <span className="truncate">
                  {newAirline.logo ? newAirline.logo.name : 'Upload Logo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewAirline({...newAirline, logo: e.target.files[0]})}
                  className="hidden"
                  required
                />
              </label>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Recommended size: 200x200px (PNG or JPG)</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center gap-2 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Airline...
                  </>
                ) : (
                  <>
                    <Plane className="h-4 w-4" />
                    Add Airline
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Airports Form */}
        {activeTab === 'airports' && (
          <form onSubmit={handleAirportSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Airport Code (IATA)</label>
              <input
                type="text"
                value={newAirport.code}
                onChange={(e) => setNewAirport({code: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Delhi (DEL)
"
                required
             
               
                title="Please enter a valid 3-letter airport code"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center gap-2 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Airport...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Add Airport
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AviationManagement;