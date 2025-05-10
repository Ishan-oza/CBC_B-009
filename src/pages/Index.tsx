
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardCard from '@/components/DashboardCard';
import DashboardChart from '@/components/DashboardChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3, 
  Truck, 
  AlertCircle, 
  Clock, 
  Package,
  BarChart,
  TrendingUp,
  TrendingDown,
  Settings,
  Bell,
  Search,
  Calendar,
  User
} from 'lucide-react';

const shipmentChartData = [
  { name: 'Jan', value: 32, previousValue: 28 },
  { name: 'Feb', value: 45, previousValue: 30 },
  { name: 'Mar', value: 43, previousValue: 40 },
  { name: 'Apr', value: 50, previousValue: 45 },
  { name: 'May', value: 58, previousValue: 48 },
  { name: 'Jun', value: 62, previousValue: 52 },
  { name: 'Jul', value: 70, previousValue: 60 },
];

const inventoryChartData = [
  { name: 'Jan', value: 80, previousValue: 85 },
  { name: 'Feb', value: 75, previousValue: 80 },
  { name: 'Mar', value: 85, previousValue: 75 },
  { name: 'Apr', value: 80, previousValue: 70 },
  { name: 'May', value: 75, previousValue: 65 },
  { name: 'Jun', value: 70, previousValue: 60 },
  { name: 'Jul', value: 65, previousValue: 55 },
];

const Index = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Supply Chain Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's an overview of your supply chain.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Last 30 Days
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <Bell className="h-4 w-4 mr-1" /> Alerts
            <span className="ml-1 bg-white text-purple-600 rounded-full h-5 w-5 flex items-center justify-center text-xs">3</span>
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Active Shipments"
          value="126"
          icon={<Truck className="h-6 w-6 text-purple-500" />}
          trend={{ value: 12, isPositive: true }}
        />
        
        <DashboardCard
          title="On-Time Delivery"
          value="94.8%"
          icon={<Clock className="h-6 w-6 text-purple-500" />}
          trend={{ value: 3.2, isPositive: true }}
        />
        
        <DashboardCard
          title="Inventory Turnover"
          value="5.7"
          icon={<Package className="h-6 w-6 text-purple-500" />}
          trend={{ value: 0.8, isPositive: true }}
          description="Turns per quarter"
        />
        
        <DashboardCard
          title="Active Alerts"
          value="3"
          icon={<AlertCircle className="h-6 w-6 text-red-500" />}
          description="2 high priority"
          className="border-red-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardChart
          title="Shipment Volume"
          data={shipmentChartData}
          dataKey="value"
          compareKey="previousValue"
        />
        
        <DashboardChart
          title="Inventory Levels"
          data={inventoryChartData}
          dataKey="value"
          compareKey="previousValue"
          gradient={{ start: '#10b981', end: '#d1fae5' }}
        />
      </div>

      {/* Tabbed Content */}
      <div className="mb-8">
        <Tabs defaultValue="shipments" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shipments" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Shipments</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search shipments..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button variant="outline" size="sm">Filter</Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tracking ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Origin</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Destination</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ETA</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: 'SHP-2023-05872',
                      origin: 'Shanghai, CN',
                      destination: 'Long Beach, US',
                      status: 'In Transit',
                      eta: 'Jul 24, 2023',
                      statusColor: 'bg-blue-500'
                    },
                    {
                      id: 'SHP-2023-05873',
                      origin: 'Hamburg, DE',
                      destination: 'New York, US',
                      status: 'Delayed',
                      eta: 'Jul 28, 2023',
                      statusColor: 'bg-yellow-500'
                    },
                    {
                      id: 'SHP-2023-05874',
                      origin: 'Rotterdam, NL',
                      destination: 'Miami, US',
                      status: 'On Schedule',
                      eta: 'Jul 22, 2023',
                      statusColor: 'bg-green-500'
                    },
                    {
                      id: 'SHP-2023-05875',
                      origin: 'Singapore, SG',
                      destination: 'Los Angeles, US',
                      status: 'Delayed',
                      eta: 'Jul 30, 2023',
                      statusColor: 'bg-yellow-500'
                    },
                    {
                      id: 'SHP-2023-05876',
                      origin: 'Busan, KR',
                      destination: 'Seattle, US',
                      status: 'On Schedule',
                      eta: 'Jul 25, 2023',
                      statusColor: 'bg-green-500'
                    }
                  ].map((shipment, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium">{shipment.id}</span>
                      </td>
                      <td className="py-3 px-4">{shipment.origin}</td>
                      <td className="py-3 px-4">{shipment.destination}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${shipment.statusColor}`}></span>
                          <span>{shipment.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{shipment.eta}</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button variant="outline">View All Shipments</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Inventory Status</h3>
              <p className="text-gray-500">Select the inventory tab to view detailed inventory analytics and management tools.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="suppliers">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Supplier Performance</h3>
              <p className="text-gray-500">View and manage your supplier relationships and performance metrics.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Advanced Analytics</h3>
              <p className="text-gray-500">Dive deeper into your supply chain data with advanced analytics and reporting tools.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Risk Assessment */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" /> Risk Assessment
          </h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-md mr-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium">Port Congestion Alert - Los Angeles</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Significant delays expected due to worker strike affecting 12 shipments. Estimated impact: 5-7 days delay.
                </p>
                <div className="mt-2">
                  <Button variant="link" className="p-0 h-auto text-sm font-medium text-red-600">View Affected Shipments</Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-md mr-4">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-medium">Weather Warning - Atlantic Ocean</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Tropical storm forming in the Atlantic may affect shipping routes from Europe. Monitoring situation.
                </p>
                <div className="mt-2">
                  <Button variant="link" className="p-0 h-auto text-sm font-medium text-yellow-600">View Weather Report</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
