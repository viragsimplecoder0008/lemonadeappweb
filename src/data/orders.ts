
import { Order } from "../types";
import { products } from "./products";

// Empty orders array since we want orders to be added dynamically
export const orders: Order[] = [];

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};

export const getUserOrders = (): Order[] => {
  // In a real app, this would filter by user ID
  return orders;
};

// Add a function to add a new order
export const addNewOrder = (order: Order): void => {
  orders.unshift(order); // Add to the beginning of the array
};
