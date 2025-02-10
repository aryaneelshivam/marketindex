
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
  YAxis,
  CartesianGrid
} from "recharts";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";

interface StockDetailsProps {
  symbol: string | null;
  onClose?: () => void;  // Made optional since it's not always needed
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
  volume?: number;
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
    volume: item.volume || 0,
  }));
};

const ProfileSection = ({ title, data }: { title: string; data: Record<string, any> }) => (
  <div className="mb-4">
    <h3 className="text-base font-semibold mb-2">{title}</h3>
    <Table>
      <TableBody>
        {Object.entries(data).map(([key, value], index) => {
          const isNumeric = typeof value === 'number';
          const isPercentage = key.toLowerCase().includes('percent') || key.toLowerCase().includes('ratio');
          const isPositive = isNumeric && value > 0;
          const isNegative = isNumeric && value < 0;
          
          const formattedValue = isNumeric
            ? isPercentage
              ? `${value.toFixed(2)}%`
              : formatNumber(value)
            : value?.toString() ?? 'N/A';

          return (
            <TableRow 
              key={key}
              className={index % 2 === 0 ? 'bg-muted/30' : ''}
            >
              <TableCell className="font-medium capitalize text-xs text-muted-foreground py-2">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </TableCell>
              <TableCell className={`text-xs font-semibold flex items-center gap-1 py-2
                ${isPositive ? 'text-signal-buy' : ''}
                ${isNegative ? 'text-signal-sell' : ''}`}
              >
                {formattedValue}
                {isPositive && <TrendingUp className="w-3 h-3" />}
                {isNegative && <TrendingDown className="w-3 h-3" />}
              </TableCell>
            </TableRow>
          );
        })}
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

  if (isLoading) return <Skeleton className="h-[200px] w-full" />;
  if (!priceData || priceData.length === 0) return <div>No price data available</div>;

  return (
    <div className="space-y-3">
      <ToggleGroup type="single" value={period} onValueChange={(value) => value && setPeriod(value)} className="bg-muted p-1 rounded-lg">
        <ToggleGroupItem value="1mo" className="text-[10px] px-2">1M</ToggleGroupItem>
        <ToggleGroupItem value="3mo" className="text-[10px] px-2">3M</ToggleGroupItem>
        <ToggleGroupItem value="6mo" className="text-[10px] px-2">6M</ToggleGroupItem>
        <ToggleGroupItem value="1y" className="text-[10px] px-2">1Y</ToggleGroupItem>
        <ToggleGroupItem value="3y" className="text-[10px] px-2">3Y</ToggleGroupItem>
        <ToggleGroupItem value="5y" className="text-[10px] px-2">5Y</ToggleGroupItem>
      </ToggleGroup>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '10px'
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const StockDetails = ({ symbol, onClose }: StockDetailsProps) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['stockProfile', symbol],
    queryFn: () => fetchStockProfile(symbol!),
    enabled: !!symbol,
  });

  if (!symbol) {
    return null;
  }

  // Show skeleton loading state before content is ready
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card h-[calc(100vh-10rem)] flex flex-col animate-pulse">
        <div className="p-3 border-b flex-shrink-0">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card h-[calc(100vh-10rem)] flex flex-col">
      <div className="p-3 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold mb-2">{symbol}</h2>
        <PriceChart symbol={symbol} />
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="p-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full mb-3 bg-muted/50 backdrop-blur-sm sticky top-0 z-10">
              <TabsTrigger value="overview" className="flex-1 text-xs">Overview 🔎</TabsTrigger>
              <TabsTrigger value="financials" className="flex-1 text-xs">Financials 💰</TabsTrigger>
              <TabsTrigger value="peers" className="flex-1 text-xs">Peers ⛓️‍💥</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {profile ? (
                <>
                  <ProfileSection title="Financial Profile" data={profile.financial_profile} />
                  <ProfileSection title="Stock Performance" data={profile.stock_performance} />
                  <ProfileSection title="Trading Volume" data={profile.trading_volume} />
                </>
              ) : null}
            </TabsContent>
            
            <TabsContent value="financials" className="space-y-4">
              {profile ? (
                <>
                  <ProfileSection title="Earnings & Revenue" data={profile.earnings_and_revenue} />
                  <ProfileSection title="Cash & Debt" data={profile.cash_and_debt} />
                  <ProfileSection title="Profitability & Margins" data={profile.profitability_and_margins} />
                </>
              ) : null}
            </TabsContent>
            
            <TabsContent value="peers" className="space-y-4">
              {profile ? (
                <>
                  <ProfileSection title="Ownership & Shares" data={profile.ownership_and_shares} />
                  <ProfileSection title="Liquidity & Ratios" data={profile.liquidity_and_ratios} />
                  <ProfileSection title="Earnings & Forecasts" data={profile.earnings_and_forecasts} />
                </>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
