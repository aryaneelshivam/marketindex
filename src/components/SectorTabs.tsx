import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StockTable } from "./StockTable";
import { useStockData } from "@/hooks/use-stock-data";

interface SectorTabsProps {
  period: string;
}

export const SectorTabs = ({ period }: SectorTabsProps) => {
  const { data: mostActiveData, isLoading: isLoadingMostActive } = useStockData(
    period,
    "most_active"
  );
  const { data: financialData, isLoading: isLoadingFinancial } = useStockData(
    period,
    "financial"
  );
  const { data: energyData, isLoading: isLoadingEnergy } = useStockData(
    period,
    "energy"
  );

  const renderLoading = () => (
    <div className="space-y-4 text-center py-8">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      <p className="text-muted-foreground animate-pulse">
        Fetching latest market data from server and performing analysis...
      </p>
    </div>
  );

  return (
    <Tabs defaultValue="most_active" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="most_active">Most Active Equities 🔥</TabsTrigger>
        <TabsTrigger value="financial">Financial Sector 💸</TabsTrigger>
        <TabsTrigger value="energy">Energy Sector ♻️</TabsTrigger>
      </TabsList>
      <TabsContent value="most_active">
        <div className="space-y-2 mb-4">
          <h2 className="text-xl font-semibold">Most Active Equities</h2>
          <p className="text-muted-foreground">
            High-volume stocks with significant market activity
          </p>
        </div>
        {isLoadingMostActive ? renderLoading() : mostActiveData && <StockTable data={mostActiveData} />}
      </TabsContent>
      <TabsContent value="financial">
        <div className="space-y-2 mb-4">
          <h2 className="text-xl font-semibold">Financial Sector</h2>
          <p className="text-muted-foreground">
            Banks, insurance, and financial services companies
          </p>
        </div>
        {isLoadingFinancial ? renderLoading() : financialData && <StockTable data={financialData} />}
      </TabsContent>
      <TabsContent value="energy">
        <div className="space-y-2 mb-4">
          <h2 className="text-xl font-semibold">Energy Sector</h2>
          <p className="text-muted-foreground">
            Oil, gas, renewable energy, and utility companies
          </p>
        </div>
        {isLoadingEnergy ? renderLoading() : energyData && <StockTable data={energyData} />}
      </TabsContent>
    </Tabs>
  );
};