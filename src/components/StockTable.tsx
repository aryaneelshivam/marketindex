
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
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
  selectedStock: string | null;
  onSelectStock: (symbol: string) => void;
}

export const StockTable = ({ data, selectedStock, onSelectStock }: StockTableProps) => {
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

  return (
    <div className="rounded-lg border border-border/40 overflow-hidden bg-background shadow-lg w-full h-[calc(100vh-12rem)]">
      <div className="overflow-y-auto h-full">
        <div className="overflow-x-auto">
          <Table>
            <StockTableHeader />
            <TableBody>
              {data.map((stock, index) => (
                <StockTableRow
                  key={stock.Symbol}
                  stock={stock}
                  index={index}
                  isSelected={selectedStock === stock.Symbol}
                  onSelect={() => onSelectStock(stock.Symbol)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
