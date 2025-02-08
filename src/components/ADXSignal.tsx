
import { cn } from "@/lib/utils";

interface ADXSignalProps {
  strength: string;
  className?: string;
}

export const ADXSignal = ({ strength, className }: ADXSignalProps) => {
  const getSignalColor = (strength: string) => {
    if (strength === "STRONG") {
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-semibold";
    }
    if (strength === "WEAK") {
      return "bg-rose-500/20 text-rose-400 border-rose-500/50 font-semibold";
    }
    return "";
  };

  const signalColor = getSignalColor(strength);

  // If no signal color is returned, render simple neutral text
  if (!signalColor) {
    return (
      <span className="text-xs text-orange-400">
        Neutral
      </span>
    );
  }

  // Display "Strong" or "Weak" instead of the actual signal
  const displayText = strength === "STRONG" ? "Strong" : "Weak";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105",
        signalColor,
        className
      )}
    >
      {displayText}
    </span>
  );
};
