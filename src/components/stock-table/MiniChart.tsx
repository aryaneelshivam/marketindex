
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceData {
  date: string;
  price: number;
}

const fetchHistoricalData = async (symbol: string): Promise<PriceData[]> => {
  const response = await fetch(`https://marketatlas.vercel.app/stock/${symbol}/history?period=1mo`);
  if (!response.ok) {
    throw new Error("Failed to fetch historical data");
  }
  const data = await response.json();
  return data.map((item: any) => ({
    date: item.date,
    price: parseFloat(item.price),
  }));
};

interface MiniChartProps {
  symbol: string;
  currentPrice: number | undefined;
}

export const MiniChart = ({ symbol, currentPrice }: MiniChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["stockHistory", symbol],
    queryFn: () => fetchHistoricalData(symbol),
    enabled: !!symbol,
  });

  if (isLoading || !data || !currentPrice) {
    return <Skeleton className="h-12 w-24" />;
  }

  const startPrice = data[0]?.price;
  const isPositive = currentPrice >= startPrice;
  const color = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            fill={color}
            fillOpacity={0.1}
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
