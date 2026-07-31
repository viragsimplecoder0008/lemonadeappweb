import React, { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Trash2, CheckCircle2 } from "lucide-react";
import { getProductById, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductQuantity from "@/components/products/ProductQuantity";
import ProductCard from "@/components/products/ProductCard";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const isMonsoon = location.pathname.includes("/monsoon");
  const backLink = isMonsoon ? "/monsoon-winter" : "/products";
  const { cartItems, addQuantityToCart, removeQuantityFromCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Bulk order dialog state
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isBulkOrder, setIsBulkOrder] = useState(false);

  // Item removal state on the product page
  const [removeAmount, setRemoveAmount] = useState(1);
  
  const product = productId ? getProductById(productId) : null;
  const inCartItem = product ? cartItems.find((item) => item.product.id === product.id) : null;
  
  // Get related products (products in the same category, excluding current product)
  const relatedProducts = product
    ? products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];
  
  // Fallback image function with dynamic placeholder based on product name
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (product) {
      e.currentTarget.src = `https://source.unsplash.com/600x600/?lemonade,${product.name.toLowerCase()}`;
    }
  };

  const handleOpenAddToCart = () => {
    setIsBulkOrder(false);
    setIsBulkDialogOpen(true);
  };

  const handleConfirmAddToCart = () => {
    if (!product) return;
    const qty = Math.max(1, quantity);
    if (!isBulkOrder && qty > 5) {
      toast.error(`If not planning a Bulk Order, you can only get 5 ${product.name}s.`);
      return;
    }
    addQuantityToCart(product, qty, isBulkOrder);
    setIsBulkDialogOpen(false);
  };

  const handleRemoveItems = () => {
    if (!product || !inCartItem) return;
    removeQuantityFromCart(product.id, removeAmount);
    setRemoveAmount(1);
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
          <Link to={backLink} className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {isMonsoon ? "Monsoon / Winter" : "Products"}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden border">
            <img
              src={product.imageUrl || `https://source.unsplash.com/600x600/?lemonade,${product.name.toLowerCase()}`}
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
                  ₹{product.price.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <div className="mb-2">
                <label className="block text-sm font-medium mb-2">
                  Quantity {isBulkOrder ? "(Bulk Order)" : "(Max: 5 without Bulk Order)"}
                </label>
                <ProductQuantity
                  quantity={quantity}
                  onChange={(newQty) => {
                    if (!isBulkOrder && newQty > 5) {
                      toast.error(`Without a Bulk Order, you can only get 5 ${product.name}s.`);
                      setQuantity(5);
                    } else {
                      setQuantity(newQty);
                    }
                  }}
                />
              </div>
              
              <Button 
                className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black font-semibold py-6 text-base"
                onClick={handleOpenAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              {/* Remove from Cart section on Product Page */}
              {inCartItem && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-red-950 text-sm">
                      Currently in Cart: {inCartItem.quantity} {product.name}(s)
                    </span>
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      Total ₹{(inCartItem.quantity * product.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-red-900">
                    Remove this(ese) Item(s) from Cart? Specify the amount of these Item(s) you want to remove:
                  </p>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={1}
                      max={inCartItem.quantity}
                      value={removeAmount}
                      onChange={(e) => setRemoveAmount(Math.max(1, Math.min(inCartItem.quantity, parseInt(e.target.value) || 1)))}
                      className="w-28 bg-white border-red-300"
                      placeholder="Amount"
                    />
                    <Button
                      variant="destructive"
                      className="flex-1 font-semibold"
                      onClick={handleRemoveItems}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove ({removeAmount}) Item(s)
                    </Button>
                  </div>
                </div>
              )}
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

        {/* Bulk Order Prompt Dialog */}
        <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add {product.name} to Cart</DialogTitle>
              <DialogDescription className="text-foreground/90 font-medium mt-1">
                Are you planning a Bulk Order? Specify the number. If not, you can only get 5 {product.name}s.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="space-y-0.5">
                  <Label className="font-semibold text-amber-900 cursor-pointer" htmlFor="bulk-detail">
                    Planning a Bulk Order?
                  </Label>
                  <p className="text-xs text-amber-700">Enable to order more than 5 items.</p>
                </div>
                <input
                  id="bulk-detail"
                  type="checkbox"
                  checked={isBulkOrder}
                  onChange={(e) => {
                    setIsBulkOrder(e.target.checked);
                    if (!e.target.checked && quantity > 5) {
                      setQuantity(5);
                    }
                  }}
                  className="h-5 w-5 rounded border-amber-300 text-lemonade-yellow focus:ring-lemonade-yellow cursor-pointer"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">
                  Specify Quantity {isBulkOrder ? "(Bulk Order - Any Amount below 50 Items)" : "(Max 5 without Bulk Order)"}
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={isBulkOrder ? 50 : 5}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    if (!isBulkOrder && val > 5) {
                      setQuantity(5);
                    } else if (isBulkOrder && val > 50) {
                      setQuantity(50);
                      toast.error("Bulk Orders are limited to any amount below 50 items.");
                    } else {
                      setQuantity(Math.max(1, val));
                    }
                  }}
                  className="mt-1"
                />
                {!isBulkOrder && quantity >= 5 && (
                  <p className="text-xs text-amber-600 mt-1">
                    Reached limit of 5. Check "Planning a Bulk Order?" to order up to 50 items.
                  </p>
                )}
                {isBulkOrder && (
                  <p className="text-xs text-amber-700 mt-1 font-medium">
                    Bulk Order limit: up to 50 items.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmAddToCart} className="bg-lemonade-yellow hover:bg-lemonade-green text-black font-semibold">
                Confirm & Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
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
