
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const StockTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-background/50 hover:bg-background/50 backdrop-blur-md border-b border-border/40">
        <TableHead className="w-[80px] font-medium text-muted-foreground">
          S.no
        </TableHead>
        <TableHead className="w-[180px] font-medium text-muted-foreground">
          Symbol
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          Price
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          Change
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          Trend
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          EMA Signal
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          SMA Signal
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          MACD
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          Volume
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          ADX
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          RSI
        </TableHead>
        <TableHead className="font-medium text-muted-foreground">
          Stochastic
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
