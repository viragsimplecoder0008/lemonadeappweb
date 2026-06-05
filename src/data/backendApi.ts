import { Order } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Function to fetch orders from our backend API (auth required)
export const getOrdersFromBackend = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase.functions.invoke("get-orders", {
      method: "GET",
    });

    if (error) {
      console.error("Frontend: Backend API error:", error);
      toast.error("Failed to fetch orders");
      return [];
    }

    return (data?.orders as Order[]) || [];
  } catch (error) {
    console.error("Frontend: Error calling backend API:", error);
    toast.error("Failed to connect to backend service");
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
  orderChangeListeners.forEach((callback) => callback());
};
