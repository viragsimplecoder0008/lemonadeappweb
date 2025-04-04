
import React from "react";

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">What Our Customers Say</h2>
          <p className="mt-2 text-gray-600">Don't just take our word for it</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-1 mb-4 text-lemonade-yellow">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.585l-7.07 3.716 1.35-7.874L.36 7.088l7.899-1.147L10 0l2.739 5.942 7.9 1.147-4.92 4.339 1.35 7.874z"
                  />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              "The mint lemonade is absolutely refreshing. It's my go-to drink during summer months!"
            </p>
            <p className="font-semibold">— Sarah J.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-1 mb-4 text-lemonade-yellow">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.585l-7.07 3.716 1.35-7.874L.36 7.088l7.899-1.147L10 0l2.739 5.942 7.9 1.147-4.92 4.339 1.35 7.874z"
                  />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              "I tried the Jaljeera lemonade and was blown away by the complexity of flavors. Absolutely delicious!"
            </p>
            <p className="font-semibold">— Michael T.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-1 mb-4 text-lemonade-yellow">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.585l-7.07 3.716 1.35-7.874L.36 7.088l7.899-1.147L10 0l2.739 5.942 7.9 1.147-4.92 4.339 1.35 7.874z"
                  />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              "Fast shipping and the lemonades arrived perfectly packaged. The rose lemonade is my new favorite drink!"
            </p>
            <p className="font-semibold">— Emily R.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
