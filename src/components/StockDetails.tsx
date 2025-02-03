import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Info } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { cn } from "@/lib/utils";

interface StockDetailsProps {
  stock: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StockDetails({ stock, isOpen, onClose }: StockDetailsProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        {!stock ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
            <div className="p-4 rounded-full bg-muted/30">
              <Info className="w-8 h-8 text-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold tracking-tight">
                No Stock Selected
              </h3>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Click on any stock in the table to view detailed technical analysis and metrics
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{stock.Symbol}</h2>
            <p className="text-lg">Current Price: {formatNumber(stock.Price)}</p>
            <p className="text-sm text-muted-foreground">Market Cap: {formatNumber(stock.MarketCap)}</p>
            <p className="text-sm text-muted-foreground">52 Week High: {formatNumber(stock.WeekHigh)}</p>
            <p className="text-sm text-muted-foreground">52 Week Low: {formatNumber(stock.WeekLow)}</p>
            <p className="text-sm text-muted-foreground">P/E Ratio: {formatNumber(stock.PERatio)}</p>
            <p className="text-sm text-muted-foreground">Dividend Yield: {formatNumber(stock.DividendYield)}</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
