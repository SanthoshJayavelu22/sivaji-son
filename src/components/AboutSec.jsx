import React, {useEffect} from "react";
import backgroundImage from "../assets/images/slider-3.jpg";
import { Link } from "react-router-dom";
import AOS from "aos";


const AboutSec = () => {

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms
  }, []);

  return (
    <div className="mt-26 bg-gray-50">
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
          About Us
        </h2>
        <h3 className="uppercase text-xl font-semibold leading-tight">
        <Link
                  to="/"
                 
                > <span className="text-white cursor-pointer font-[Roboto]">Home</span></Link>
          <span className="text-white font-[Roboto]"> / </span>
          <span className="text-white font-[Roboto]">About Us</span>
        </h3>
      </section>

      <section className="overflow-hidden bg-gray-50">
        <div className="py-12 md:py-16 lg:py-20">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-5">
              <div className="animate_animated animatefadeInLeftBig animate_delay-1s  max-w-2xl" >
                <h1 className="text-4xl flex gap-3 font-bold text-black sm:text-6xl lg:text-7xl font-[Gazeta]" data-aos="fade-down"
     data-aos-duration="3000">
                  About
                  <div className="relative inline-flex">
                    <span className="absolute inset-x-0 bottom-0 border-b-[20px] border-[var(--primary)]"></span>
                    <h1 className="relative text-4xl font-bold text-black sm:text-6xl lg:text-7xl font-[Gazeta]">
                      Sivaji Son
                    </h1>
                  </div>
                </h1>

                <p className="mt-8 text-base text-gray-600 font-[Roboto] sm:text-xl">
                  Sivaji Son Tours and Travel Pvt Ltd, established in 2016, is a
                  trusted name in the travel industry. We specialize in
                  providing comprehensive travel solutions, ensuring seamless
                  experiences for travel firms, tour operators, and agents.
                </p>

                <p className="mt-4 text-base text-gray-600 font-[Roboto] sm:text-xl">
                  Our innovative platform helps travel businesses leverage the
                  latest technology to enhance operations, offer competitive
                  services, and grow their customer base. With a secure
                  independent trust account and a simplified insurance solution,
                  we make travel business operations smoother and more
                  efficient.
                </p>

                <p className="mt-4 text-base text-gray-600 font-[Roboto] sm:text-xl">
                  We are committed to delivering exceptional travel solutions,
                  empowering businesses to thrive in a rapidly evolving
                  industry.
                </p>

                <a
                  href="#"
                  title="Learn More"
                  className="inline-flex items-center justify-center px-10 py-4 mt-10 text-base font-semibold text-white transition-all duration-200 bg-[var(--primary)] hover:bg-green-900"
                  role="button"
                >
                  Learn More
                </a>
              </div>

              <div className="animate_animated animate_fadeInBottomRight">
                <img
                  className="w-[500px]"
                  src="https://i.pinimg.com/736x/21/fa/96/21fa969b5684e85242e912116a04224b.jpg"
                  alt="Sivaji Son Team"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl  sm:px-6 lg:px-8">
          <div className="grid items-center md:grid-cols-2  md:gap-x-20">
            <div className=" sm:pr-0">
              <div className="relative max-w-7xl mb-12 " data-aos="fade-right"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine">
                <img className="w-[500px]"
                  src="https://i.pinimg.com/736x/f8/e5/01/f8e501a52d9c48aa02264f6a659b11b5.jpg"
                  alt=""
                />
              </div>
            </div>

            <div >
              <h2 className="text-3xl font-bold leading-tight text-black font-[Gazeta] sm:text-4xl lg:text-5xl"  >
                Make a Best World Trip Plans
              </h2>
              <p className="mt-4 text-base  sm:text-xl leading-relaxed font-[Roboto] text-gray-600">
                Vacations are meant to make memories! And a well-planned
                itinerary makes for the vacation of a lifetime. Choose from a
                variety of destinations including picturesque mountains, vibrant
                valleys, majestic monuments, gorgeous cities and adventurous
                trails.
              </p>
              <p className="mt-4  text-base  sm:text-xl leading-relaxed font-[Roboto] text-gray-600">
                Planning your honeymoon or want to on a romantic break? We have
                curated wonderful vacation experiences where you and your
                partner can celebrate your love!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className=" bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mt-10">
          <div className="grid items-center md:grid-cols-2 gap-y-10 md:gap-x-20">
            <div>
              <h2 className="text-3xl font-bold leading-tight font-[Gazeta] text-black sm:text-4xl lg:text-5xl">
                Planning a vacation is an art
              </h2>
              <p className="mt-4 text-base  sm:text-xl leading-relaxed font-[Roboto] text-gray-600">
                Like you, we love vacations. But just the ‘vacation’ part – not
                the researching, planning, booking, and every little detail that
                comes with it. Do you really enjoy researching a hundred
                different travel websites, flipping through travel brochures, or
                calling multiple travel agencies to see if you’re getting a good
                quote?
              </p>
              <p className="mt-4 text-base  sm:text-xl leading-relaxed font-[Roboto] text-gray-600">
                It’s painful! We asked ourselves, “why should planning and
                booking a vacation be so damn hard?” And then we thought of a
                better way
              </p>
            </div>
            <div className=" sm:pr-0">
              <div className="relative max-w-7xl mb-12" data-aos="fade-left"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine">
                <img className="w-[500px]"
                  src="https://i.pinimg.com/736x/f8/e5/01/f8e501a52d9c48aa02264f6a659b11b5.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:mt-10">
          <div className="grid items-center md:grid-cols-2  md:gap-x-20">
            <div className=" sm:pr-0">
              <div className="relative max-w-7xl mb-12" data-aos="fade-right"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine">
                <img className="w-[500px]"
                  src="https://i.pinimg.com/736x/f8/e5/01/f8e501a52d9c48aa02264f6a659b11b5.jpg"
                  alt=""
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold leading-tight font-[Gazeta] text-black sm:text-4xl lg:text-5xl">
                What all will I get in a holiday idea?
              </h2>
              <p className="mt-4 text-base  sm:text-xl leading-relaxed text-gray-600 font-[Roboto] mb-10">
                Once you choose a destination, it will give you complete details
                of all the unique things about that place that must not be
                missed, including most visited local sites, best places to stay
                and all the memorable experiences that you can indulge in. You
                will be given multiple options of hotels, resorts and guest
                houses to choose from depending on your budget.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSec;
