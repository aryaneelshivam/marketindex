import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Info } from "lucide-react";

interface StockDetailsProps {
  symbol: string;
  onClose: () => void;
}

export function StockDetails({ symbol, onClose }: StockDetailsProps) {
  const isOpen = Boolean(symbol);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        {!symbol ? (
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
            <h2 className="text-2xl font-bold">{symbol}</h2>
            {/* We'll keep this simple for now since we don't have the stock data yet */}
            <p className="text-muted-foreground">Loading stock details...</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
