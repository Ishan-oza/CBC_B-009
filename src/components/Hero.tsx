
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-80 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-16 md:py-24 lg:py-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <span className="gradient-text">Visualize</span> Your Supply Chain with Clarity
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                Predict issues before they occur, optimize inventory, and gain real-time visibility into your entire supply chain network.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all" asChild>
                  <Link to="/signup">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
              <div className="pt-4 text-sm text-gray-500">
                Join 2,000+ companies already optimizing their supply chain
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="glass-card animate-float">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Supply Chain Dashboard" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Real-time Supply Chain Visibility</h3>
                  <p className="text-gray-600">Monitor your global logistics network at a glance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;
