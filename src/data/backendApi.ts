
import { Order } from "@/types";
import { toast } from "sonner";

const BACKEND_API_URL = 'https://uuainsdbkdpunvqqlzfy.supabase.co/functions/v1/get-orders';

// Function to fetch orders from our backend API
export const getOrdersFromBackend = async (): Promise<Order[]> => {
  try {
    console.log('Frontend: Requesting orders from backend API...');
    
    const response = await fetch(BACKEND_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YWluc2Ria2RwdW52cXFsemZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjkxOTksImV4cCI6MjA1OTAwNTE5OX0.9ezvAaSNhvL_DjMjX-2NRLOlzcHJBZAAsIQYMzpBjZg'}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Frontend: Backend API error:', errorData);
      toast.error('Failed to fetch orders from backend');
      return [];
    }

    const data = await response.json();
    console.log(`Frontend: Received ${data.orders?.length || 0} orders from backend`);
    
    return data.orders || [];
  } catch (error) {
    console.error('Frontend: Error calling backend API:', error);
    toast.error('Failed to connect to backend service');
    return [];
  }
};

// Event system for order changes (kept for compatibility)
const orderChangeListeners: (() => void)[] = [];

export const subscribeToOrderChanges = (callback: () => void): () => void => {
  orderChangeListeners.push(callback);
  return () => {
    const index = orderChangeListeners.indexOf(callback);
    if (index !== -1) {
      orderChangeListeners.splice(index, 1);
    }
  };
};

export const notifyOrderChanges = () => {
  orderChangeListeners.forEach(callback => callback());
};
