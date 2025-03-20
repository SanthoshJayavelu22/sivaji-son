import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination , Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Jenny Wilson',
    position: 'Project Manager at Microsoft',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-1.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
  {
    name: 'Robert Fox',
    position: 'Founder at Brain.co',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-2.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
  {
    name: 'Kristin Watson',
    position: 'UX Designer at Google',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-3.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
  {
    name: 'Kristin Watson',
    position: 'UX Designer at Google',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-3.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
  {
    name: 'Kristin Watson',
    position: 'UX Designer at Google',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-3.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
  {
    name: 'Kristin Watson',
    position: 'UX Designer at Google',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-3.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
  {
    name: 'Kristin Watson',
    position: 'UX Designer at Google',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-3.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
  {
    name: 'Kristin Watson',
    position: 'UX Designer at Google',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-3.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
  {
    name: 'Kristin Watson',
    position: 'UX Designer at Google',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-3.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
  {
    name: 'Kristin Watson',
    position: 'UX Designer at Google',
    image: 'https://cdn.rareblocks.xyz/collection/celebration/images/testimonials/1/avatar-3.jpg',
    text: '“Amet minim mollit non deserunt ullam co est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat”',
  },
];

const Testimonials = () => {
  return (
    <section className="py-10 bg-gray-100 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-[Gazeta] font-bold leading-tight text-gray-800 sm:text-4xl lg:text-5xl">
            Our Customers<span className="text-[var(--primary)]"> Reviews</span>
          </h2>
        </div>

        <Swiper
       modules={[Autoplay, Pagination]} // Add Autoplay module
       spaceBetween={30}
       slidesPerView={1}
       loop={true} // Enable infinite loop
       autoplay={{ delay: 3000, disableOnInteraction: false }} // Enable autoplay
       breakpoints={{
         768: { slidesPerView: 2 },
         1024: { slidesPerView: 3 },
       }}
          className="mt-8 lg:mt-20"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="overflow-hidden bg-white rounded-md shadow p-8 text-center">
                <div className="relative w-24 h-24 mx-auto">
                  <img className="relative object-cover w-24 h-24 mx-auto rounded-full" src={testimonial.image} alt={testimonial.name} />
                  <div className="absolute top-0 right-0 flex items-center justify-center bg-blue-600 rounded-full w-7 h-7">
                    <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.309 17.708C22.196 15.66 22.006 13.03 22 13V5a1 1 0 0 0-1-1h-6c-1.103 0-2 .897-2 2v7a1 1 0 0 0 1 1h3.078a2.89 2.89 0 0 1-.429 1.396c-.508.801-1.465 1.348-2.846 1.624l-.803.16V20h1c2.783 0 4.906-.771 6.309-2.292z" />
                    </svg>
                  </div>
                </div>
                <blockquote className="mt-7">
                  <p className="text-lg text-gray-600 font-[Roboto]">{testimonial.text}</p>
                </blockquote>
                <p className="text-base font-semibold text-black mt-9 font-[Roboto]">{testimonial.name}</p>
                <p className="mt-1 text-base text-gray-600 font-[Roboto]">{testimonial.position}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;