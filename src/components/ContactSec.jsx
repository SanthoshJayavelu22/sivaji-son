import React, { useState } from "react";

const ContactSec = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [company, setCompany] = useState("");
    const [message, setMessage] = useState("");

    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!name.trim()) tempErrors.name = "Name is required";
        if (!email.trim()) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors.email = "Invalid email format";
        }
        if (!number.trim()) {
            tempErrors.number = "Phone number is required";
        } else if (!/^\d{10}$/.test(number)) {
            tempErrors.number = "Invalid phone number (10 digits required)";
        }
        if (!company.trim()) tempErrors.company = "Company name is required";
        if (!message.trim()) tempErrors.message = "Message cannot be empty";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            alert("Form submitted successfully!");
            setName("");
            setEmail("");
            setNumber("");
            setCompany("");
            setMessage("");
            setErrors({});
        }
    };

    return (
        <section className="py-10 bg-gray-100 sm:py-16 lg:py-24 mt-26 md:mt-10">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold leading-tight text-[var(--primary)] sm:text-4xl lg:text-5xl font-[Gazeta]">Contact us</h2>
                    <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-500 font-[Roboto]">Feel free to reach out to us with any questions or inquiries.</p>
                </div>

                <div className="max-w-5xl mx-auto mt-12 sm:mt-16">
                <div class="grid grid-cols-1 gap-6 px-8 text-center md:px-0 md:grid-cols-3">
                <div class="group overflow-hidden bg-white hover:bg-[var(--primary)] hover:scale-105 rounded-xl transition-all duration-500">
    <div class="p-6">
        <svg class="flex-shrink-0 w-10 h-10 mx-auto text-[var(--primary)] group-hover:text-white group-hover:scale-125" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
        </svg>
        <p class="mt-6 text-lg font-medium font-[Roboto] text-gray-900 group-hover:text-white">+91 96551 50814</p>
        <p class="mt-1 text-lg font-medium font-[Roboto] text-gray-900 group-hover:text-white">+91 98848 98878</p>
    </div>
</div>


                <div class="group overflow-hidden bg-white hover:bg-[var(--primary)] hover:scale-105 rounded-xl transition-all duration-500">
                    <div class="p-6">
                        <svg class="flex-shrink-0 w-10 h-10 mx-auto text-[var(--primary)] group-hover:text-white group-hover:scale-125" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p class="mt-6 text-lg font-medium text-gray-900 group-hover:text-white font-[Roboto]">Saranraj@sivajison.com</p>
                       
                    </div>
                </div>

                <div class="group overflow-hidden bg-white hover:bg-[var(--primary)] hover:scale-105 rounded-xl transition-all duration-500">
                    <div class="p-6">
                        <svg class="flex-shrink-0 w-10 h-10 mx-auto text-[var(--primary)] group-hover:text-white group-hover:scale-125" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p class="mt-6 text-lg font-medium leading-relaxed text-gray-900 group-hover:text-white font-[Roboto]">VSD Plaza, No 1, 2nd Ave, AA Block, Anna Nagar,
                        Chennai, Tamil Nadu 600040</p>
                    </div>
                </div>
            </div>
                    <div className="mt-6 overflow-hidden bg-white rounded-xl">
                        <div className="px-6 py-12 sm:p-12">
                            <h3 className="text-3xl font-semibold text-center text-[var(--primary)] font-[Gazeta]">Send us a message</h3>

                            <form onSubmit={handleSubmit} className="mt-14">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                                    <div>
                                        <label className="text-base font-medium text-gray-900 font-[Roboto]">Your name</label>
                                        <div className="mt-2.5 relative">
                                            <input
                                                type="text"
                                                placeholder="Enter your full name"
                                                className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border rounded-md focus:outline-none ${
                                                    errors.name ? "border-red-500" : "border-gray-200 focus:border-blue-600"
                                                }`}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-base font-medium text-gray-900 font-[Roboto]">Email address</label>
                                        <div className="mt-2.5 relative">
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border rounded-md focus:outline-none ${
                                                    errors.email ? "border-red-500" : "border-gray-200 focus:border-blue-600"
                                                }`}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-base font-medium text-gray-900 font-[Roboto]">Phone number</label>
                                        <div className="mt-2.5 relative">
                                            <input
                                                type="tel"
                                                placeholder="Enter your phone number"
                                                className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border rounded-md focus:outline-none ${
                                                    errors.number ? "border-red-500" : "border-gray-200 focus:border-blue-600"
                                                }`}
                                                value={number}
                                                onChange={(e) => setNumber(e.target.value)}
                                            />
                                            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-base font-medium text-gray-900 font-[Roboto]">Company name</label>
                                        <div className="mt-2.5 relative">
                                            <input
                                                type="text"
                                                placeholder="Enter your company name"
                                                className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border rounded-md focus:outline-none ${
                                                    errors.company ? "border-red-500" : "border-gray-200 focus:border-blue-600"
                                                }`}
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                            />
                                            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-base font-medium text-gray-900 font-[Roboto]">Message</label>
                                        <div className="mt-2.5 relative">
                                            <textarea
                                                placeholder="Enter your message"
                                                className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border rounded-md resize-y focus:outline-none ${
                                                    errors.message ? "border-red-500" : "border-gray-200 focus:border-blue-600"
                                                }`}
                                                rows="4"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            ></textarea>
                                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center w-full px-4 py-4 mt-2 font-[Roboto] text-base font-semibold text-white transition-all duration-200 bg-[var(--primary)] border border-transparent rounded-md focus:outline-none hover:bg-green-900 focus:bg-blue-700"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSec;