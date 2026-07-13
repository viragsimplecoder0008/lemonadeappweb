import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ showCheckoutButton = true }) => {
  const { subtotal, totalItems } = useCart();
  const [code, setCode] = useState("");
  const [discountPct, setDiscountPct] = useState<number>(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  // Restore any applied coupon
  useEffect(() => {
    const saved = localStorage.getItem("appliedCoupon");
    if (saved) {
      try {
        const c = JSON.parse(saved);
        setAppliedCode(c.code);
        setDiscountPct(c.discount_percent);
      } catch {}
    }
  }, []);

  const applyCoupon = async () => {
    if (!code.trim()) return;
    const { data, error } = await supabase
      .from("coupons")
      .select("code, discount_percent, expires_at, active")
      .eq("code", code.trim().toUpperCase())
      .eq("active", true)
      .maybeSingle();

    if (error || !data) {
      toast.error("Invalid coupon code");
      return;
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      toast.error("This coupon has expired");
      return;
    }
    setAppliedCode(data.code);
    setDiscountPct(data.discount_percent);
    localStorage.setItem("appliedCoupon", JSON.stringify(data));
    toast.success(`Applied ${data.discount_percent}% off with ${data.code}`);
  };

  const removeCoupon = () => {
    setAppliedCode(null);
    setDiscountPct(0);
    setCode("");
    localStorage.removeItem("appliedCoupon");
  };

  const discount = subtotal * (discountPct / 100);
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.1;
  const shipping = discountedSubtotal > 50 ? 0 : 5.99;
  const total = discountedSubtotal + tax + shipping;

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <h2 className="font-semibold text-lg">Order Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} items)</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discountPct > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon ({appliedCode}) −{discountPct}%</span>
            <span>−₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax (10%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t">
        {appliedCode ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700">✓ {appliedCode} applied</span>
            <button className="text-red-600 underline" onClick={removeCoupon}>Remove</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <Button variant="outline" onClick={applyCoupon}>Apply</Button>
          </div>
        )}
      </div>

      {showCheckoutButton && (
        <Button asChild className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black">
          <Link to="/checkout">Proceed to Checkout</Link>
        </Button>
      )}
    </div>
  );
};

export default CartSummary;
