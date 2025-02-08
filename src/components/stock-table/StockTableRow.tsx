
import { TableCell, TableRow } from "@/components/ui/table";
import { Signal } from "@/components/Signal";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useStockPrice } from "@/hooks/use-stock-data";
import { Skeleton } from "@/components/ui/skeleton";

interface StockTableRowProps {
  stock: {
    Symbol: string;
    "Last EMA Signal": string;
    "Last SMA Signal": string;
    "MACD Crossover": string;
    "Volume Divergence": string;
    "ADX Strength": string;
    RSI: {
      Value: number;
      Condition: string;
    };
    Stochastic: {
      k_value: number;
      d_value: number;
      Condition: string;
    };
  };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const StockTableRow = ({ 
  stock, 
  index, 
  isSelected, 
  onSelect 
}: StockTableRowProps) => {
  const { data: priceData, isLoading } = useStockPrice(stock.Symbol);

  const getRowBackgroundColor = (emaSignal: string, smaSignal: string) => {
    if (emaSignal === "BUY" && smaSignal === "BUY") {
      return "bg-green-950/10 backdrop-blur-sm";
    }
    if (emaSignal === "SELL" && smaSignal === "SELL") {
      return "bg-red-950/10 backdrop-blur-sm";
    }
    return "";
  };

  const getTrendIcon = (stock: StockTableRowProps['stock']) => {
    // Count buy signals
    let buySignals = 0;
    let totalSignals = 0;

    // Check EMA Signal
    if (stock["Last EMA Signal"] === "BUY") buySignals++;
    if (stock["Last EMA Signal"] !== "NEUTRAL") totalSignals++;

    // Check SMA Signal
    if (stock["Last SMA Signal"] === "BUY") buySignals++;
    if (stock["Last SMA Signal"] !== "NEUTRAL") totalSignals++;

    // Check MACD
    if (stock["MACD Crossover"] === "YES") buySignals++;
    if (stock["MACD Crossover"] !== "NEUTRAL") totalSignals++;

    // Check RSI
    if (stock.RSI.Condition === "BUY") buySignals++;
    if (stock.RSI.Condition !== "NEUTRAL") totalSignals++;

    // Check Stochastic
    if (stock.Stochastic.Condition === "BUY") buySignals++;
    if (stock.Stochastic.Condition !== "NEUTRAL") totalSignals++;

    // Calculate if majority are buy signals
    const isMajorityBuy = buySignals > totalSignals / 2;

    if (totalSignals === 0) return null;
    if (isMajorityBuy) {
      return <TrendingUp className="w-6 h-6 text-signal-buy" />;
    }
    return <TrendingDown className="w-6 h-6 text-signal-sell" />;
  };

  const getNeutralPillColor = (signal: string) => {
    if (signal === "NEUTRAL") return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100";
    return "";
  };

  const getRSIClass = (value: number) => {
    if (value >= 70) return "text-red-500";
    if (value <= 30) return "text-green-500";
    return "text-muted-foreground";
  };

  const getStochasticClass = (value: number) => {
    if (value >= 80) return "text-red-500";
    if (value <= 20) return "text-green-500";
    return "text-muted-foreground";
  };

  const getADXSignal = (strength: string) => {
    if (strength === "STRONG") return "STRONG";
    if (strength === "WEAK") return "WEAK";
    return strength; // Return the original value if not STRONG/WEAK
  };

  const getADXClass = (signal: string) => {
    if (signal === "STRONG") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
    if (signal === "WEAK") return "bg-red-500/20 text-red-400 border-red-500/50";
    return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100";
  };

  return (
    <TableRow
      className={`group transition-all duration-200 cursor-pointer backdrop-blur-sm border-b border-border/40 hover:bg-muted/30 ${
        isSelected ? "bg-muted/50" : ""
      } ${getRowBackgroundColor(
        stock["Last EMA Signal"],
        stock["Last SMA Signal"]
      )}`}
      onClick={onSelect}
    >
      <TableCell className="font-medium text-muted-foreground">
        {index + 1}
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span className="text-foreground/90">{stock.Symbol}</span>
          <span className="text-xs text-muted-foreground">NSE</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : (
          `₹${priceData?.currentPrice}`
        )}
      </TableCell>
      <TableCell className={`font-medium ${priceData?.change && priceData.change < 0 ? 'text-red-500' : 'text-green-500'}`}>
        {isLoading ? (
          <Skeleton className="h-4 w-16" />
        ) : (
          `${priceData?.change?.toFixed(2)}%`
        )}
      </TableCell>
      <TableCell>
        {getTrendIcon(stock)}
      </TableCell>
      <TableCell>
        <Signal signal={stock["Last EMA Signal"]} />
      </TableCell>
      <TableCell>
        <Signal signal={stock["Last SMA Signal"]} />
      </TableCell>
      <TableCell>
        <Signal
          signal={stock["MACD Crossover"] === "YES" ? "BUY" : "NEUTRAL"}
          className={getNeutralPillColor(stock["MACD Crossover"] === "YES" ? "BUY" : "NEUTRAL")}
        />
      </TableCell>
      <TableCell>
        <Signal 
          signal={stock["Volume Divergence"]} 
          className={getNeutralPillColor(stock["Volume Divergence"])}
        />
      </TableCell>
      <TableCell>
        <Signal 
          signal={getADXSignal(stock["ADX Strength"])}
          className={getADXClass(getADXSignal(stock["ADX Strength"]))}
        />
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${getRSIClass(stock.RSI.Value)}`}>
            {stock.RSI.Value.toFixed(2)}
          </span>
          <Signal 
            signal={stock.RSI.Condition} 
            className={getNeutralPillColor(stock.RSI.Condition)}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <div className="flex gap-1 text-xs">
            <span className={getStochasticClass(stock.Stochastic.k_value)}>
              K: {stock.Stochastic.k_value.toFixed(2)}
            </span>
            <span className={getStochasticClass(stock.Stochastic.d_value)}>
              D: {stock.Stochastic.d_value.toFixed(2)}
            </span>
          </div>
          <Signal 
            signal={stock.Stochastic.Condition} 
            className={getNeutralPillColor(stock.Stochastic.Condition)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

