import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { ShippingAddress } from "@/types";
import { toast } from "sonner";
import { addNewOrder } from "@/data/orders";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface CheckoutFormProps {
  onOrderComplete: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onOrderComplete }) => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    email: "",
    phoneNumber: "",
  });

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cartItems,
        totalPrice: getTotalPrice(),
        shippingAddress,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        paymentMethod,
        isQuickMode: false,
      };

      const orderId = await addNewOrder(orderData);
      
      if (orderId) {
        clearCart();
        toast.success("Order placed successfully!");
        onOrderComplete(orderId);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={shippingAddress.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={shippingAddress.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={shippingAddress.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={shippingAddress.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={shippingAddress.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={shippingAddress.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={shippingAddress.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          required
        />
      </div>

      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={setPaymentMethod}
      />

      <Button 
        type="submit" 
        className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : `Place Order - ₹${getTotalPrice().toFixed(2)}`}
      </Button>
    </form>
  );
};

export default CheckoutForm;
