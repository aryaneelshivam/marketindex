
import { useQuery } from "@tanstack/react-query";

export type Sector = "most_active" | "financial" | "energy";

interface RSIData {
  Value: number;
  Condition: string;
}

interface StochasticData {
  k_value: number;
  d_value: number;
  Condition: string;
}

interface StockData {
  Symbol: string;
  "Last EMA Signal": string;
  "Last SMA Signal": string;
  "MACD Crossover": string;
  "Volume Divergence": string;
  "ADX Strength": string;
  RSI: RSIData;
  Stochastic: StochasticData;
}

interface StockPriceData {
  currentPrice: string;
  change: number;
}

const fetchStockData = async (period: string, sector: Sector): Promise<StockData[]> => {
  const response = await fetch(
    `https://market-index.onrender.com/analyze_stocks?sector=${sector}&period=${period}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }
  return response.json();
};

export const fetchStockPrice = async (symbol: string): Promise<StockPriceData> => {
  const response = await fetch(`https://marketatlas.vercel.app/stock/${symbol}`);
  if (!response.ok) {
    throw new Error("Failed to fetch stock price");
  }
  const data = await response.json();
  return {
    currentPrice: data.financial_profile.currentPrice,
    change: data.stock_performance["52WeekChange"] * 100, // Convert to percentage
  };
};

export const useStockData = (period: string, sector: Sector) => {
  return useQuery({
    queryKey: ["stockData", period, sector],
    queryFn: () => fetchStockData(period, sector),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useStockPrice = (symbol: string) => {
  return useQuery({
    queryKey: ["stockPrice", symbol],
    queryFn: () => fetchStockPrice(symbol),
    enabled: !!symbol,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};
