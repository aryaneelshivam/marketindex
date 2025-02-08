
import { cn } from "@/lib/utils";

interface SignalProps {
  signal: string;
  className?: string;
}

export const Signal = ({ signal, className }: SignalProps) => {
  const getSignalColor = (signal: string) => {
    // Strong signals
    if (signal === "BUY") {
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-semibold";
    }
    if (signal === "SELL") {
      return "bg-rose-500/20 text-rose-400 border-rose-500/50 font-semibold";
    }
    
    // Weak signals
    if (signal === "WEAK BUY") {
      return "bg-emerald-400/10 text-emerald-300 border-emerald-400/30";
    }
    if (signal === "WEAK SELL") {
      return "bg-rose-400/10 text-rose-300 border-rose-400/30";
    }
    
    // Handle YES/NO signals as strong/weak
    if (signal === "YES") {
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-semibold";
    }
    if (signal === "NO") {
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50";
    }

    // Neutral signals (including NEUTRAL explicitly)
    return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-all duration-200 hover:scale-105",
        getSignalColor(signal.toUpperCase()),
        className
      )}
    >
      {signal.toUpperCase()}
    </span>
  );
};
