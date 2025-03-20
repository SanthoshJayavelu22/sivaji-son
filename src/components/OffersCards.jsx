import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Grid, Pagination } from "swiper/modules";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

const OfferCards = () => {
  const [activeTab, setActiveTab] = useState("All Offers");

  const tabs = ["All Offers", "Flights", "Hotels", "Others"];
  const swiperRef = useRef(null);

  const offers = [
    {
      title: "Exclusive Dubai Getaway",
      description: "Enjoy a luxurious 5-day trip to Dubai with guided tours and 4-star accommodation.",
      price: "₹75,000",
      offer: "Flat 20% Off",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
    {
      title: "Maldives Honeymoon Special",
      description: "Romantic 4-night stay at a beach resort with complimentary dinner and activities.",
      price: "₹1,20,000",
      offer: "Book Now & Get ₹10,000 Cashback",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
    {
      title: "Paris Dream Vacation",
      description: "Explore the city of love with a 6-day package including Eiffel Tower visits and cruises.",
      price: "₹1,50,000",
      offer: "Early Bird Offer: 15% Off",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
    {
      title: "Thailand Adventure Package",
      description: "7-day adventure covering Bangkok, Phuket, and Pattaya with island tours.",
      price: "₹65,000",
      offer: "Limited Time: Buy 1 Get 1 Free",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
    {
      title: "Bali Beach Paradise",
      description: "Experience Bali’s beautiful beaches with a 5-night stay at a luxury resort.",
      price: "₹85,000",
      offer: "₹5,000 Instant Discount",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
    {
      title: "Switzerland Scenic Tour",
      description: "A 7-day luxury tour covering Zurich, Lucerne, and the Swiss Alps.",
      price: "₹2,10,000",
      offer: "Special Discount for Group Bookings",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
    {
      title: "Goa Weekend Getaway",
      description: "3-day package including beach activities, nightlife, and water sports.",
      price: "₹25,000",
      offer: "Flat 10% Off on First Booking",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
    {
      title: "Singapore Family Package",
      description: "5-day trip with Universal Studios tickets and Sentosa Island tour.",
      price: "₹90,000",
      offer: "Kids Travel Free",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
    {
      title: "Kashmir Winter Wonderland",
      description: "6-day package covering Srinagar, Gulmarg, and Pahalgam with snow activities.",
      price: "₹55,000",
      offer: "Save ₹5,000 on Online Bookings",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
    {
      title: "Kerala Backwaters Retreat",
      description: "Relax in a houseboat on the serene backwaters of Alleppey for 4 nights.",
      price: "₹40,000",
      offer: "Exclusive 15% Discount for Couples",
      image: "https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg",
    },
  ];
  

  return (
    <section className="max-w-7xl  mx-auto bg-white shadow-2xl mt-10  rounded-2xl p-6">

        <div className="flex justify-between items-center lg:flex-row flex-col">
          <h2 className="text-3xl text-[var(--primary)] font-bold mb-5 md:mb-0 font-[Gazeta]">Offers</h2>
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <p
                key={tab}
                className={`cursor-pointer text-lg pb-1 font-[Roboto] ${
                  activeTab === tab
                    ? "text-[var(--primary)] font-semibold border-b-2 border-[var(--primary)]"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-5 mt-5 md:mt-0">
        <button
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-md"
          onClick={() => swiperRef.current?.slidePrev()} // Move to Previous Slide
        >
       <IoIosArrowBack />
        </button>
        <button
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-md"
          onClick={() => swiperRef.current?.slideNext()} // Move to Next Slide
        >
         <IoIosArrowForward />
        </button>
      </div>
        </div>
     <div className="w-full h-[1px] bg-gray-400 my-6">

     </div>

      {/* Swiper Section */}
      <div className=" mx-auto overflow-x-hidden">
        <Swiper
             slidesPerView={3}
             breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 }, // Small screens (mobile)
              480: { slidesPerView: 1.5, spaceBetween: 10 }, // Slightly larger mobile
              640: { slidesPerView: 2, spaceBetween: 15 }, // Tablets
              768: { slidesPerView: 2.5, spaceBetween: 15 }, // Larger tablets
              1024: { slidesPerView: 3, spaceBetween: 20 }, // Desktops
              1280: { slidesPerView: 3, spaceBetween: 25 }, // Large screens
            }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          grid={{ rows: 2, fill: "row" }} // Added fill to fix layout issue
          spaceBetween={20}
          loop={true}
    
          modules={[Grid, Pagination]}
          className="mySwiper"
        >
          {offers.map((offer, index) => (
            <SwiperSlide key={index}>
               <div className="flex gap-6 rounded-lg shadow-md border border-gray-300 p-3 items-center mx-2.5 my-1">
                <div className="flex flex-col items-start">
                   <img src="https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg" alt="" className="w-[350px] h-[170px] " />
                
                </div>
              <div className="flex flex-col gap-3 items-start">
                <h3 className="text-[17px] font-bold font-[Gazeta]">{offer.title}</h3>
                <p className="text-gray-500 text-[15px] font-[Roboto]">{offer.description}</p>
                <button className="text-[17px] font-medium text-[var(--primary)] font-[Roboto]">Book Now</button>
              </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OfferCards;