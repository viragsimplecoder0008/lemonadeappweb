
import React from "react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ProductBanner from "@/components/home/ProductBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoriesSection from "@/components/home/CategoriesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <ProductBanner />
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default HomePage;
