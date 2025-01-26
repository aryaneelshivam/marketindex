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
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Symbol</TableHead>
            <TableHead>EMA Signal</TableHead>
            <TableHead>SMA Signal</TableHead>
            <TableHead>MACD Crossover</TableHead>
            <TableHead>Volume Divergence</TableHead>
            <TableHead>ADX Strength</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((stock) => (
            <TableRow key={stock.Symbol} className="hover:bg-muted/50">
              <TableCell className="font-medium">{stock.Symbol}</TableCell>
              <TableCell>
                <Signal signal={stock["Last EMA Signal"]} />
              </TableCell>
              <TableCell>
                <Signal signal={stock["Last SMA Signal"]} />
              </TableCell>
              <TableCell>
                <Signal signal={stock["MACD Crossover"] === "YES" ? "BUY" : "NEUTRAL"} />
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