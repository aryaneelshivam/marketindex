
import { TableCell, TableRow } from "@/components/ui/table";
import { Signal } from "@/components/Signal";
import { TrendingDown, TrendingUp } from "lucide-react";
import { VotingButtons } from "./VotingButtons";

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
  userVote?: string;
  votes: {
    bullish: number;
    bearish: number;
  };
  onSelect: () => void;
}

export const StockTableRow = ({ 
  stock, 
  index, 
  isSelected, 
  userVote,
  votes,
  onSelect 
}: StockTableRowProps) => {
  const getRowBackgroundColor = (emaSignal: string, smaSignal: string) => {
    if (emaSignal === "BUY" && smaSignal === "BUY") {
      return "bg-green-950/20 backdrop-blur-sm";
    }
    if (emaSignal === "SELL" && smaSignal === "SELL") {
      return "bg-red-950/20 backdrop-blur-sm";
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

  const getRSIColor = (value: number) => {
    if (value >= 70) return "text-signal-sell font-semibold";
    if (value <= 30) return "text-signal-buy font-semibold";
    return "text-muted-foreground";
  };

  const getStochColor = (kValue: number, dValue: number) => {
    const avgValue = (kValue + dValue) / 2;
    if (avgValue >= 80) return "text-signal-sell font-semibold";
    if (avgValue <= 20) return "text-signal-buy font-semibold";
    return "text-muted-foreground";
  };

  const getNeutralPillColor = (signal: string) => {
    if (signal === "NEUTRAL") return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100";
    return "";
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
      <TableCell className="font-medium text-foreground/90 flex items-center">
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
          <span className={`text-sm font-medium ${getRSIColor(stock.RSI.Value)}`}>
            {stock.RSI.Value.toFixed(2)}
          </span>
          <Signal 
            signal={stock.RSI.Condition} 
            className={`w-fit ${getNeutralPillColor(stock.RSI.Condition)}`}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className={`text-sm font-medium ${getStochColor(
            stock.Stochastic.k_value,
            stock.Stochastic.d_value
          )}`}>
            <div>K: {stock.Stochastic.k_value.toFixed(2)}</div>
            <div>D: {stock.Stochastic.d_value.toFixed(2)}</div>
          </div>
          <Signal 
            signal={stock.Stochastic.Condition} 
            className={`w-fit ${getNeutralPillColor(stock.Stochastic.Condition)}`}
          />
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <VotingButtons
          symbol={stock.Symbol}
          userVote={userVote}
          votes={votes}
        />
      </TableCell>
    </TableRow>
  );
};
