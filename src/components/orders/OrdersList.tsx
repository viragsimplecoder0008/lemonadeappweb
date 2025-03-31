
import React from "react";
import { Link } from "react-router-dom";
import { Order } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface OrdersListProps {
  orders: Order[];
}

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      </div>
    );
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          to={`/orders/${order.id}`}
          key={order.id}
          className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Order #{order.id}</h3>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(order.createdAt), "MMMM d, yyyy")}
              </p>
              <p className="text-sm mt-2">
                {order.items.length} {order.items.length === 1 ? "item" : "items"} - ₹{order.totalPrice.toFixed(2)}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrdersList;
