import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const fetchStockProfile = async (symbol: string): Promise<StockProfile> => {
  const response = await fetch(`https://marketatlas.vercel.app/stock/${symbol}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stock profile');
  }
  return response.json();
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

export const StockDetails = ({ symbol }: StockDetailsProps) => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['stockProfile', symbol],
    queryFn: () => fetchStockProfile(symbol),
  });

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load stock profile</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="p-6 bg-muted/30 rounded-lg space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};