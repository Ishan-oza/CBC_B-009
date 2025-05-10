
import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { ArrowUp, ArrowDown, Calendar, Database } from 'lucide-react';
import { format } from 'date-fns';
import DashboardCard from './DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface InventoryForecastProps {
  forecastData: {
    pastSales: { date: string; sales: number }[];
    forecast: { date: string; forecasted_sales: number; recommended_inventory: number }[];
    summary: {
      past_avg: number;
      future_avg: number;
      change_percent: number;
    };
  };
}

const InventoryForecast: React.FC<InventoryForecastProps> = ({ forecastData }) => {
  const { pastSales, forecast, summary } = forecastData;
  
  // Format data for chart
  const chartData = {
    labels: [
      ...pastSales.map(item => format(new Date(item.date), 'MMM dd')),
      ...forecast.map(item => format(new Date(item.date), 'MMM dd'))
    ],
    datasets: [
      {
        label: 'Past Sales',
        data: [...pastSales.map(item => item.sales), ...Array(forecast.length).fill(null)],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Forecasted Sales',
        data: [...Array(pastSales.length).fill(null), ...forecast.map(item => item.forecasted_sales)],
        borderColor: '#ef4444',
        borderDash: [5, 5],
        tension: 0.3
      },
      {
        label: 'Recommended Inventory',
        data: [...Array(pastSales.length).fill(null), ...forecast.map(item => item.recommended_inventory)],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  // Calculate average daily inventory need
  const avgDailyInventory = (
    forecast.reduce((acc, item) => acc + item.recommended_inventory, 0) / forecast.length
  ).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Past 30 Days Avg Sales"
          value={summary.past_avg.toFixed(2)}
          icon={<Calendar className="h-6 w-6 text-purple-500" />}
        />
        
        <DashboardCard
          title="Next 30 Days Forecast"
          value={summary.future_avg.toFixed(2)}
          icon={<Calendar className="h-6 w-6 text-purple-500" />}
          trend={{
            value: Math.abs(summary.change_percent),
            isPositive: summary.change_percent > 0
          }}
        />
        
        <DashboardCard
          title="Recommended Action"
          value={summary.change_percent > 0 ? 'Increase Stock' : 'Decrease Stock'}
          icon={summary.change_percent > 0 
            ? <ArrowUp className="h-6 w-6 text-green-500" /> 
            : <ArrowDown className="h-6 w-6 text-red-500" />}
          description={`${Math.abs(summary.change_percent).toFixed(2)}% inventory adjustment`}
          className={summary.change_percent > 0 ? 'border-green-100' : 'border-red-100'}
        />
        
        <DashboardCard
          title="Avg Daily Inventory Need"
          value={avgDailyInventory}
          icon={<Database className="h-6 w-6 text-purple-500" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales & Inventory Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '400px' }}>
            <Line data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Daily Forecast Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Forecasted Sales</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Recommended Inventory</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Change</th>
                </tr>
              </thead>
              <tbody>
                {forecast.slice(0, 10).map((item, index) => {
                  const date = new Date(item.date);
                  const displayDate = format(date, 'MMM dd, yyyy');
                  
                  return (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{displayDate}</td>
                      <td className="py-3 px-4">{item.forecasted_sales.toFixed(2)}</td>
                      <td className="py-3 px-4">{item.recommended_inventory}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "inline-flex items-center text-xs px-2 py-0.5 rounded-full",
                          index > 0 && item.recommended_inventory > forecast[index - 1].recommended_inventory
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        )}>
                          {index > 0 ? (
                            <>
                              {item.recommended_inventory > forecast[index - 1].recommended_inventory ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(item.recommended_inventory - forecast[index - 1].recommended_inventory)}
                            </>
                          ) : (
                            "-"
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-sm text-gray-500 mt-4">
              Showing 10 of {forecast.length} forecast days
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryForecast;
