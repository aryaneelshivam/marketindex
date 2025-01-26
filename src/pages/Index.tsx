import { useStockData } from "@/hooks/use-stock-data";
import { StockTable } from "@/components/StockTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { data, isLoading, error } = useStockData();
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