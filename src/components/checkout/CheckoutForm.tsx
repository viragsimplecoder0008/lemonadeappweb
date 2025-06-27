
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addNewOrder } from "@/data/orders";
import { ShippingAddress, Order } from "@/types";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import PaymentMethodSelector from "./PaymentMethodSelector";

const CheckoutForm: React.FC = () => {
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("cash");
  
  // Check if user is in quick mode
  const [searchParams] = useSearchParams();
  const isQuickMode = searchParams.get("quick") === "true";

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    email: "",
    phoneNumber: "",
  });

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['fullName', 'address', 'city', 'state', 'postalCode', 'email', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field as keyof ShippingAddress]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      if (paymentMethod === "online") {
        // TODO: Implement online payment processing
        toast.error("Online payment is not yet implemented");
        setIsLoading(false);
        return;
      }

      // Create order for cash payment
      const orderId = `ORD-${Date.now()}`;
      const totalPrice = getTotalPrice();
      const order: Order = {
        id: orderId,
        items: cartItems,
        totalPrice,
        shippingAddress,
        status: "pending",
        createdAt: new Date().toISOString(),
        isQuickMode: isQuickMode,
        paymentMethod: paymentMethod
      };

      // Add order to storage
      addNewOrder(order);
      
      // Clear cart and redirect
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="space-y-6">
      <PaymentMethodSelector 
        selectedMethod={paymentMethod}
        onMethodChange={setPaymentMethod}
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={shippingAddress.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={shippingAddress.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={shippingAddress.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            value={shippingAddress.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={shippingAddress.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={shippingAddress.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={shippingAddress.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={shippingAddress.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            disabled
          />
        </div>

        <Button 
          type="submit"
          className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black"
          disabled={cartItems.length === 0 || isLoading}
        >
          {paymentMethod === "online" ? "Proceed to Payment" : "Place Order"} - ${totalPrice.toFixed(2)}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
