import { useQuery } from "@tanstack/react-query";

interface RSIData {
  Value: number;
  Condition: string;
}

interface StochasticData {
  K_Value: number;
  D_Value: number;
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

const fetchStockData = async (period: string): Promise<StockData[]> => {
  const response = await fetch(
    `https://market-index.onrender.com/analyze_stocks?period=${period}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }
  return response.json();
};

export const useStockData = (period: string) => {
  return useQuery({
    queryKey: ["stockData", period],
    queryFn: () => fetchStockData(period),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};