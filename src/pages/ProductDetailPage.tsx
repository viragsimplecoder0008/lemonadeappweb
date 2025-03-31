
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { getProductById, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductQuantity from "@/components/products/ProductQuantity";
import ProductCard from "@/components/products/ProductCard";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = productId ? getProductById(productId) : null;
  
  // Get related products (products in the same category, excluding current product)
  const relatedProducts = product
    ? products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];
  
  // Fallback image function
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://via.placeholder.com/500x500?text=Lemonade";
  };
  
  const handleAddToCart = () => {
    if (product) {
      // Add to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setQuantity(1);
    }
  };
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden border">
            <img
              src={product.imageUrl || "https://via.placeholder.com/500x500?text=Lemonade"}
              alt={product.name}
              className="w-full h-auto object-cover"
              onError={handleImageError}
            />
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center">
                <span className="font-bold text-2xl text-lemonade-dark">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
            
            <div className="pt-4 border-t">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Quantity (Max: 5)
                </label>
                <ProductQuantity
                  quantity={quantity}
                  onChange={setQuantity}
                />
              </div>
              
              <Button 
                className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Product Details</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</li>
                <li>Made with natural ingredients</li>
                <li>No artificial sweeteners</li>
                <li>Refrigerate after opening</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
