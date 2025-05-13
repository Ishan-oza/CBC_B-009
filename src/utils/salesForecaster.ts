
import { format, addMonths, parseISO } from 'date-fns';

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

class SalesForecaster {
  private data: SalesData[] | null = null;
  private differenced = false;
  private diffOrder = 0;

  // Load data from CSV format or array
  loadData(data: any[]): SalesData[] {
    // Determine column names
    const dateColumn = Object.keys(data[0]).find(key => 
      key.toLowerCase().includes('date') || key.toLowerCase().includes('time')
    ) || Object.keys(data[0])[0];
    
    const salesColumn = Object.keys(data[0]).find(key => 
      key.toLowerCase().includes('sales') || key.toLowerCase().includes('amount') || 
      key.toLowerCase().includes('price') || key.toLowerCase().includes('quantity')
    ) || Object.keys(data[0])[1];

    // Transform data
    this.data = data.map(row => ({
      date: row[dateColumn],
      sales: parseFloat(row[salesColumn])
    })).filter(item => !isNaN(item.sales));

    // Sort by date
    this.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return this.data;
  }

  // Create example data for testing purposes
  createExampleData(
    startDate: string = '2023-01-01', 
    periods: number = 24, 
    meanSales: number = 100, 
    seasonality: boolean = true, 
    trend: number = 0.5
  ): SalesData[] {
    const data: SalesData[] = [];
    
    // Create date range
    for (let i = 0; i < periods; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      // Base sales with randomness
      const random = () => Math.random() * meanSales / 5;
      let sales = meanSales + random() - meanSales / 10;
      
      // Add trend
      if (trend > 0) {
        sales += i * trend;
      }
      
      // Add seasonality
      if (seasonality) {
        const month = date.getMonth() + 1;
        const monthFactors: { [key: number]: number } = {
          1: 0.8,    // January
          2: 0.7,    // February
          3: 0.9,    // March
          4: 1.0,    // April
          5: 1.1,    // May
          6: 1.2,    // June
          7: 1.3,    // July
          8: 1.2,    // August
          9: 1.1,    // September
          10: 0.9,   // October
          11: 1.0,   // November
          12: 1.5    // December
        };
        sales *= monthFactors[month] || 1;
      }
      
      // Ensure no negative sales
      sales = Math.max(0, sales);
      
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        sales
      });
    }
    
    this.data = data;
    return data;
  }

  // Simplified implementation of time series analysis using moving averages
  // In a real application, you would use a proper time series library or 
  // call a backend API for statsmodels/ARIMA functionality
  forecast(steps: number = 3): {
    forecast: ForecastResult[],
    recommendations: InventoryRecommendation[]
  } {
    if (!this.data || this.data.length === 0) {
      throw new Error("No data loaded. Please load data first.");
    }
    
    // Extract sales data
    const sales = this.data.map(item => item.sales);
    
    // For simplicity, we'll use a weighted moving average approach
    // In a real implementation, you would use ARIMA or other time series models
    const windowSize = Math.min(sales.length, 6);
    
    // Calculate weighted average of recent sales
    let weightedSum = 0;
    let weightSum = 0;
    
    for (let i = 0; i < windowSize; i++) {
      const weight = windowSize - i;
      weightedSum += sales[sales.length - 1 - i] * weight;
      weightSum += weight;
    }
    
    const baseValue = weightedSum / weightSum;
    
    // Calculate trend
    const recentSales = sales.slice(-12); // Last 12 periods
    const trend = recentSales.length >= 2 ? 
      (recentSales[recentSales.length - 1] - recentSales[0]) / recentSales.length : 
      0;
    
    // Calculate seasonality (simple approach)
    const seasonalFactors: { [key: number]: number } = {};
    if (this.data.length >= 12) {
      // Group by month and calculate average factor
      const monthlyData: { [key: number]: number[] } = {};
      this.data.forEach(item => {
        const date = new Date(item.date);
        const month = date.getMonth() + 1;
        if (!monthlyData[month]) monthlyData[month] = [];
        monthlyData[month].push(item.sales);
      });

      // Calculate overall average
      const allSales = Object.values(monthlyData).flat();
      const overallAvg = allSales.reduce((sum, val) => sum + val, 0) / allSales.length;

      // Calculate factors
      Object.entries(monthlyData).forEach(([month, values]) => {
        const monthAvg = values.reduce((sum, val) => sum + val, 0) / values.length;
        seasonalFactors[parseInt(month)] = monthAvg / overallAvg;
      });
    }

    // Generate forecast
    const forecast: ForecastResult[] = [];
    const lastDate = new Date(this.data[this.data.length - 1].date);
    
    for (let i = 1; i <= steps; i++) {
      const forecastDate = addMonths(lastDate, i);
      const month = forecastDate.getMonth() + 1;
      const seasonFactor = seasonalFactors[month] || 1;
      
      // Basic forecast with trend and seasonality
      const forecastValue = (baseValue + (trend * i)) * seasonFactor;
      
      // Add uncertainty range
      const uncertainty = 0.1 * forecastValue * Math.sqrt(i); // Uncertainty grows with distance
      
      forecast.push({
        date: format(forecastDate, 'yyyy-MM-dd'),
        forecasted_sales: forecastValue,
        lower_ci: Math.max(0, forecastValue - uncertainty),
        upper_ci: forecastValue + uncertainty
      });
    }

    // Generate inventory recommendations
    const safetyStockPercentage = 20;
    const currentInventory = 100; // Default value, can be passed as parameter
    
    const recommendations: InventoryRecommendation[] = this.recommendInventory(
      forecast, 
      currentInventory, 
      safetyStockPercentage
    );
    
    return { 
      forecast, 
      recommendations 
    };
  }
  
  // Recommend inventory levels based on forecast
  private recommendInventory(
    forecastData: ForecastResult[], 
    currentInventory: number = 0, 
    safetyStockPercentage: number = 20
  ): InventoryRecommendation[] {
    const safetyStockFactor = safetyStockPercentage / 100;
    const recommendations: InventoryRecommendation[] = [];
    let remainingInventory = currentInventory;
    
    for (const row of forecastData) {
      const forecast = row.forecasted_sales;
      
      // Calculate safety stock for this period
      const safetyStock = forecast * safetyStockFactor;
      
      // Calculate ideal inventory level
      const idealInventory = forecast + safetyStock;
      
      // Calculate how many units to order
      const unitsToOrder = Math.max(0, idealInventory - remainingInventory);
      
      // Update remaining inventory for next period
      remainingInventory = remainingInventory + unitsToOrder - forecast;
      
      recommendations.push({
        period: format(new Date(row.date), 'yyyy-MM'),
        forecast: forecast,
        safety_stock: safetyStock,
        ideal_inventory: idealInventory,
        units_to_order: unitsToOrder,
        remaining_inventory: remainingInventory
      });
    }
    
    return recommendations;
  }

  // Check for stationarity (simplified version)
  checkStationarity(): boolean {
    if (!this.data || this.data.length === 0) {
      throw new Error("No data loaded. Please load data first.");
    }
    
    // Simplified check - look for significant trend
    const sales = this.data.map(item => item.sales);
    const firstHalf = sales.slice(0, Math.floor(sales.length / 2));
    const secondHalf = sales.slice(Math.floor(sales.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    // Calculate percent change
    const percentChange = Math.abs((secondAvg - firstAvg) / firstAvg * 100);
    
    // If change is more than 10%, consider non-stationary
    return percentChange < 10;
  }
}

export default SalesForecaster;
