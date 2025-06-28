import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, HelpCircle, Users, Mail } from "lucide-react";
const CommunityHelp: React.FC = () => {
  return <section className="bg-lemonade-light py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Community & Help</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our community of lemonade enthusiasts or get support when you need it. 
            We're here to make your experience refreshingly simple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:translate-y-[-5px]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-lemonade-yellow mb-4">
              <Users className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Join Our Community</h3>
            <p className="text-gray-600 mb-4">
              Connect with other lemonade lovers and share your favorite recipes and experiences.
            </p>
            <Link to="/community" className="text-lemonade-blue font-medium hover:text-lemonade-green transition-colors">
              Join Now →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:translate-y-[-5px]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-lemonade-yellow mb-4">
              <HelpCircle className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">FAQs</h3>
            <p className="text-gray-600 mb-4">
              Find answers to commonly asked questions about our products, shipping, and more.
            </p>
            <Link to="#" className="text-lemonade-blue font-medium hover:text-lemonade-green transition-colors">
              View FAQs →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:translate-y-[-5px]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-lemonade-yellow mb-4">
              <MessageSquare className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">
              Need immediate assistance? Chat with our customer support team in real-time.
            </p>
            <Link to="#" className="text-lemonade-blue font-medium hover:text-lemonade-green transition-colors">
              Start Chat →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:translate-y-[-5px]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-lemonade-yellow mb-4">
              <Mail className="h-7 w-7 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p className="text-gray-600 mb-4">
              Have a specific question? Send us an email and we'll get back to you as soon as possible.
            </p>
            <Link to="#" className="text-lemonade-blue font-medium hover:text-lemonade-green transition-colors">
              Email Us →
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default CommunityHelp;