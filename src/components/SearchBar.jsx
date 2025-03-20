import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [tripType, setTripType] = useState("one-way");
  const [from, setFrom] = useState("BOM - Mumbai");
  const [to, setTo] = useState("DEL - New Delhi");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [travellers, setTravellers] = useState(1);
  const [classType, setClassType] = useState("Economy");
  const [specialFare, setSpecialFare] = useState("");

  const handleSearch = () => {
    // Handle search logic here
    console.log({ activeTab, tripType, from, to, departureDate, returnDate, travellers, classType, specialFare });
  };

  return (
    <div className="py-4 md:6 max-w-7xl px-4 md:px-0  mx-auto">
      {/* Tabs for Flights and Hotels */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-6 py-3 rounded-t-lg text-sm font-medium hover:bg-green-900 hover:text-white font-[Roboto]  ${
            activeTab === "flights" ? "bg-[var(--primary)] text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("flights")}
        >
          Flights
        </button>
        <button
          className={`px-6 py-3 rounded-t-lg text-sm font-medium hover:bg-green-900 hover:text-white font-[Roboto]  ${
            activeTab === "hotels" ? "bg-[var(--primary)] text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("hotels")}
        >
          Hotels
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col space-y-4 rounded-lg shadow-lg p-6 pt-0">
        {/* Flights Search Bar */}
        {activeTab === "flights" && (
          <>
            {/* Trip Type Tabs */}
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-900 hover:text-white font-[Roboto] ${
                  tripType === "one-way" ? "bg-[var(--primary)] text-white " : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setTripType("one-way")}
              >
                One Way
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-900 hover:text-white font-[Roboto] ${
                  tripType === "round-trip" ? "bg-[var(--primary)] text-white" : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setTripType("round-trip")}
              >
                Round Trip
              </button>
            </div>

            {/* From and To Fields */}
            <div className="flex flex-col gap-5 md:flex-row md:gap-0 space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">From</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                >
                  <option>BOM - Mumbai</option>
                  <option>DEL - New Delhi</option>
                  <option>BLR - Bangalore</option>
                  <option>HYD - Hyderabad</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">To</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                >
                  <option>DEL - New Delhi</option>
                  <option>BOM - Mumbai</option>
                  <option>BLR - Bangalore</option>
                  <option>HYD - Hyderabad</option>
                </select>
              </div>

              <div className="flex-1 z-40">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">Departure Date</label>
                <DatePicker
                  selected={departureDate}
                  onChange={(date) => setDepartureDate(date)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                  placeholderText="Select Date"
                />
              </div>

              {tripType === "round-trip" && (
                <div className="flex-1 z-40">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">Return Date</label>
                  <DatePicker
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900"
                    placeholderText="Select Date"
                  />
                </div>
              )}

<div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">Travellers</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                  value={travellers}
                  onChange={(e) => setTravellers(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Traveller{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">Class</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                >
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First Class</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Fares <span className="text-gray-500 font-[Roboto]">(Optional)</span>
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                  value={specialFare}
                  onChange={(e) => setSpecialFare(e.target.value)}
                >
                  <option value="">None</option>
                  <option>Student</option>
                  <option>Senior Citizen</option>
                  <option>Armed Forces</option>
                </select>
              </div>
          
       
            <div className="flex-1  content-end">
            <button
          className="w-full bg-[var(--primary)] text-white p-3 rounded-lg hover:bg-green-900 transition-colors font-[Roboto]"
          onClick={handleSearch}
        >
          {activeTab === "flights" ? "Search Flights" : "Search Hotels"}
        </button>
            </div>  </div>

          </>
        )}

        {/* Hotels Search Bar */}
        {activeTab === "hotels" && (
          <div className="flex flex-col gap-5 md:flex-row md:gap-0 space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">City or Hotel</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                placeholder="Enter city or hotel"
              />
            </div>

            <div className="flex-1 z-40">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">Check-in Date</label>
              <DatePicker
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                placeholderText="Select Date"
              />
            </div>

            <div className="flex-1 z-40">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">Check-out Date</label>
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                placeholderText="Select Date"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-[Roboto]">Guests</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-900 font-[Roboto]"
                value={travellers}
                onChange={(e) => setTravellers(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Guest{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1  content-end">
            <button
          className="w-full bg-[var(--primary)] text-white p-3 rounded-lg hover:bg-green-900 transition-colors font-[Roboto]"
          onClick={handleSearch}
        >
          {activeTab === "flights" ? "Search Flights" : "Search Hotels"}
        </button>
            </div>
          </div>
        )}

  
      </div>
    </div>
  );
};

export default SearchBar;