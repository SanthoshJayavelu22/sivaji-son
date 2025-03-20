import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import sliderimg1 from '../assets/images/slider-1.jpg';
import sliderimg2 from '../assets/images/slider-2.jpg';
import sliderimg3 from '../assets/images/slider-3.jpg';

const Hero = () => {
  return (
    <div className="mt-26">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000, // Auto-slide every 3 seconds
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="relative h-56 md:h-96 ">
            <img
              src={sliderimg1}
              className="absolute block w-full h-full object-cover "
           
              alt="Slide 1"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
              <h2 className="text-4xl font-bold font-[Gazeta]">Welcome to Our Website</h2>
              <p className="text-xl mt-4 font-[Gazeta]">Discover amazing features and services.</p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="relative h-56 md:h-96">
            <img
              src={sliderimg2}
              className="absolute block w-full h-full object-cover"
              alt="Slide 2"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
              <h2 className="text-4xl font-bold font-[Gazeta]">Explore New Horizons</h2>
              <p className="text-xl mt-4 font-[Gazeta]">Join us on an exciting journey.</p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="relative h-56 md:h-96">
            <img
              src={sliderimg3}
              className="absolute block w-full h-full object-cover"
              alt="Slide 3"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
              <h2 className="text-4xl font-bold font-[Gazeta]">Your Adventure Awaits</h2>
              <p className="text-xl mt-4 font-[Gazeta]">Start your journey with us today.</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Hero;