import { useStockData, type Sector } from "@/hooks/use-stock-data";
import { StockTable } from "@/components/StockTable";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Paywall } from "@/components/Paywall";
import { SectorSelection } from "@/components/stock-sectors/SectorSelection";
import { SearchAndDownload } from "@/components/stock-search/SearchAndDownload";
import { PeriodSelection } from "@/components/stock-period/PeriodSelection";
import { StockFilters } from "@/components/stock-filters/StockFilters";
import { StockDetails } from "@/components/StockDetails";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  
  const { data: rawData, isLoading, error } = useStockData(period, sector);
  const { toast } = useToast();

  const isMobile = useIsMobile();

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

  useEffect(() => {
    if (rawData && rawData.length > 0 && !selectedStock) {
      setSelectedStock(rawData[0].Symbol);
    }
  }, [rawData, selectedStock]);

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
            <SectorSelection
              sector={sector}
              setSector={setSector}
              isAuthenticated={isAuthenticated}
            />
            <SearchAndDownload
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isAuthenticated={isAuthenticated}
              handleDownloadAnalysis={handleDownloadAnalysis}
            />
          </div>

          <PeriodSelection period={period} setPeriod={setPeriod} />

          <StockFilters
            emaFilter={emaFilter}
            setEmaFilter={setEmaFilter}
            smaFilter={smaFilter}
            setSmaFilter={setSmaFilter}
            macdFilter={macdFilter}
            setMacdFilter={setMacdFilter}
            rsiFilter={rsiFilter}
            setRsiFilter={setRsiFilter}
            stochFilter={stochFilter}
            setStochFilter={setStochFilter}
          />

          <div className="flex flex-col lg:flex-row gap-6">
            <div className={`w-full ${!isMobile ? 'lg:w-[70%]' : ''} min-w-0`}>
              {isLoading ? (
                <div className="space-y-4 text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-muted-foreground animate-pulse">
                    Fetching latest market data from server and performing analysis...
                  </p>
                </div>
              ) : displayData ? (
                <>
                  <StockTable 
                    data={displayData} 
                    selectedStock={selectedStock}
                    onSelectStock={setSelectedStock}
                  />
                  {!isAuthenticated && <Paywall />}
                </>
              ) : null}
            </div>
            
            {!isMobile && (
              <div className="w-full lg:w-[30%] min-w-0">
                <StockDetails symbol={selectedStock} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
