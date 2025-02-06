import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockTable } from "./StockTable";
import { TrendingUp, DollarSign, Leaf } from "lucide-react";

interface SectorTabsProps {
  period: string;
}

export const SectorTabs = ({ period }: SectorTabsProps) => {
  return (
    <Tabs defaultValue="most_active" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="most_active" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Most Active Equities 🔥
        </TabsTrigger>
        <TabsTrigger value="financial" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Financial Sector 💸
        </TabsTrigger>
        <TabsTrigger value="energy" className="flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          Energy Sector ♻️
        </TabsTrigger>
      </TabsList>
      <TabsContent value="most_active">
        <StockTable sector="most_active" period={period} />
      </TabsContent>
      <TabsContent value="financial">
        <StockTable sector="financial" period={period} />
      </TabsContent>
      <TabsContent value="energy">
        <StockTable sector="energy" period={period} />
      </TabsContent>
    </Tabs>
  );
};