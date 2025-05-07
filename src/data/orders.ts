
import { Order } from "../types";
import { products } from "./products";

// Load orders from localStorage if available
const loadOrdersFromStorage = (): Order[] => {
  const storedOrders = localStorage.getItem('orders');
  return storedOrders ? JSON.parse(storedOrders) : [];
};

// Initialize with stored orders or empty array
export const orders: Order[] = loadOrdersFromStorage();

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
  
  // Save to localStorage
  localStorage.setItem('orders', JSON.stringify(orders));
};
