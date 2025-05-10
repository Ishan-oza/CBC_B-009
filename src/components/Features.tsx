
import React from 'react';
import { 
  Truck, BarChart3, Clock, Globe, 
  AlertCircle, TrendingUp, Map, Search
} from 'lucide-react';

const featureItems = [
  {
    icon: <Globe className="h-8 w-8 text-purple-500" />,
    title: "Global Visibility",
    description: "Track shipments and inventory across your entire global network in real-time."
  },
  {
    icon: <AlertCircle className="h-8 w-8 text-purple-500" />,
    title: "Disruption Alerts",
    description: "Get notified of potential disruptions before they impact your operations."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
    title: "Performance Analytics",
    description: "Measure KPIs and benchmark performance against industry standards."
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
    title: "Demand Forecasting",
    description: "AI-powered predictions help you anticipate market changes and optimize inventory."
  },
  {
    icon: <Map className="h-8 w-8 text-purple-500" />,
    title: "Network Mapping",
    description: "Visualize your entire supply chain network to identify bottlenecks and optimize routes."
  },
  {
    icon: <Search className="h-8 w-8 text-purple-500" />,
    title: "Risk Assessment",
    description: "Identify and mitigate potential risks before they disrupt your supply chain."
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Supply Chain Excellence</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Supply Seer provides the tools you need to transform your supply chain from a cost center to a competitive advantage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureItems.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100 hover:border-purple-200"
            >
              <div className="mb-4 p-3 inline-block bg-purple-50 rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
            <Clock className="mr-2 h-4 w-4" />
            <span>Set up in minutes, not months</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
