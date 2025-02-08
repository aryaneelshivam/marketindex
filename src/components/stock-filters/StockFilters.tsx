
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StockFiltersProps {
  emaFilter: string;
  setEmaFilter: (value: string) => void;
  smaFilter: string;
  setSmaFilter: (value: string) => void;
  macdFilter: string;
  setMacdFilter: (value: string) => void;
  rsiFilter: string;
  setRsiFilter: (value: string) => void;
  stochFilter: string;
  setStochFilter: (value: string) => void;
}

export const StockFilters = ({
  emaFilter,
  setEmaFilter,
  smaFilter,
  setSmaFilter,
  macdFilter,
  setMacdFilter,
  rsiFilter,
  setRsiFilter,
  stochFilter,
  setStochFilter,
}: StockFiltersProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      <div className="rounded-lg border bg-card p-4">
        <p className="mb-3 text-sm font-medium">EMA Signal</p>
        <RadioGroup
          value={emaFilter}
          onValueChange={setEmaFilter}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ALL" id="ema-all" />
            <Label htmlFor="ema-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BUY" id="ema-buy" />
            <Label htmlFor="ema-buy">Buy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SELL" id="ema-sell" />
            <Label htmlFor="ema-sell">Sell</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="mb-3 text-sm font-medium">SMA Signal</p>
        <RadioGroup
          value={smaFilter}
          onValueChange={setSmaFilter}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ALL" id="sma-all" />
            <Label htmlFor="sma-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BUY" id="sma-buy" />
            <Label htmlFor="sma-buy">Buy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SELL" id="sma-sell" />
            <Label htmlFor="sma-sell">Sell</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="mb-3 text-sm font-medium">MACD Crossover</p>
        <RadioGroup
          value={macdFilter}
          onValueChange={setMacdFilter}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ALL" id="macd-all" />
            <Label htmlFor="macd-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="YES" id="macd-yes" />
            <Label htmlFor="macd-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="NO" id="macd-no" />
            <Label htmlFor="macd-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="mb-3 text-sm font-medium">RSI Condition</p>
        <RadioGroup
          value={rsiFilter}
          onValueChange={setRsiFilter}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ALL" id="rsi-all" />
            <Label htmlFor="rsi-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="OVERSOLD" id="rsi-oversold" />
            <Label htmlFor="rsi-oversold">Oversold</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="NEUTRAL" id="rsi-neutral" />
            <Label htmlFor="rsi-neutral">Neutral</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="mb-3 text-sm font-medium">Stochastic Condition</p>
        <RadioGroup
          value={stochFilter}
          onValueChange={setStochFilter}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ALL" id="stoch-all" />
            <Label htmlFor="stoch-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="OVERSOLD" id="stoch-oversold" />
            <Label htmlFor="stoch-oversold">Oversold</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="NEUTRAL" id="stoch-neutral" />
            <Label htmlFor="stoch-neutral">Neutral</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
