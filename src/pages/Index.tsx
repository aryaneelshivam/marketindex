import { useStockData, type Sector } from "@/hooks/use-stock-data";
import { StockTable } from "@/components/StockTable";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search, Lock, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Paywall } from "@/components/Paywall";
import { Button } from "@/components/ui/button";
import { NewsPanel } from "@/components/NewsPanel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Index = () => {
  const [period, setPeriod] = useState("3mo");
  const [sector, setSector] = useState<Sector>("most_active");
  const [emaFilter, setEmaFilter] = useState("ALL");
  const [smaFilter, setSmaFilter] = useState("ALL");
  const [macdFilter, setMacdFilter] = useState("ALL");
  const [rsiFilter, setRsiFilter] = useState("ALL");
  const [stochFilter, setStochFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const { data: rawData, isLoading, error } = useStockData(period, sector);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDownloadAnalysis = () => {
    if (!rawData) return;
    
    const csvContent = [
      ["Symbol", "EMA Signal", "SMA Signal", "MACD Crossover", "Volume Divergence", "ADX Strength", "RSI Value", "RSI Condition", "Stochastic K", "Stochastic D", "Stochastic Condition"],
      ...rawData.map(stock => [
        stock.Symbol,
        stock["Last EMA Signal"],
        stock["Last SMA Signal"],
        stock["MACD Crossover"],
        stock["Volume Divergence"],
        stock["ADX Strength"],
        stock.RSI.Value,
        stock.RSI.Condition,
        stock.Stochastic.k_value,
        stock.Stochastic.d_value,
        stock.Stochastic.Condition
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-analysis-${sector}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredData = rawData?.filter((stock) => {
    if (!isAuthenticated) return true;
    
    const matchesSearch = searchQuery === "" || 
      stock.Symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEma = emaFilter === "ALL" || stock["Last EMA Signal"] === emaFilter;
    const matchesSma = smaFilter === "ALL" || stock["Last SMA Signal"] === smaFilter;
    const matchesMacd = macdFilter === "ALL" || 
      (macdFilter === "YES" ? stock["MACD Crossover"] === "YES" : stock["MACD Crossover"] === "NO");
    const matchesRsi = rsiFilter === "ALL" || stock.RSI.Condition === rsiFilter;
    const matchesStoch = stochFilter === "ALL" || stock.Stochastic.Condition === stochFilter;
    
    return matchesSearch && matchesEma && matchesSma && matchesMacd && matchesRsi && matchesStoch;
  });

  const displayData = !isAuthenticated 
    ? filteredData?.slice(0, 20) 
    : filteredData;

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
        <div className="mx-auto max-w-[1800px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Monitor equities across sectors</h1>
            <p className="text-muted-foreground">
              Technical analysis indicator screener for Indian equities
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-auto">
              <RadioGroup
                value={sector}
                onValueChange={(value) => setSector(value as Sector)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="most_active" id="most_active" />
                  <Label htmlFor="most_active" className="cursor-pointer">Most Active Equities 🔥</Label>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 opacity-75">
                        <RadioGroupItem 
                          value="financial" 
                          id="financial" 
                          disabled={!isAuthenticated}
                        />
                        <Label 
                          htmlFor="financial" 
                          className={`cursor-pointer flex items-center gap-2 ${!isAuthenticated ? 'cursor-not-allowed' : ''}`}
                        >
                          Financial Sector 💸
                          {!isAuthenticated && <Lock className="h-4 w-4" />}
                        </Label>
                      </div>
                    </TooltipTrigger>
                    {!isAuthenticated && (
                      <TooltipContent>
                        <p>Sign in to access Financial Sector data</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 opacity-75">
                        <RadioGroupItem 
                          value="energy" 
                          id="energy" 
                          disabled={!isAuthenticated}
                        />
                        <Label 
                          htmlFor="energy" 
                          className={`cursor-pointer flex items-center gap-2 ${!isAuthenticated ? 'cursor-not-allowed' : ''}`}
                        >
                          Energy Sector ♻️
                          {!isAuthenticated && <Lock className="h-4 w-4" />}
                        </Label>
                      </div>
                    </TooltipTrigger>
                    {!isAuthenticated && (
                      <TooltipContent>
                        <p>Sign in to access Energy Sector data</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </RadioGroup>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search stocks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                        disabled={!isAuthenticated}
                      />
                      {!isAuthenticated && (
                        <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </TooltipTrigger>
                  {!isAuthenticated && (
                    <TooltipContent>
                      <p>Sign in to search stocks</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleDownloadAnalysis}
                      className="whitespace-nowrap"
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? (
                        <Download className="w-4 h-4 mr-2" />
                      ) : (
                        <Lock className="w-4 h-4 mr-2" />
                      )}
                      Download Analysis
                    </Button>
                  </TooltipTrigger>
                  {!isAuthenticated && (
                    <TooltipContent>
                      <p>Sign in to download analysis data</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4 text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-muted-foreground animate-pulse">
                    Fetching latest market data from server and performing analysis...
                  </p>
                </div>
              ) : displayData ? (
                <>
                  <StockTable data={displayData} />
                  {!isAuthenticated && <Paywall />}
                </>
              ) : null}
            </div>

            <NewsPanel />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
