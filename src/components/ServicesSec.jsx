import React from 'react'
import backgroundImage from "../assets/images/slider-3.jpg";
import { Link } from "react-router-dom";
import '../style/services.css'





const ServicesSec = () => {
  return (
    <div className='mt-26  bg-gray-50 mb-10'>

            <section
              className="flex items-center justify-center py-18 flex-col gap-4"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h2 className="text-3xl uppercase font-bold leading-tight text-white sm:text-4xl lg:text-6xl animate_animated animate_jackInTheBox font-[Gazeta]">
                Services
              </h2>
              <h3 className="uppercase text-xl font-semibold leading-tight">
              <Link
                  to="/"
                 
                > <span className="text-white cursor-pointer font-[Roboto]">Home</span></Link>
                <span className="text-white font-[Roboto]"> / </span>
                <span className="text-white font-[Roboto]"> Services</span>
              </h3>
            </section>

      <section class="min-h-screen  text-center py-5 px-5 md:py-20 md:px-20  flex flex-col justify-center">
  <span class="text-[var(--primary)] text-5xl max-w-lg mx-auto mb-2 capitalize flex items-center font-[Gazeta]">What We Do... <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-[var(--primary)]  ml-3 w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
    </svg>
  </span>
  <h1 class="text-gray-600 text-lg  mx-auto mt-10 mb-16 leading-snug font-[Roboto]">We offer highly competitive airfares for international and domestic ticketing due to our long-standing relationships with the airline industry.

Get the best travel package based on your available time and needs. Our well-trained staff will gladly provide you with any information you require.

We make it easy for you to board and travel abroad or domestically. We provide the best and clear airfares while also meeting all of your requirements. Because we provide you with detailed information about your airfares, you are free to compare them and choose the one that best suits your needs.</h1>
  <div class="grid-offer text-left grid sm:grid-cols-2 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
    <div class="card bg-gray-800 p-10 relative">
      <div class="circle">
      </div>
      <div class="relative lg:pr-52">
        <h2 class="capitalize text-white mb-4 text-2xl xl:text-3xl font-[Gazeta]">✈ Flight
        Tickets</h2>
        <p class="text-gray-400 font-[Roboto]">We offer hassle-free flight bookings at the best prices.
Find domestic and international flights with flexible options.
</p>
      </div>
      <div class="icon"></div>
    </div>
    <div class="card bg-gray-800 p-10 relative">
      <div class="circle">
      </div>
      <div class="relative lg:pl-48">
        <h2 class="capitalize text-white mb-4 text-2xl xl:text-3xl font-[Gazeta]">🌍 Global
        VISA</h2>
        <p class="text-gray-400 font-[Roboto]">Expert guidance for visa applications to any country.
        Hassle-free documentation and appointment scheduling.</p>
      </div>
    </div>
    <div class="card bg-gray-800 p-10 relative">
      <div class="circle">
      </div>
      <div class="relative lg:pr-44">
        <h2 class="capitalize text-white mb-4 text-2xl xl:text-3xl font-[Gazeta]">🏝 Tour
        Packages</h2>
        <p class="text-gray-400 font-[Roboto]">Customized domestic and international travel packages.
        Affordable, all-inclusive packages for families and solo travelers.
        </p>
      </div>
    </div>
    <div class="card bg-gray-800 p-10 relative">
      <div class="circle">
      </div>
      <div class="relative lg:pl-48">
        <h2 class="capitalize text-white mb-4 text-2xl xl:text-3xl font-[Gazeta]">🛂 Passport
        Services</h2>
        <p class="text-gray-400 font-[Roboto]">Quick and reliable assistance for new passports and renewals.
        Guidance on document submission and appointment booking.</p>
      </div>
    </div>
  </div>
  </section>
    </div>
  )
}

export default ServicesSec
