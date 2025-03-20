import React from 'react'

import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'
import OfferCards from '../components/OffersCards'

import WhyCard from '../components/WhyCard'
import Testimonials from '../components/Testimonials'

const Home = () => {
  return (
    <>
      
          <Hero/>
      
          <div className='bg-gray-50'>
          <SearchBar/>
          <OfferCards/>
          <WhyCard/>
          <Testimonials/>
          
          </div>
      
       
    </>
  )
}

export default Home
