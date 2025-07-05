
import { Order } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

// Generate shorter order IDs
const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${timestamp}-${random}`.toUpperCase();
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      return null;
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return null;
    }

    // Convert database format to Order type
    const order: Order = {
      id: orderData.id,
      totalPrice: Number(orderData.total_price),
      status: orderData.status as Order['status'],
      createdAt: orderData.created_at,
      isQuickMode: orderData.is_quick_mode || false,
      paymentMethod: orderData.payment_method as Order['paymentMethod'],
      shippingAddress: {
        fullName: orderData.shipping_full_name,
        address: orderData.shipping_address,
        city: orderData.shipping_city,
        state: orderData.shipping_state,
        postalCode: orderData.shipping_postal_code,
        country: orderData.shipping_country,
        email: orderData.shipping_email || '',
        phoneNumber: orderData.shipping_phone_number,
      },
      items: itemsData.map(item => ({
        quantity: item.quantity,
        product: {
          id: item.product_id,
          name: item.product_name,
          description: item.product_description || '',
          price: Number(item.product_price),
          imageUrl: item.product_image_url || undefined,
          category: item.product_category,
          inStock: true,
        }
      }))
    };

    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return [];
    }

    // Fetch items for all orders
    const orderIds = ordersData.map(order => order.id);
    if (orderIds.length === 0) return [];

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return [];
    }

    // Group items by order_id
    const itemsByOrderId = itemsData.reduce((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    }, {} as Record<string, typeof itemsData>);

    // Convert database format to Order type
    const orders: Order[] = ordersData.map(orderData => ({
      id: orderData.id,
      totalPrice: Number(orderData.total_price),
      status: orderData.status as Order['status'],
      createdAt: orderData.created_at,
      isQuickMode: orderData.is_quick_mode || false,
      paymentMethod: orderData.payment_method as Order['paymentMethod'],
      shippingAddress: {
        fullName: orderData.shipping_full_name,
        address: orderData.shipping_address,
        city: orderData.shipping_city,
        state: orderData.shipping_state,
        postalCode: orderData.shipping_postal_code,
        country: orderData.shipping_country,
        email: orderData.shipping_email || '',
        phoneNumber: orderData.shipping_phone_number,
      },
      items: (itemsByOrderId[orderData.id] || []).map(item => ({
        quantity: item.quantity,
        product: {
          id: item.product_id,
          name: item.product_name,
          description: item.product_description || '',
          price: Number(item.product_price),
          imageUrl: item.product_image_url || undefined,
          category: item.product_category,
          inStock: true,
        }
      }))
    }));

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Add a function to add a new order
export const addNewOrder = async (order: Omit<Order, 'id'>): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please log in to place an order');
      return null;
    }

    const orderId = generateOrderId();

    // Insert order
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: user.id,
        total_price: order.totalPrice,
        status: order.status,
        is_quick_mode: order.isQuickMode || false,
        payment_method: order.paymentMethod,
        shipping_full_name: order.shippingAddress.fullName,
        shipping_address: order.shippingAddress.address,
        shipping_city: order.shippingAddress.city,
        shipping_state: order.shippingAddress.state,
        shipping_postal_code: order.shippingAddress.postalCode,
        shipping_country: order.shippingAddress.country,
        shipping_email: order.shippingAddress.email || null,
        shipping_phone_number: order.shippingAddress.phoneNumber,
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
      toast.error('Failed to create order');
      return null;
    }

    // Insert order items
    const orderItems = order.items.map(item => ({
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      product_description: item.product.description,
      product_price: item.product.price,
      product_image_url: item.product.imageUrl,
      product_category: item.product.category,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Try to cleanup the order if items failed
      await supabase.from('orders').delete().eq('id', orderId);
      toast.error('Failed to create order items');
      return null;
    }

    // Notify listeners
    notifyOrderChanges();
    return orderId;
  } catch (error) {
    console.error('Error adding order:', error);
    toast.error('Failed to place order');
    return null;
  }
};
