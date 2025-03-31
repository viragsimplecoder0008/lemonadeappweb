
import { Order } from "../types";
import { products } from "./products";

export const orders: Order[] = [
  {
    id: "order-001",
    items: [
      { product: products[0], quantity: 2 },
      { product: products[1], quantity: 1 },
    ],
    totalPrice: 12.47,
    status: "delivered",
    createdAt: "2023-07-15T10:30:00Z",
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "USA"
    }
  },
  {
    id: "order-002",
    items: [
      { product: products[2], quantity: 3 },
      { product: products[4], quantity: 1 },
    ],
    totalPrice: 20.46,
    status: "shipped",
    createdAt: "2023-08-02T14:45:00Z",
    shippingAddress: {
      fullName: "Jane Smith",
      address: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      postalCode: "67890",
      country: "USA"
    }
  },
  {
    id: "order-003",
    items: [
      { product: products[6], quantity: 2 },
      { product: products[5], quantity: 2 },
    ],
    totalPrice: 20.16,
    status: "processing",
    createdAt: "2023-08-15T09:20:00Z",
    shippingAddress: {
      fullName: "Alice Johnson",
      address: "789 Pine Blvd",
      city: "Elsewhere",
      state: "TX",
      postalCode: "54321",
      country: "USA"
    }
  }
];

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};

export const getUserOrders = (): Order[] => {
  // In a real app, this would filter by user ID
  return orders;
};
