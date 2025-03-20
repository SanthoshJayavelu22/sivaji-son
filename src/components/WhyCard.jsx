import React from "react";

const features = [
  {
    bgColor: "bg-blue-100",
    icon: "✨",
    title: "Instant & full refunds",
    subtitle: "with Assured",
  },
  {
    bgColor: "bg-yellow-100",
    icon: "📢",
    title: "Save up to 40%",
    subtitle: "with intelligent fare alerts",
  },
  {
    bgColor: "bg-purple-100",
    icon: "📚",
    title: "Track flight delays,",
    subtitle: "boarding gate & baggage belt",
  },
  {
    bgColor: "bg-orange-100",
    icon: "📱",
    title: "24x7",
    subtitle: "customer support",
  },
  {
    bgColor: "bg-red-100",
    icon: "🔒",
    title: "Lock best prices",
    subtitle: "with price protection",
  },
];

const WhyCards = () => {
  return (
    <div className="relative py-4 px-4 md:px-0 mx-auto max-w-7xl mt-10 mb-10">
      <h1 className="text-black font-[Gazeta] text-xl font-semibold mb-5 text-center lg:text-left">
        Why Book with Sivaji Son?
      </h1>
      <div className="flex flex-col md:flex-row gap-4  sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 ">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex items-center ${feature.bgColor} rounded-lg p-4 shadow-md min-w-[12rem] sm:w-auto hover:scale-110`}
          >
            <div className="text-3xl mr-4">{feature.icon}</div>
            <div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyCards;
