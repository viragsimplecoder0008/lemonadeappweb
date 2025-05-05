
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(products);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim() === "") {
      setSearchResults(products);
      return;
    }
    
    const results = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Search Products</h1>
        
        <form onSubmit={handleSearch} className="mb-8 max-w-xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-grow relative">
              <Input
                type="text"
                placeholder="Search for lemonade products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10"
              />
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button type="submit" className="bg-lemonade-yellow text-black hover:bg-lemonade-green">
              Search
            </Button>
          </div>
        </form>
        
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">No products found</h2>
            <p className="text-gray-500">Try another search term or browse our categories</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
