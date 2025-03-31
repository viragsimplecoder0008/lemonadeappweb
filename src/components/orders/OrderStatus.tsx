
import React from "react";
import { Order } from "@/types";
import { Check, Clock, Package, Truck } from "lucide-react";

interface OrderStatusProps {
  order: Order;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ order }) => {
  const getStatusStep = () => {
    switch (order.status) {
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      default:
        return 1;
    }
  };

  const statusStep = getStatusStep();

  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-4">Order Status</h2>
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 transform -translate-y-1/2"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-lemonade-yellow transform -translate-y-1/2"
          style={{ width: `${((statusStep - 1) / 3) * 100}%` }}
        ></div>

        {/* Status steps */}
        <div className="relative flex justify-between">
          <div className="flex flex-col items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              statusStep >= 1 ? "bg-lemonade-yellow" : "bg-gray-200"
            }`}>
              {statusStep > 1 ? (
                <Check className="h-5 w-5 text-black" />
              ) : (
                <Clock className="h-5 w-5 text-black" />
              )}
            </div>
            <span className="mt-2 text-sm font-medium">Pending</span>
          </div>

          <div className="flex flex-col items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              statusStep >= 2 ? "bg-lemonade-yellow" : "bg-gray-200"
            }`}>
              {statusStep > 2 ? (
                <Check className="h-5 w-5 text-black" />
              ) : (
                <Package className="h-5 w-5 text-black" />
              )}
            </div>
            <span className="mt-2 text-sm font-medium">Processing</span>
          </div>

          <div className="flex flex-col items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              statusStep >= 3 ? "bg-lemonade-yellow" : "bg-gray-200"
            }`}>
              {statusStep > 3 ? (
                <Check className="h-5 w-5 text-black" />
              ) : (
                <Truck className="h-5 w-5 text-black" />
              )}
            </div>
            <span className="mt-2 text-sm font-medium">Shipped</span>
          </div>

          <div className="flex flex-col items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              statusStep >= 4 ? "bg-lemonade-yellow" : "bg-gray-200"
            }`}>
              <Check className="h-5 w-5 text-black" />
            </div>
            <span className="mt-2 text-sm font-medium">Delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
