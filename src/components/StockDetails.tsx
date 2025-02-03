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
import { X, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StockDetailsProps {
  symbol: string;
  onClose: () => void;
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
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <Table>
      <TableBody>
        {Object.entries(data).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className="font-medium capitalize text-sm text-muted-foreground">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </TableCell>
            <TableCell className="text-sm font-medium">{value?.toString() ?? 'N/A'}</TableCell>
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
        <ToggleGroup type="single" value={period} onValueChange={(value) => value && setPeriod(value)} className="bg-muted p-1 rounded-lg">
          <ToggleGroupItem value="1mo" className="text-xs px-3">1M</ToggleGroupItem>
          <ToggleGroupItem value="3mo" className="text-xs px-3">3M</ToggleGroupItem>
          <ToggleGroupItem value="6mo" className="text-xs px-3">6M</ToggleGroupItem>
          <ToggleGroupItem value="1y" className="text-xs px-3">1Y</ToggleGroupItem>
          <ToggleGroupItem value="3y" className="text-xs px-3">3Y</ToggleGroupItem>
          <ToggleGroupItem value="5y" className="text-xs px-3">5Y</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
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
                fontSize: '12px'
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
    queryFn: () => fetchStockProfile(symbol),
    enabled: !!symbol,
  });

  if (!symbol) {
    return (
      <div className="fixed bottom-4 right-4">
        <Alert className="w-[300px] border-black/10">
          <Info className="h-4 w-4 text-black" />
          <AlertDescription>
            Click on any stock in the list to view its detailed financial information.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 w-full max-w-[500px] max-h-[calc(100vh-100px)] overflow-y-auto bg-background border rounded-xl shadow-lg">
      <div className="bg-background p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{symbol}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <PriceChart symbol={symbol} />
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="financials" className="flex-1">Financials</TabsTrigger>
            <TabsTrigger value="peers" className="flex-1">Peers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
              </div>
            ) : profile ? (
              <>
                <ProfileSection title="Financial Profile" data={profile.financial_profile} />
                <ProfileSection title="Stock Performance" data={profile.stock_performance} />
                <ProfileSection title="Trading Volume" data={profile.trading_volume} />
              </>
            ) : null}
          </TabsContent>
          
          <TabsContent value="financials" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
              </div>
            ) : profile ? (
              <>
                <ProfileSection title="Earnings & Revenue" data={profile.earnings_and_revenue} />
                <ProfileSection title="Cash & Debt" data={profile.cash_and_debt} />
                <ProfileSection title="Profitability & Margins" data={profile.profitability_and_margins} />
              </>
            ) : null}
          </TabsContent>
          
          <TabsContent value="peers" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
              </div>
            ) : profile ? (
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
  );
};