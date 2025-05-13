
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
  private bestOrder: [number, number, number] | null = null;

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
    
    // Set random seed (approximate equivalent to Python's np.random.seed)
    const randomSeed = 42;
    let randomState = randomSeed;
    const seededRandom = () => {
      randomState = (randomState * 9301 + 49297) % 233280;
      return randomState / 233280;
    };
    
    // Create date range
    for (let i = 0; i < periods; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      // Base sales with randomness (approximating normal distribution)
      const normalRandom = () => {
        // Box-Muller transform for normal distribution
        const u1 = seededRandom();
        const u2 = seededRandom();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0;
      };
      
      let sales = meanSales + normalRandom() * (meanSales / 10);
      
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

  // Check for stationarity (simplified implementation)
  checkStationarity(): boolean {
    if (!this.data || this.data.length === 0) {
      throw new Error("No data loaded. Please load data first.");
    }
    
    // Simplified approach - look for significant trend between first and second half
    const sales = this.data.map(item => item.sales);
    const midpoint = Math.floor(sales.length / 2);
    const firstHalf = sales.slice(0, midpoint);
    const secondHalf = sales.slice(midpoint);
    
    // Calculate averages
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    // Calculate percent change
    const percentChange = Math.abs((secondAvg - firstAvg) / firstAvg * 100);
    
    // Simple heuristic - if change is more than 10%, consider non-stationary
    return percentChange < 10;
  }

  // Difference the data to achieve stationarity
  differenceData(order: number = 1): number[] {
    if (!this.data || this.data.length === 0) {
      throw new Error("No data loaded. Please load data first.");
    }
    
    const sales = this.data.map(item => item.sales);
    let result: number[] = [];
    
    // Simple differencing
    for (let i = order; i < sales.length; i++) {
      result.push(sales[i] - sales[i - order]);
    }
    
    this.differenced = true;
    this.diffOrder = order;
    
    return result;
  }

  // Find best parameters for ARIMA model (simplified approach)
  findBestOrder(maxP: number = 2, maxD: number = 1, maxQ: number = 2): [number, number, number] {
    // This is a simplified implementation, as proper ARIMA parameter selection
    // requires complex statistical calculations
    
    // In a web context, we'll use some heuristics instead of a full grid search
    
    // Check if data needs differencing
    let d = 0;
    if (!this.checkStationarity()) {
      d = 1; // Suggest first-order differencing for non-stationary data
    }
    
    // For p and q, we'll use simple heuristics based on data patterns
    // In a real implementation, this would involve ACF/PACF analysis
    let p = 1; // Default autoregressive order
    let q = 1; // Default moving average order
    
    if (this.data && this.data.length >= 24) {
      // With more data, we might use higher orders
      p = 2;
      q = 2;
    }
    
    this.bestOrder = [p, d, q];
    return this.bestOrder;
  }

  // Simplified ARIMA implementation
  // In a real application, you would use a proper time series library
  forecast(steps: number = 3): {
    forecast: ForecastResult[],
    recommendations: InventoryRecommendation[]
  } {
    if (!this.data || this.data.length === 0) {
      throw new Error("No data loaded. Please load data first.");
    }

    // Get recent values for forecast
    const sales = this.data.map(item => item.sales);
    const dates = this.data.map(item => new Date(item.date));
    
    // Find best order if not already determined
    if (!this.bestOrder) {
      this.findBestOrder();
    }
    
    // Simple forecast implementation based on weighted moving average and seasonality
    const forecast: ForecastResult[] = [];
    const lastDate = new Date(this.data[this.data.length - 1].date);
    
    // Detect seasonality
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
    
    // Calculate trend
    const recentSales = sales.slice(-6);  // Last 6 periods
    const trend = recentSales.length >= 2 ? 
      (recentSales[recentSales.length - 1] - recentSales[0]) / recentSales.length : 
      0;
    
    // Calculate weighted average of recent sales
    const windowSize = Math.min(sales.length, 6);
    let weightedSum = 0;
    let weightSum = 0;
    
    for (let i = 0; i < windowSize; i++) {
      const weight = windowSize - i;
      weightedSum += sales[sales.length - 1 - i] * weight;
      weightSum += weight;
    }
    
    const baseValue = weightedSum / weightSum;
    
    // Generate forecast
    for (let i = 1; i <= steps; i++) {
      const forecastDate = addMonths(lastDate, i);
      const month = forecastDate.getMonth() + 1;
      const seasonFactor = seasonalFactors[month] || 1;
      
      // Forecast with trend and seasonality
      const forecastValue = (baseValue + (trend * i)) * seasonFactor;
      
      // Add uncertainty range
      const uncertainty = 0.1 * forecastValue * Math.sqrt(i);
      
      forecast.push({
        date: format(forecastDate, 'yyyy-MM-dd'),
        forecasted_sales: forecastValue,
        lower_ci: Math.max(0, forecastValue - uncertainty),
        upper_ci: forecastValue + uncertainty
      });
    }

    // Generate inventory recommendations
    const recommendations: InventoryRecommendation[] = this.recommendInventory(
      forecast, 
      100,  // Default current inventory 
      20    // Default safety stock percentage
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

  // Advanced forecast with statistical analysis
  // This implementation provides an ARIMA-like forecast that approximates the Python version
  advancedForecast(
    steps: number = 3,
    currentInventory: number = 100,
    safetyStockPercentage: number = 20
  ): {
    forecast: ForecastResult[],
    recommendations: InventoryRecommendation[]
  } {
    if (!this.data || this.data.length === 0) {
      throw new Error("No data loaded. Please load data first.");
    }
    
    // 1. Check stationarity
    const isStationary = this.checkStationarity();
    console.log(`Series stationarity check: ${isStationary ? "Stationary" : "Non-stationary"}`);
    
    // 2. Apply differencing if needed
    if (!isStationary) {
      this.differenceData(1);
      console.log("Applied first-order differencing to achieve stationarity");
    }
    
    // 3. Find optimal parameters
    const [p, d, q] = this.findBestOrder();
    console.log(`Selected ARIMA parameters: (${p},${d},${q})`);
    
    // 4. Generate forecast using the basic forecast method
    // (In a real implementation, this would use proper ARIMA calculations)
    const forecastResults = this.forecast(steps);
    
    console.log("Forecast generated successfully using ARIMA-inspired approach");
    
    // 5. Generate inventory recommendations
    const recommendations = this.recommendInventory(
      forecastResults.forecast,
      currentInventory,
      safetyStockPercentage
    );
    
    return {
      forecast: forecastResults.forecast,
      recommendations
    };
  }
}

export default SalesForecaster;
