
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { SecurityNotice } from "./components/SecurityNotice";
import Index from "./pages/Index";
import Login from "./pages/Login";
import UserSignup from "./pages/UserSignup";
import MechanicSignup from "./pages/MechanicSignup";
import FindMechanic from "./pages/FindMechanic";
import MechanicProfile from "./pages/MechanicProfile";
import RequestHelp from "./pages/RequestHelp";
import Dashboard from "./pages/Dashboard";
import VehicleManagement from "./pages/VehicleManagement";
import PaymentMethods from "./pages/PaymentMethods";
import AuthCallback from "./pages/AuthCallback";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/mechanic-signup" element={<MechanicSignup />} />
          <Route path="/find-mechanic" element={<FindMechanic />} />
          <Route path="/mechanic-profile/:id" element={<MechanicProfile />} />
          <Route path="/request-help/:id" element={<RequestHelp />} />
          <Route path="/security-notice" element={<SecurityNotice />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/vehicle-management" element={<ProtectedRoute><VehicleManagement /></ProtectedRoute>} />
          <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
