import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Signal } from "./Signal";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { StockDetails } from "./StockDetails";
import { useStockData } from "@/hooks/use-stock-data";

interface StockTableProps {
  period: string;
  sector: string;
}

export const StockTable = ({ period, sector }: StockTableProps) => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const { data, isLoading } = useStockData(period, sector);

  const getRowBackgroundColor = (emaSignal: string, smaSignal: string) => {
    if (emaSignal === "BUY" && smaSignal === "BUY") {
      return "bg-[#F2FCE2] dark:bg-green-950/30";
    }
    if (emaSignal === "SELL" && smaSignal === "SELL") {
      return "bg-red-50 dark:bg-red-950/30";
    }
    return "";
  };

  const getTrendIcon = (emaSignal: string, smaSignal: string) => {
    if (emaSignal === "BUY" && smaSignal === "BUY") {
      return <TrendingUp className="w-4 h-4 text-signal-buy ml-2" />;
    }
    if (emaSignal === "SELL" && smaSignal === "SELL") {
      return <TrendingDown className="w-4 h-4 text-signal-sell ml-2" />;
    }
    return null;
  };

  const getRSIColor = (value?: number) => {
    if (!value) return "text-muted-foreground";
    if (value >= 70) return "text-signal-sell font-semibold";
    if (value <= 30) return "text-signal-buy font-semibold";
    return "text-muted-foreground";
  };

  const getStochColor = (kValue?: number, dValue?: number) => {
    if (!kValue || !dValue) return "text-muted-foreground";
    const avgValue = (kValue + dValue) / 2;
    if (avgValue >= 80) return "text-signal-sell font-semibold";
    if (avgValue <= 20) return "text-signal-buy font-semibold";
    return "text-muted-foreground";
  };

  const getNeutralPillColor = (signal: string) => {
    if (signal === "NEUTRAL") return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100";
    return "";
  };

  if (isLoading) {
    return (
      <div className="space-y-4 text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground animate-pulse">
          Fetching latest market data...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px] font-semibold">#</TableHead>
            <TableHead className="w-[120px] font-semibold">Symbol</TableHead>
            <TableHead className="font-semibold">EMA Signal</TableHead>
            <TableHead className="font-semibold">SMA Signal</TableHead>
            <TableHead className="font-semibold">MACD Crossover</TableHead>
            <TableHead className="font-semibold">Volume Divergence</TableHead>
            <TableHead className="font-semibold">ADX Strength</TableHead>
            <TableHead className="font-semibold">RSI</TableHead>
            <TableHead className="font-semibold">Stochastic</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((stock, index) => (
            <TableRow
              key={stock.Symbol}
              className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                selectedStock === stock.Symbol ? 'bg-muted' : ''
              } ${getRowBackgroundColor(
                stock["Last EMA Signal"],
                stock["Last SMA Signal"]
              )}`}
              onClick={() => setSelectedStock(stock.Symbol)}
            >
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium flex items-center">
                {stock.Symbol}
                {getTrendIcon(stock["Last EMA Signal"], stock["Last SMA Signal"])}
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
                  signal={stock["ADX Strength"]} 
                  className={getNeutralPillColor(stock["ADX Strength"])}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className={`text-sm font-medium ${getRSIColor(stock.RSI?.Value)}`}>
                    {stock.RSI?.Value?.toFixed(2) ?? 'N/A'}
                  </span>
                  {stock.RSI?.Condition && (
                    <Signal 
                      signal={stock.RSI.Condition} 
                      className={`w-fit ${getNeutralPillColor(stock.RSI.Condition)}`}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className={`text-sm font-medium ${getStochColor(
                    stock.Stochastic?.K_Value,
                    stock.Stochastic?.D_Value
                  )}`}>
                    <div>K: {stock.Stochastic?.K_Value?.toFixed(2) ?? 'N/A'}</div>
                    <div>D: {stock.Stochastic?.D_Value?.toFixed(2) ?? 'N/A'}</div>
                  </div>
                  {stock.Stochastic?.Condition && (
                    <Signal 
                      signal={stock.Stochastic.Condition} 
                      className={`w-fit ${getNeutralPillColor(stock.Stochastic.Condition)}`}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <StockDetails 
        symbol={selectedStock || ''} 
        onClose={() => setSelectedStock(null)} 
      />
    </div>
  );
};