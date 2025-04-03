import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";

const CheckoutForm: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, getTotalPrice } = useCart(); // Ensure getTotalPrice is destructured
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    phoneNumber: "",
    deliveryNote: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate order ID
      const orderId = `order-${Math.floor(Math.random() * 10000)}`;
      
      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-order-email', {
        body: {
          orderId,
          items: cartItems,
          totalPrice: getTotalPrice(), // Use the method from CartContext
          customerInfo: {
            fullName: formData.fullName,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode
          }
        }
      });

      if (emailError) {
        console.error("Error sending order email:", emailError);
        // Continue with order processing even if email fails
      }
      
      // In a real app, we would save the order to a database here
      clearCart();
      
      toast("Order placed successfully!", {
        description: "You will receive a confirmation email shortly."
      });
      
      // Redirect to order success page
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("There was a problem processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Required for delivery coordination"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Shipping Address</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryNote">Delivery Instructions (Optional)</Label>
            <Input
              id="deliveryNote"
              name="deliveryNote"
              value={formData.deliveryNote}
              onChange={handleChange}
              placeholder="Additional instructions for delivery"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Method</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <RadioGroup defaultValue="cod" className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" checked />
              <Label htmlFor="cod" className="font-medium">Cash on Delivery</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-2">
            You will pay in cash when the order is delivered to your address.
          </p>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Order"
        )}
      </Button>
    </form>
  );
};

export default CheckoutForm;
