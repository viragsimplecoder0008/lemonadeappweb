
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/auth" 
                element={session ? <Navigate to="/" replace /> : <AuthPage />} 
              />
              <Route 
                path="/" 
                element={!session ? <Navigate to="/auth" replace /> : <HomePage />} 
              />
              <Route 
                path="/products" 
                element={!session ? <Navigate to="/auth" replace /> : <ProductsPage />} 
              />
              <Route 
                path="/products/:productId" 
                element={!session ? <Navigate to="/auth" replace /> : <ProductDetailPage />} 
              />
              <Route 
                path="/cart" 
                element={!session ? <Navigate to="/auth" replace /> : <CartPage />} 
              />
              <Route 
                path="/checkout" 
                element={!session ? <Navigate to="/auth" replace /> : <CheckoutPage />} 
              />
              <Route 
                path="/order-success/:orderId" 
                element={!session ? <Navigate to="/auth" replace /> : <OrderSuccessPage />} 
              />
              <Route 
                path="/orders" 
                element={!session ? <Navigate to="/auth" replace /> : <OrdersPage />} 
              />
              <Route 
                path="/orders/:orderId" 
                element={!session ? <Navigate to="/auth" replace /> : <OrderDetailPage />} 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
