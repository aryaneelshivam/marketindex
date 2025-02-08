
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

interface VoteCount {
  bullish: number;
  bearish: number;
}

interface VoteData {
  [key: string]: VoteCount;
}

interface StockTableProps {
  data: StockData[];
}

export const StockTable = ({ data }: StockTableProps) => {
  const [selectedStock, setSelectedStock] = useState<string | null>(data[0]?.Symbol || null);
  const [voteCounts, setVoteCounts] = useState<VoteData>({});
  const [userVotes, setUserVotes] = useState<{[key: string]: string}>({});
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

  useEffect(() => {
    if (!session) return;

    const fetchVoteCounts = async () => {
      const { data: votes, error } = await supabase
        .from('stock_votes')
        .select('stock_symbol, vote_type');

      if (error) {
        console.error('Error fetching votes:', error);
        return;
      }

      const counts: VoteData = {};
      votes.forEach((vote) => {
        if (!counts[vote.stock_symbol]) {
          counts[vote.stock_symbol] = { bullish: 0, bearish: 0 };
        }
        counts[vote.stock_symbol][vote.vote_type as 'bullish' | 'bearish']++;
      });
      setVoteCounts(counts);
    };

    const fetchUserVotes = async () => {
      const { data: userVoteData, error } = await supabase
        .from('stock_votes')
        .select('stock_symbol, vote_type')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching user votes:', error);
        return;
      }

      const votes: {[key: string]: string} = {};
      userVoteData.forEach((vote) => {
        votes[vote.stock_symbol] = vote.vote_type;
      });
      setUserVotes(votes);
    };

    fetchVoteCounts();
    fetchUserVotes();

    const channel = supabase
      .channel('stock-votes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stock_votes' },
        () => {
          fetchVoteCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

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
              userVote={userVotes[stock.Symbol]}
              votes={voteCounts[stock.Symbol] || { bullish: 0, bearish: 0 }}
              onSelect={() => setSelectedStock(stock.Symbol)}
            />
          ))}
        </TableBody>
      </Table>
      <StockDetails 
        symbol={selectedStock || ""} 
        onClose={() => setSelectedStock(null)} 
      />
    </div>
  );
};
