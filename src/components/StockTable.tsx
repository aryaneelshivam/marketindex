
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { StockDetails } from "./StockDetails";
import { supabase } from "@/integrations/supabase/client";
import { StockTableHeader } from "./stock-table/TableHeader";
import { StockTableRow } from "./stock-table/StockTableRow";

interface RSIData {
  Value: number;
  Condition: string;
}

interface StochasticData {
  k_value: number;
  d_value: number;
  Condition: string;
}

interface StockData {
  Symbol: string;
  "Last EMA Signal": string;
  "Last SMA Signal": string;
  "MACD Crossover": string;
  "Volume Divergence": string;
  "ADX Strength": string;
  RSI: RSIData;
  Stochastic: StochasticData;
}

interface StockTableProps {
  data: StockData[];
  onStockSelect?: (symbol: string) => void;  // Added this prop definition
}

export const StockTable = ({ data, onStockSelect }: StockTableProps) => {
  const [selectedStock, setSelectedStock] = useState<string | null>(data[0]?.Symbol || null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    onStockSelect?.(symbol);  // Call the prop function if it exists
  };

  return (
    <div className="rounded-lg border border-border/40 overflow-x-auto bg-card/30 backdrop-blur-sm shadow-lg">
      <Table>
        <StockTableHeader />
        <TableBody>
          {data.map((stock, index) => (
            <StockTableRow
              key={stock.Symbol}
              stock={stock}
              index={index}
              isSelected={selectedStock === stock.Symbol}
              onSelect={() => handleStockSelect(stock.Symbol)}
            />
          ))}
        </TableBody>
      </Table>
      <StockDetails symbol={selectedStock} />
    </div>
  );
};
