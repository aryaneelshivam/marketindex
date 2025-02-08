
import { cn } from "@/lib/utils";

interface SignalProps {
  signal: string;
  className?: string;
}

export const Signal = ({ signal, className }: SignalProps) => {
  const getSignalColor = (signal: string) => {
    // Strong buy/sell signals
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
    
    // Oversold/Overbought
    if (signal === "OVERSOLD") {
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-semibold";
    }
    if (signal === "OVERBOUGHT") {
      return "bg-rose-500/20 text-rose-400 border-rose-500/50 font-semibold";
    }

    // YES signals as strong buy
    if (signal === "YES") {
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-semibold";
    }

    // Return empty string for neutral/other signals
    return "";
  };

  const signalColor = getSignalColor(signal.toUpperCase());

  // If no signal color is returned, render simple neutral text in orange
  if (!signalColor) {
    return (
      <span className="text-xs text-orange-400">
        Neutral
      </span>
    );
  }

  // Otherwise render the badge
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105",
        signalColor,
        className
      )}
    >
      {signal.toUpperCase()}
    </span>
  );
};
