
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PeriodSelectionProps {
  period: string;
  setPeriod: (value: string) => void;
}

export const PeriodSelection = ({ period, setPeriod }: PeriodSelectionProps) => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <RadioGroup
        value={period}
        onValueChange={setPeriod}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1mo" id="1mo" />
          <Label htmlFor="1mo">1 Month</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3mo" id="3mo" />
          <Label htmlFor="3mo">3 Months</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="6mo" id="6mo" />
          <Label htmlFor="6mo">6 Months</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1y" id="1y" />
          <Label htmlFor="1y">1 Year</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
