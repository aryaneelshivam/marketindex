import { useStockData } from "@/hooks/use-stock-data";
import { StockTable } from "@/components/StockTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// ... keep existing code (component implementation)

const Index = () => {
  const [period, setPeriod] = useState("3mo");
  const [emaFilter, setEmaFilter] = useState("ALL");
  const [smaFilter, setSmaFilter] = useState("ALL");
  const [macdFilter, setMacdFilter] = useState("ALL");
  const [rsiFilter, setRsiFilter] = useState("ALL");
  const [stochFilter, setStochFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: rawData, isLoading, error } = useStockData(period);
  const { toast } = useToast();

  const filteredData = rawData?.filter((stock) => {
    // First apply search filter
    const matchesSearch = searchQuery === "" || 
      stock.Symbol.toLowerCase().includes(searchQuery.toLowerCase());

    // Then apply other filters
    const matchesEma = emaFilter === "ALL" || stock["Last EMA Signal"] === emaFilter;
    const matchesSma = smaFilter === "ALL" || stock["Last SMA Signal"] === smaFilter;
    const matchesMacd = macdFilter === "ALL" || 
      (macdFilter === "YES" ? stock["MACD Crossover"] === "YES" : stock["MACD Crossover"] === "NO");
    const matchesRsi = rsiFilter === "ALL" || stock.RSI.Condition === rsiFilter;
    const matchesStoch = stochFilter === "ALL" || stock.Stochastic.Condition === stochFilter;
    
    return matchesSearch && matchesEma && matchesSma && matchesMacd && matchesRsi && matchesStoch;
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch stock data. Please try again later.",
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-[1400px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
            <p className="text-muted-foreground">
              Technical analysis indicator screener for Nifty50 and most active equities 
            </p>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-6">
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

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-lg border bg-card p-4">
              <p className="mb-3 text-sm font-medium">EMA Signal</p>
              <RadioGroup
                defaultValue="ALL"
                value={emaFilter}
                onValueChange={setEmaFilter}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ALL" id="ema-all" />
                  <Label htmlFor="ema-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BUY" id="ema-buy" />
                  <Label htmlFor="ema-buy">Buy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SELL" id="ema-sell" />
                  <Label htmlFor="ema-sell">Sell</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <p className="mb-3 text-sm font-medium">SMA Signal</p>
              <RadioGroup
                defaultValue="ALL"
                value={smaFilter}
                onValueChange={setSmaFilter}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ALL" id="sma-all" />
                  <Label htmlFor="sma-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BUY" id="sma-buy" />
                  <Label htmlFor="sma-buy">Buy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SELL" id="sma-sell" />
                  <Label htmlFor="sma-sell">Sell</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <p className="mb-3 text-sm font-medium">MACD Crossover</p>
              <RadioGroup
                defaultValue="ALL"
                value={macdFilter}
                onValueChange={setMacdFilter}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ALL" id="macd-all" />
                  <Label htmlFor="macd-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="YES" id="macd-yes" />
                  <Label htmlFor="macd-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NO" id="macd-no" />
                  <Label htmlFor="macd-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <p className="mb-3 text-sm font-medium">RSI Condition</p>
              <RadioGroup
                defaultValue="ALL"
                value={rsiFilter}
                onValueChange={setRsiFilter}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ALL" id="rsi-all" />
                  <Label htmlFor="rsi-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OVERSOLD" id="rsi-oversold" />
                  <Label htmlFor="rsi-oversold">Oversold</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NEUTRAL" id="rsi-neutral" />
                  <Label htmlFor="rsi-neutral">Neutral</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <p className="mb-3 text-sm font-medium">Stochastic Condition</p>
              <RadioGroup
                defaultValue="ALL"
                value={stochFilter}
                onValueChange={setStochFilter}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ALL" id="stoch-all" />
                  <Label htmlFor="stoch-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OVERSOLD" id="stoch-oversold" />
                  <Label htmlFor="stoch-oversold">Oversold</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NEUTRAL" id="stoch-neutral" />
                  <Label htmlFor="stoch-neutral">Neutral</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-[640px] w-full rounded-lg" />
              </div>
            ) : filteredData ? (
              <StockTable data={filteredData} />
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
