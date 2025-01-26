import { cn } from "@/lib/utils";

interface SignalProps {
  signal: string;
  className?: string;
}

export const Signal = ({ signal, className }: SignalProps) => {
  const getSignalColor = (signal: string) => {
    switch (signal.toUpperCase()) {
      case "BUY":
        return "bg-signal-buy/10 text-signal-buy border-signal-buy";
      case "SELL":
        return "bg-signal-sell/10 text-signal-sell border-signal-sell";
      default:
        return "bg-signal-neutral/10 text-signal-neutral border-signal-neutral";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getSignalColor(signal),
        className
      )}
    >
      {signal.toUpperCase()}
    </span>
  );
};