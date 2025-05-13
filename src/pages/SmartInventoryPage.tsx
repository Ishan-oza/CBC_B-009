
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Upload, Database, Calendar, Settings, ChartBar, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import InventoryForecast from '@/components/InventoryForecast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryModel } from '@/hooks/useInventoryModel';
import { Link } from 'react-router-dom';

const SmartInventoryPage = () => {
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [forecastData, setForecastData] = useState<any>(null);
  const { runForecast } = useInventoryModel();

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

  const handleGenerateForecast = async () => {
    if (!csvData) {
      toast.error('Please upload CSV data first');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Convert csvData to format expected by the model
      const forecast = await runForecast(csvData);
      setForecastData(forecast);
      toast.success('Forecast generated successfully!');
    } catch (error) {
      console.error('Forecast error:', error);
      toast.error('Failed to generate forecast');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Smart Inventory Management</h1>
          <p className="text-gray-500">Upload sales data to forecast inventory needs</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link to="/sales-forecast" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              Advanced ARIMA Forecasting
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="forecast" disabled={!forecastData}>Forecast</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Sales Data</CardTitle>
              <CardDescription>
                Upload a CSV file containing sales data to generate inventory predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            <CardFooter>
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
                    className="w-full" 
                    onClick={handleGenerateForecast}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Generate Inventory Forecast'}
                  </Button>
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
          {forecastData && <InventoryForecast forecastData={forecastData} />}
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Model Settings</CardTitle>
              <CardDescription>Configure the LSTM model parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Look Back Period (Days)</label>
                  <input 
                    type="number" 
                    min="7" 
                    max="90" 
                    defaultValue="30"
                    className="w-full rounded-md border border-gray-300 p-2 mt-1" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Forecast Period (Days)</label>
                  <input 
                    type="number" 
                    min="7" 
                    max="90" 
                    defaultValue="30"
                    className="w-full rounded-md border border-gray-300 p-2 mt-1" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Training Ratio</label>
                  <input 
                    type="number" 
                    min="0.5" 
                    max="0.9" 
                    step="0.05"
                    defaultValue="0.8"
                    className="w-full rounded-md border border-gray-300 p-2 mt-1" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Safety Stock Factor</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="2" 
                    step="0.1"
                    defaultValue="1.2"
                    className="w-full rounded-md border border-gray-300 p-2 mt-1" 
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-blue-600">
                    For advanced ARIMA forecasting options, please visit the 
                    <Link to="/sales-forecast" className="ml-1 font-medium underline">Sales Forecast</Link> page.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartInventoryPage;
