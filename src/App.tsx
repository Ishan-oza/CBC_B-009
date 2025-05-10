
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home, LogIn, UserPlus, Info, Database, Image } from 'lucide-react';
import { Button } from "@/components/ui/button";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import Index from "./pages/Index";
import SmartInventoryPage from "./pages/SmartInventoryPage";
import WheatClassificationPage from "./pages/WheatClassificationPage";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const Navigation = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50 backdrop-blur-lg bg-opacity-80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-primary tracking-wide flex items-center gap-2">
            🔮 Supply Seer
          </Link>
          <div className="hidden sm:flex gap-6">
            <Link to="/" className="flex items-center gap-1 text-gray-900 hover:text-primary transition">
              <Home className="h-5 w-5" /> Home
            </Link>
            <Link to="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-primary transition">
              <Database className="h-5 w-5" /> Dashboard
            </Link>
            <Link to="/smart-inventory" className="flex items-center gap-1 text-gray-600 hover:text-primary transition">
              <Database className="h-5 w-5" /> Smart Inventory
            </Link>
            <Link to="/wheat-classification" className="flex items-center gap-1 text-gray-600 hover:text-primary transition">
              <Image className="h-5 w-5" /> Wheat Quality
            </Link>
            <Link to="/about" className="flex items-center gap-1 text-gray-600 hover:text-primary transition">
              <Info className="h-5 w-5" /> About Us
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" /> Login
              </Link>
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:scale-105 transition-transform" asChild>
              <Link to="/signup" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" /> Sign Up
              </Link>
            </Button>
          </div>
          <div className="sm:hidden flex items-center gap-2">
            <Button size="sm" variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Navigation />
        <main className="pt-20 px-4 md:px-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/smart-inventory" element={<SmartInventoryPage />} />
            <Route path="/wheat-classification" element={<WheatClassificationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
