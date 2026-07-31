import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/data/orders";
import { Order } from "@/types";

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then((fetchedOrder) => {
        setOrder(fetchedOrder);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const customerName = order?.shippingAddress?.fullName || "Valued Customer";
  const totalPrice = order?.totalPrice || 0;
  const items = order?.items || [];
  
  // Calculate subtotal and discounts
  const subtotal = items.length > 0 
    ? items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
    : totalPrice;
  const couponDiscount = Math.max(0, subtotal - totalPrice);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h6 className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center mb-4">
            If you didn't get a bill, then your order is free!
          </h6>

          {/* Receipt Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-2xl font-mono text-sm text-slate-900 dark:text-slate-100">
            {/* Header: ORDER by: [Name] [Total amount] */}
            <div className="flex justify-between items-center font-bold text-base border-b pb-3 mb-4 border-slate-200 dark:border-slate-700">
              <span className="truncate max-w-[65%]">ORDER by: {customerName}</span>
              <span className="text-lemonade-dark dark:text-lemonade-yellow">₹{totalPrice.toFixed(2)}</span>
            </div>

            {/* Product List */}
            <div className="space-y-2 mb-4">
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="truncate max-w-[70%]">
                      {item.product.name} {item.quantity > 1 ? `x${item.quantity}` : ""}
                    </span>
                    <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center">
                  <span>Lemonade Selection</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Divider line */}
            <div className="border-t border-dashed border-slate-400 dark:border-slate-600 my-4" />

            {/* Totals */}
            <div className="space-y-1 mb-4 text-xs md:text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer text */}
            <p className="text-center font-sans font-semibold text-xs md:text-sm text-slate-700 dark:text-slate-300 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              Thank you for ordering at Lemonade! Come again!
            </p>

            {/* Continue Button */}
            <Button
              asChild
              className="w-full mt-6 bg-lemonade-yellow hover:bg-lemonade-green text-slate-950 font-bold py-6 text-base hover:scale-105 active:scale-95 transition-all duration-200 shadow-md font-sans"
            >
              <Link to="/products">Continue</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccessPage;
