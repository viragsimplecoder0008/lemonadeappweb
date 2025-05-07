
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Award, Gift, Star, BadgeCheck } from "lucide-react";

const VipPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-[#9b87f5] to-[#D6BCFA] min-h-[calc(100vh-64px)] py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="bg-[#1A1F2C]/90 backdrop-blur-sm text-white rounded-2xl p-8 shadow-xl mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
              <span className="text-[#F2FCE2]">Lemonade</span>{" "}
              <span className="text-[#9b87f5]">VIP</span>
            </h1>
            <p className="text-lg md:text-xl text-center mb-8">
              Elevate your lemonade experience with exclusive benefits!
            </p>
            <div className="text-center">
              <Button className="bg-[#9b87f5] hover:bg-[#8975e8] text-white font-bold text-lg px-8 py-6 rounded-xl">
                Become a VIP Today
              </Button>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Benefit 1 */}
            <div className="bg-[#F2FCE2]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#9b87f5] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#1A1F2C] mb-2">Free Straw</h3>
              <p className="text-center text-[#1A1F2C]/80">
                Enjoy a complimentary straw with every purchase because every sip should be perfect!
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-[#FEF7CD]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#9b87f5] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#1A1F2C] mb-2">Summer Free Lemonade</h3>
              <p className="text-center text-[#1A1F2C]/80">
                Free Lemonade from July 1st to July 22nd – refresh yourself all summer long!
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-[#D6BCFA]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#9b87f5] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#1A1F2C] mb-2">Exclusive Flavors</h3>
              <p className="text-center text-[#1A1F2C]/80">
                Taste unique lemonade blends available only to VIP members!
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-[#F2FCE2]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#9b87f5] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#1A1F2C] mb-2">Free Hoodie</h3>
              <p className="text-center text-[#1A1F2C]/80">
                Get a free hoodie when you sign up between December 2nd and January 2nd – stay cozy in style!
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-[#FEF7CD]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#9b87f5] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BadgeCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#1A1F2C] mb-2">VIP Gift Card</h3>
              <p className="text-center text-[#1A1F2C]/80">
                Use it ANYWHERE for whatever you love!
              </p>
            </div>
          </div>

          {/* Call To Action */}
          <div className="bg-[#1A1F2C]/90 backdrop-blur-sm text-white rounded-2xl p-8 shadow-xl text-center">
            <h2 className="text-3xl font-bold mb-4">Join today and make every sip legendary! 🍹💛</h2>
            <p className="mb-8">Cancel any time!</p>
            <Button className="bg-[#9b87f5] hover:bg-[#8975e8] text-white font-bold text-lg px-8 py-6 rounded-xl">
              Become a VIP Member
            </Button>
            <p className="text-sm mt-4 text-gray-400">*Terms & Conditions Apply</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VipPage;
