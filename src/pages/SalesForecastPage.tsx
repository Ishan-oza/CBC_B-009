
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { format } from 'date-fns';
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
import { Line } from 'react-chartjs-2';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Database, 
  ChartBar, 
  Upload,
  Settings, 
  FileBarChart,
  Info,
  FileText,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import DashboardCard from '@/components/DashboardCard';
import SalesForecaster from '@/utils/salesForecaster';
import { ChartContainer } from '@/components/ui/chart';

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

interface SalesData {
  date: string;
  sales: number;
}

interface ForecastResult {
  date: string;
  forecasted_sales: number;
  lower_ci: number;
  upper_ci: number;
}

interface InventoryRecommendation {
  period: string;
  forecast: number;
  safety_stock: number;
  ideal_inventory: number;
  units_to_order: number;
  remaining_inventory: number;
}

const SalesForecastPage = () => {
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [salesData, setSalesData] = useState<SalesData[] | null>(null);
  const [forecastResults, setForecastResults] = useState<{
    forecast: ForecastResult[],
    recommendations: InventoryRecommendation[]
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentInventory, setCurrentInventory] = useState(100);
  const [safetyStock, setSafetyStock] = useState(20);
  const [forecastPeriods, setForecastPeriods] = useState(3);
  const [analysisType, setAnalysisType] = useState<'basic' | 'advanced'>('basic');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  
  // Capture console logs for display
  React.useEffect(() => {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog(...args);
      setConsoleOutput(prev => [...prev, args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')]);
    };

    return () => {
      console.log = originalConsoleLog;
    };
  }, []);
  
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setCsvData(results.data);
            toast.success(`Successfully loaded ${results.data.length} rows from ${file.name}`);
          } else {
            toast.error('The file appears to be empty or invalid');
          }
        },
        error: (error) => {
          toast.error(`Error parsing CSV: ${error.message}`);
        }
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleGenerateExample = () => {
    setConsoleOutput([]);
    const forecaster = new SalesForecaster();
    const exampleData = forecaster.createExampleData(
      '2023-01-01',
      24,
      500,
      true,
      10
    );
    
    setSalesData(exampleData);
    setCsvData(exampleData);
    toast.success('Example data generated successfully');
    console.log(`Generated example data with ${exampleData.length} records`);
  };

  const handleGenerateForecast = () => {
    setIsProcessing(true);
    setConsoleOutput([]);
    
    try {
      const forecaster = new SalesForecaster();
      
      // Load data
      if (csvData) {
        console.log('Loading data into forecaster...');
        forecaster.loadData(csvData);
      } else {
        throw new Error('No data available');
      }
      
      // Generate forecast
      console.log(`Generating ${analysisType} forecast for ${forecastPeriods} periods...`);
      
      let results;
      if (analysisType === 'advanced') {
        console.log('Running ARIMA-inspired analysis...');
        results = forecaster.advancedForecast(
          forecastPeriods, 
          currentInventory, 
          safetyStock
        );
      } else {
        results = forecaster.forecast(forecastPeriods);
      }
      
      setForecastResults(results);
      setSalesData(forecaster.loadData(csvData));
      
      toast.success('Forecast generated successfully!');
    } catch (error) {
      console.error('Forecast error:', error);
      toast.error('Failed to generate forecast');
    } finally {
      setIsProcessing(false);
    }
  };

  // Prepare chart data
  const getChartData = () => {
    if (!salesData || !forecastResults) return null;

    return {
      labels: [
        ...salesData.slice(-12).map(item => format(new Date(item.date), 'MMM dd')),
        ...forecastResults.forecast.map(item => format(new Date(item.date), 'MMM dd'))
      ],
      datasets: [
        {
          label: 'Historical Sales',
          data: [
            ...salesData.slice(-12).map(item => item.sales),
            ...Array(forecastResults.forecast.length).fill(null)
          ],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Forecasted Sales',
          data: [
            ...Array(12).fill(null),
            ...forecastResults.forecast.map(item => item.forecasted_sales)
          ],
          borderColor: '#ef4444',
          borderDash: [5, 5],
          tension: 0.3
        },
        {
          label: 'Lower CI',
          data: [
            ...Array(12).fill(null),
            ...forecastResults.forecast.map(item => item.lower_ci)
          ],
          borderColor: 'rgba(239, 68, 68, 0.5)',
          borderDash: [2, 2],
          pointRadius: 0,
          tension: 0.3,
          fill: false
        },
        {
          label: 'Upper CI',
          data: [
            ...Array(12).fill(null),
            ...forecastResults.forecast.map(item => item.upper_ci)
          ],
          borderColor: 'rgba(239, 68, 68, 0.5)',
          borderDash: [2, 2],
          pointRadius: 0,
          tension: 0.3,
          fill: '-1',
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }
      ]
    };
  };

  const chartOptions = {
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

  // Calculate summary statistics
  const getSummaryStats = () => {
    if (!salesData || !forecastResults) return null;
    
    const pastSales = salesData.slice(-forecastResults.forecast.length);
    const pastAvg = pastSales.reduce((sum, item) => sum + item.sales, 0) / pastSales.length;
    const forecastAvg = forecastResults.forecast.reduce((sum, item) => sum + item.forecasted_sales, 0) / forecastResults.forecast.length;
    const changePercent = ((forecastAvg - pastAvg) / pastAvg) * 100;
    
    return {
      past_avg: pastAvg,
      future_avg: forecastAvg,
      change_percent: changePercent
    };
  };

  const summary = getSummaryStats();
  const chartData = getChartData();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sales Forecasting with ARIMA</h1>
          <p className="text-gray-500">Upload sales data to generate predictions and inventory recommendations</p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="forecast" disabled={!forecastResults}>Forecast</TabsTrigger>
          <TabsTrigger value="inventory" disabled={!forecastResults}>Inventory</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!forecastResults}>Analysis</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Sales Data</CardTitle>
              <CardDescription>
                Upload a CSV file containing sales data to generate predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
                <Button variant="outline" onClick={handleGenerateExample}>
                  <FileText className="h-4 w-4 mr-2" /> Generate Example Data
                </Button>
                <p className="text-sm text-gray-500">
                  Don't have data? Generate example sales data for testing
                </p>
              </div>

              <div 
                {...getRootProps()} 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Drag &amp; drop a CSV file here, or click to select</p>
                <p className="text-sm text-gray-500 mt-2">
                  CSV should include columns for date and sales metrics
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              {csvData && (
                <div className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      {csvData.length} rows loaded successfully
                    </span>
                    <Button variant="outline" onClick={() => setCsvData(null)}>
                      Clear
                    </Button>
                  </div>
                  <Button 
                    className="w-full mb-4" 
                    onClick={handleGenerateForecast}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <ChartBar className="h-4 w-4 mr-2" />}
                    {isProcessing ? 'Processing...' : 'Generate Sales Forecast'}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-4 border-t pt-4 w-full">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="basic-analysis"
                        checked={analysisType === 'basic'}
                        onChange={() => setAnalysisType('basic')}
                        className="rounded"
                      />
                      <label htmlFor="basic-analysis" className="text-sm">Basic Analysis</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="arima-analysis"
                        checked={analysisType === 'advanced'}
                        onChange={() => setAnalysisType('advanced')}
                        className="rounded"
                      />
                      <label htmlFor="arima-analysis" className="text-sm">ARIMA Analysis</label>
                    </div>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>

          {csvData && csvData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>Preview of your uploaded data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {Object.keys(csvData[0]).slice(0, 5).map((header, i) => (
                          <th key={i} className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-b border-gray-200">
                          {Object.values(row).slice(0, 5).map((cell: any, j) => (
                            <td key={j} className="py-3 px-4">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {Object.keys(csvData[0]).length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Showing first 5 columns of {Object.keys(csvData[0]).length} total columns
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="forecast">
          {forecastResults && summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard
                  title="Past Average Sales"
                  value={summary.past_avg.toFixed(2)}
                  icon={<Calendar className="h-6 w-6 text-purple-500" />}
                />
                
                <DashboardCard
                  title="Forecasted Average"
                  value={summary.future_avg.toFixed(2)}
                  icon={<ChartBar className="h-6 w-6 text-purple-500" />}
                  trend={{
                    value: Math.abs(summary.change_percent),
                    isPositive: summary.change_percent > 0
                  }}
                />
                
                <DashboardCard
                  title="Trend"
                  value={`${Math.abs(summary.change_percent).toFixed(2)}%`}
                  description={summary.change_percent > 0 ? 'Sales increasing' : 'Sales decreasing'}
                  icon={summary.change_percent > 0 
                    ? <ArrowUp className="h-6 w-6 text-green-500" /> 
                    : <ArrowDown className="h-6 w-6 text-red-500" />}
                  className={summary.change_percent > 0 ? 'border-green-100' : 'border-red-100'}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Sales Forecast Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '400px' }}>
                    {chartData && <Line data={chartData} options={chartOptions} />}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Details</CardTitle>
                  <CardDescription>Forecast using {analysisType === 'advanced' ? 'ARIMA-inspired' : 'basic'} analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Period</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Forecast</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Lower CI</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Upper CI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecastResults.forecast.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{format(new Date(item.date), 'MMM yyyy')}</td>
                            <td className="py-3 px-4">{item.forecasted_sales.toFixed(2)}</td>
                            <td className="py-3 px-4">{item.lower_ci.toFixed(2)}</td>
                            <td className="py-3 px-4">{item.upper_ci.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inventory">
          {forecastResults && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Recommendations</CardTitle>
                  <CardDescription>ARIMA-based inventory planning suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Period</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Forecast</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Safety Stock</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ideal Inventory</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Recommended Order</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Remaining Inventory</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecastResults.recommendations.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{item.period}</td>
                            <td className="py-3 px-4">{item.forecast.toFixed(2)}</td>
                            <td className="py-3 px-4">{item.safety_stock.toFixed(2)}</td>
                            <td className="py-3 px-4">{item.ideal_inventory.toFixed(2)}</td>
                            <td className="py-3 px-4 font-medium text-blue-600">{Math.ceil(item.units_to_order)}</td>
                            <td className="py-3 px-4">{item.remaining_inventory.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard
                  title="Current Inventory"
                  value={currentInventory.toString()}
                  icon={<Database className="h-6 w-6 text-purple-500" />}
                />
                
                <DashboardCard
                  title="Safety Stock %"
                  value={`${safetyStock}%`}
                  icon={<Database className="h-6 w-6 text-purple-500" />}
                  description="Buffer above forecasted demand"
                />
                
                <DashboardCard
                  title="Total Recommended Order"
                  value={Math.ceil(forecastResults.recommendations.reduce((sum, item) => sum + item.units_to_order, 0)).toString()}
                  icon={<Database className="h-6 w-6 text-purple-500" />}
                  description="For all forecast periods"
                />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analysis">
          {forecastResults && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ARIMA Analysis</CardTitle>
                  <CardDescription>Statistical analysis of the time series data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    {consoleOutput.length > 0 ? (
                      <pre className="whitespace-pre-wrap">
                        {consoleOutput.map((line, i) => (
                          <div key={i} className="py-1">{'> ' + line}</div>
                        ))}
                      </pre>
                    ) : (
                      <p className="text-gray-500 italic">No analysis logs available. Run a forecast first.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>About Time Series Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">ARIMA Model</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          ARIMA (AutoRegressive Integrated Moving Average) is a statistical model used for time series forecasting.
                          It combines autoregression (AR), differencing (I), and moving average (MA) components.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Components of ARIMA</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 mt-1 space-y-1">
                          <li><strong>p (AR):</strong> The number of lag observations included in the model</li>
                          <li><strong>d (I):</strong> The number of times the raw observations are differenced</li>
                          <li><strong>q (MA):</strong> The size of the moving average window</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Forecast Interpretation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Confidence Intervals</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          The shaded area around the forecast line represents the forecast uncertainty.
                          Wider intervals indicate less certainty about future values.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Key Metrics</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 mt-1 space-y-1">
                          <li><strong>Trend:</strong> The general direction of the forecast</li>
                          <li><strong>Seasonality:</strong> Repeating patterns detected in the data</li>
                          <li><strong>Stationarity:</strong> Whether the data needed differencing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Settings</CardTitle>
              <CardDescription>Configure forecast parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Current Inventory</label>
                  <input 
                    type="number" 
                    min="0"
                    value={currentInventory}
                    onChange={(e) => setCurrentInventory(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-gray-300 p-2 mt-1" 
                  />
                  <p className="text-sm text-gray-500 mt-1">Current stock before ordering</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Safety Stock Percentage</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={safetyStock}
                    onChange={(e) => setSafetyStock(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-gray-300 p-2 mt-1" 
                  />
                  <p className="text-sm text-gray-500 mt-1">Buffer inventory above forecasted demand</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Forecast Periods</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="12" 
                    value={forecastPeriods}
                    onChange={(e) => setForecastPeriods(parseInt(e.target.value) || 1)}
                    className="w-full rounded-md border border-gray-300 p-2 mt-1" 
                  />
                  <p className="text-sm text-gray-500 mt-1">Number of future periods to forecast</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">ARIMA Settings</h3>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm">
                    <p>
                      <Info className="h-4 w-4 inline-block mr-1 text-blue-500" />
                      The current implementation uses a dynamic parameter selection algorithm to automatically
                      determine the best ARIMA parameters based on your data.
                    </p>
                    <p className="mt-2">
                      When you select "ARIMA Analysis" mode, the system will:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Test for stationarity</li>
                      <li>Apply differencing if needed</li>
                      <li>Find optimal p, d, q parameters</li>
                      <li>Generate forecast with confidence intervals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerateForecast} disabled={!csvData || isProcessing}>
                <RefreshCw className="h-4 w-4 mr-2" /> 
                Update Forecast
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesForecastPage;
