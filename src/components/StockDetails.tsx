import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { useState, useEffect } from "react";

interface StockDetailsProps {
  symbol: string;
}

interface StockProfile {
  financial_profile: Record<string, any>;
  stock_performance: Record<string, any>;
  trading_volume: Record<string, any>;
  ownership_and_shares: Record<string, any>;
  earnings_and_revenue: Record<string, any>;
  cash_and_debt: Record<string, any>;
  profitability_and_margins: Record<string, any>;
  liquidity_and_ratios: Record<string, any>;
  earnings_and_forecasts: Record<string, any>;
}

interface PriceData {
  date: string;
  close: number;
}

const fetchStockProfile = async (symbol: string): Promise<StockProfile> => {
  const response = await fetch(`https://marketatlas.vercel.app/stock/${symbol}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stock profile');
  }
  return response.json();
};

const fetchStockHistory = async (symbol: string, period: string): Promise<PriceData[]> => {
  const response = await fetch(`https://marketatlas.vercel.app/stock/${symbol}/history?period=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stock history');
  }
  const data = await response.json();
  return data.data.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString(),
    close: item.close,
  }));
};

const ProfileSection = ({ title, data }: { title: string; data: Record<string, any> }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <Table>
      <TableBody>
        {Object.entries(data).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className="font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </TableCell>
            <TableCell>{value?.toString() ?? 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const PriceChart = ({ symbol }: { symbol: string }) => {
  const [period, setPeriod] = useState<string>("1mo");
  
  const { data: priceData, isLoading } = useQuery({
    queryKey: ['stockHistory', symbol, period],
    queryFn: () => fetchStockHistory(symbol, period),
    enabled: !!symbol,
  });

  if (isLoading) return <Skeleton className="h-[300px] w-full" />;
  if (!priceData || priceData.length === 0) return <div>No price data available</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Price History</h3>
        <ToggleGroup type="single" value={period} onValueChange={(value) => value && setPeriod(value)}>
          <ToggleGroupItem value="1mo">1M</ToggleGroupItem>
          <ToggleGroupItem value="3mo">3M</ToggleGroupItem>
          <ToggleGroupItem value="6mo">6M</ToggleGroupItem>
          <ToggleGroupItem value="1y">1Y</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const StockDetails = ({ symbol }: StockDetailsProps) => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['stockProfile', symbol],
    queryFn: () => fetchStockProfile(symbol),
    enabled: !!symbol,
  });

  return (
    <div className="fixed top-24 right-4 w-96 max-h-[calc(100vh-120px)] overflow-y-auto bg-background border rounded-lg shadow-lg p-4">
      <div className="sticky top-0 bg-background pb-4 border-b mb-4">
        <h2 className="text-xl font-semibold">Stock Details - {symbol}</h2>
      </div>
      {isLoading && <Skeleton className="h-[200px] w-full" />}
      {error && <div className="text-red-500">Failed to load stock profile</div>}
      {profile && (
        <div className="space-y-6">
          <PriceChart symbol={symbol} />
          <div className="space-y-6">
            <ProfileSection title="Financial Profile" data={profile.financial_profile} />
            <ProfileSection title="Stock Performance" data={profile.stock_performance} />
            <ProfileSection title="Trading Volume" data={profile.trading_volume} />
            <ProfileSection title="Ownership & Shares" data={profile.ownership_and_shares} />
            <ProfileSection title="Earnings & Revenue" data={profile.earnings_and_revenue} />
            <ProfileSection title="Cash & Debt" data={profile.cash_and_debt} />
            <ProfileSection title="Profitability & Margins" data={profile.profitability_and_margins} />
            <ProfileSection title="Liquidity & Ratios" data={profile.liquidity_and_ratios} />
            <ProfileSection title="Earnings & Forecasts" data={profile.earnings_and_forecasts} />
          </div>
        </div>
      )}
    </div>
  );
};