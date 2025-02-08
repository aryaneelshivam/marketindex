
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VotingButtonsProps {
  symbol: string;
  userVote?: string;
  votes: {
    bullish: number;
    bearish: number;
  };
}

export const VotingButtons = ({ symbol, userVote, votes }: VotingButtonsProps) => {
  const { toast } = useToast();

  const handleVote = async (voteType: 'bullish' | 'bearish') => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on stocks",
        variant: "destructive",
      });
      return;
    }

    try {
      if (userVote === voteType) {
        const { error } = await supabase
          .from('stock_votes')
          .delete()
          .eq('user_id', session.user.id)
          .eq('stock_symbol', symbol);

        if (error) throw error;
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={userVote === 'bullish' ? 'default' : 'outline'}
          className={`flex items-center gap-1 transition-all duration-200 ${userVote === 'bullish' ? 'bg-green-500 hover:bg-green-600' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleVote('bullish');
          }}
        >
          👍 {votes.bullish || 0}
        </Button>
        <Button
          size="sm"
          variant={userVote === 'bearish' ? 'default' : 'outline'}
          className={`flex items-center gap-1 transition-all duration-200 ${userVote === 'bearish' ? 'bg-red-500 hover:bg-red-600' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleVote('bearish');
          }}
        >
          👎 {votes.bearish || 0}
        </Button>
      </div>
    </div>
  );
};
