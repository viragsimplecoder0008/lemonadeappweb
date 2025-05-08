
import { Order } from "../types";
import { products } from "./products";

// Add event system to notify when orders change
const orderChangeListeners: (() => void)[] = [];

// Register for order changes
export const subscribeToOrderChanges = (callback: () => void): () => void => {
  orderChangeListeners.push(callback);
  return () => {
    const index = orderChangeListeners.indexOf(callback);
    if (index !== -1) {
      orderChangeListeners.splice(index, 1);
    }
  };
};

// Notify listeners when orders change
const notifyOrderChanges = () => {
  orderChangeListeners.forEach(callback => callback());
};

// Add storage event listener to detect changes from other tabs/devices
window.addEventListener('storage', (event) => {
  if (event.key === 'orders') {
    notifyOrderChanges();
  }
});

// Load orders from localStorage if available
const loadOrdersFromStorage = (): Order[] => {
  const storedOrders = localStorage.getItem('orders');
  return storedOrders ? JSON.parse(storedOrders) : [];
};

// Initialize with stored orders or empty array
export const orders: Order[] = loadOrdersFromStorage();

export const getOrderById = (id: string): Order | undefined => {
  // Always get the latest orders from storage
  const freshOrders = loadOrdersFromStorage();
  return freshOrders.find(order => order.id === id);
};

export const getUserOrders = (): Order[] => {
  // Always get the latest orders from storage
  return loadOrdersFromStorage();
};

// Add a function to add a new order
export const addNewOrder = (order: Order): void => {
  const freshOrders = loadOrdersFromStorage(); // Get latest orders
  freshOrders.unshift(order); // Add to the beginning of the array
  
  // Save to localStorage
  localStorage.setItem('orders', JSON.stringify(freshOrders));
  
  // Update in-memory orders
  orders.length = 0;
  orders.push(...freshOrders);
  
  // Notify listeners
  notifyOrderChanges();
};
