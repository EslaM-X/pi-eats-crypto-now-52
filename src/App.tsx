
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

import AppProvider from "./contexts/AppProvider";
import Index from "./pages/Index";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Wallet from "./pages/Wallet";
import PiWallet from "./pages/PiWallet";
import Rewards from "./pages/Rewards";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import HomeFood from "./pages/HomeFood";
import FoodProviderDetails from "./pages/FoodProviderDetails";
import AddFoodListing from "./pages/AddFoodListing";
import PiPaymentDemo from "./pages/PiPaymentDemo";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { MobileNavigation, MobileNavbar } from "./frontend"; 
import { useIsMobile } from "./frontend/hooks/use-mobile";
import { useLanguage } from "./contexts/LanguageContext";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import Auth from "./pages/Auth";

// Configure the QueryClient with Pi Network styling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const AppContent = () => {
  const { dir } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground pb-16 md:pb-0" dir={dir}>
      <BrowserRouter>
        <MobileNavbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/pi-wallet" element={<PiWallet />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/homefood" element={<HomeFood />} />
          <Route path="/homefood/:id" element={<FoodProviderDetails />} />
          <Route path="/homefood/add" element={<AddFoodListing />} />
          <Route path="/pi-payment" element={<PiPaymentDemo />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* صفحة تسجيل دخول المسؤول */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* مسارات لوحة الإدارة */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="home-providers" element={<AdminRestaurants />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Show mobile navigation on mobile devices */}
        {isMobile && <MobileNavigation />}
      </BrowserRouter>
    </div>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" theme="system" />
          <AppProvider>
            <AppContent />
          </AppProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
