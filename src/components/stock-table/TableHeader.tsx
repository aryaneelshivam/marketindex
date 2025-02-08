
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const StockTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-background/50 hover:bg-background/50 backdrop-blur-md border-b border-border/40">
        <TableHead className="w-[80px] font-semibold text-foreground/80">
          #
        </TableHead>
        <TableHead className="w-[120px] font-semibold text-foreground/80">
          Symbol
        </TableHead>
        <TableHead className="font-semibold text-foreground/80">
          EMA Signal
        </TableHead>
        <TableHead className="font-semibold text-foreground/80">
          SMA Signal
        </TableHead>
        <TableHead className="font-semibold text-foreground/80">
          MACD Crossover
        </TableHead>
        <TableHead className="font-semibold text-foreground/80">
          Volume Divergence
        </TableHead>
        <TableHead className="font-semibold text-foreground/80">
          ADX Strength
        </TableHead>
        <TableHead className="font-semibold text-foreground/80">
          RSI
        </TableHead>
        <TableHead className="font-semibold text-foreground/80">
          Stochastic
        </TableHead>
        <TableHead className="font-semibold text-foreground/80">
          Analysis rating
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
