import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Signal } from "./Signal";

interface StockData {
  Symbol: string;
  "Last EMA Signal": string;
  "Last SMA Signal": string;
  "MACD Crossover": string;
  "Volume Divergence": string;
  "ADX Strength": string;
}

interface StockTableProps {
  data: StockData[];
}

export const StockTable = ({ data }: StockTableProps) => {
  const getRowBackgroundColor = (emaSignal: string, smaSignal: string) => {
    if (emaSignal === "BUY" && smaSignal === "BUY") {
      return "bg-[#F2FCE2]";
    }
    if (emaSignal === "SELL" && smaSignal === "SELL") {
      return "bg-red-50";
    }
    return "";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead className="w-[120px]">Symbol</TableHead>
            <TableHead>EMA Signal</TableHead>
            <TableHead>SMA Signal</TableHead>
            <TableHead>MACD Crossover</TableHead>
            <TableHead>Volume Divergence</TableHead>
            <TableHead>ADX Strength</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((stock, index) => (
            <TableRow
              key={stock.Symbol}
              className={`hover:bg-muted/50 transition-colors ${getRowBackgroundColor(
                stock["Last EMA Signal"],
                stock["Last SMA Signal"]
              )}`}
            >
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium">{stock.Symbol}</TableCell>
              <TableCell>
                <Signal signal={stock["Last EMA Signal"]} />
              </TableCell>
              <TableCell>
                <Signal signal={stock["Last SMA Signal"]} />
              </TableCell>
              <TableCell>
                <Signal
                  signal={stock["MACD Crossover"] === "YES" ? "BUY" : "NEUTRAL"}
                />
              </TableCell>
              <TableCell>
                <Signal signal={stock["Volume Divergence"]} />
              </TableCell>
              <TableCell>
                <Signal signal={stock["ADX Strength"]} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};