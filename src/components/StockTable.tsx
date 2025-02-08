
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Signal } from "./Signal";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { StockDetails } from "./StockDetails";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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

  const handleVote = async (symbol: string, voteType: 'bullish' | 'bearish') => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on stocks",
        variant: "destructive",
      });
      return;
    }

    try {
      if (userVotes[symbol] === voteType) {
        const { error } = await supabase
          .from('stock_votes')
          .delete()
          .eq('user_id', session.user.id)
          .eq('stock_symbol', symbol);

        if (error) throw error;
        
        const newUserVotes = { ...userVotes };
        delete newUserVotes[symbol];
        setUserVotes(newUserVotes);
      } else {
        const { error } = await supabase
          .from('stock_votes')
          .upsert({
            user_id: session.user.id,
            stock_symbol: symbol,
            vote_type: voteType
          }, {
            onConflict: 'stock_symbol,user_id'
          });

        if (error) throw error;
        
        setUserVotes({ ...userVotes, [symbol]: voteType });
      }

      toast({
        title: "Vote recorded",
        description: `Your ${voteType} vote for ${symbol} has been recorded`,
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <div className="rounded-lg border border-border/40 overflow-x-auto bg-card/30 backdrop-blur-sm shadow-lg">
      <Table>
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
        <TableBody>
          {data.map((stock, index) => (
            <TableRow
              key={stock.Symbol}
              className={`hover:bg-muted/30 transition-all duration-200 cursor-pointer backdrop-blur-sm ${
                selectedStock === stock.Symbol ? "bg-muted/50" : ""
              } ${getRowBackgroundColor(
                stock["Last EMA Signal"],
                stock["Last SMA Signal"]
              )}`}
              onClick={() => setSelectedStock(stock.Symbol)}
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={userVotes[stock.Symbol] === 'bullish' ? 'default' : 'outline'}
                      className={`flex items-center gap-1 transition-all duration-200 ${userVotes[stock.Symbol] === 'bullish' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                      onClick={() => handleVote(stock.Symbol, 'bullish')}
                    >
                      👍 {voteCounts[stock.Symbol]?.bullish || 0}
                    </Button>
                    <Button
                      size="sm"
                      variant={userVotes[stock.Symbol] === 'bearish' ? 'default' : 'outline'}
                      className={`flex items-center gap-1 transition-all duration-200 ${userVotes[stock.Symbol] === 'bearish' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                      onClick={() => handleVote(stock.Symbol, 'bearish')}
                    >
                      👎 {voteCounts[stock.Symbol]?.bearish || 0}
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
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
