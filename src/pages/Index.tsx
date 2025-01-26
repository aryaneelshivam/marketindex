import { useStockData } from "@/hooks/use-stock-data";
import { StockTable } from "@/components/StockTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Index = () => {
  const [period, setPeriod] = useState("3mo");
  const { data, isLoading, error } = useStockData(period);
  const { toast } = useToast();

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch stock data. Please try again later.",
    });
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
          <p className="text-muted-foreground">
            Technical analysis indicators for NSE stocks
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <RadioGroup
            defaultValue="3mo"
            value={period}
            onValueChange={setPeriod}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1mo" id="1mo" />
              <Label htmlFor="1mo">1 Month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3mo" id="3mo" />
              <Label htmlFor="3mo">3 Months</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6mo" id="6mo" />
              <Label htmlFor="6mo">6 Months</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1y" id="1y" />
              <Label htmlFor="1y">1 Year</Label>
            </div>
          </RadioGroup>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-[640px] w-full rounded-lg" />
          </div>
        ) : data ? (
          <StockTable data={data} />
        ) : null}
      </div>
    </div>
  );
};

export default Index;