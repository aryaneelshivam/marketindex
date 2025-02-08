
import { type Sector } from "@/hooks/use-stock-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectorSelectionProps {
  sector: Sector;
  setSector: (value: Sector) => void;
  isAuthenticated: boolean;
}

export const SectorSelection = ({ sector, setSector, isAuthenticated }: SectorSelectionProps) => {
  return (
    <div className="w-full md:w-auto">
      <RadioGroup
        value={sector}
        onValueChange={(value) => setSector(value as Sector)}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="most_active" id="most_active" />
          <Label htmlFor="most_active" className="cursor-pointer">Most Active Equities 🔥</Label>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 opacity-75">
                <RadioGroupItem 
                  value="financial" 
                  id="financial" 
                  disabled={!isAuthenticated}
                />
                <Label 
                  htmlFor="financial" 
                  className={`cursor-pointer flex items-center gap-2 ${!isAuthenticated ? 'cursor-not-allowed' : ''}`}
                >
                  Financial Sector 💸
                  {!isAuthenticated && <Lock className="h-4 w-4" />}
                </Label>
              </div>
            </TooltipTrigger>
            {!isAuthenticated && (
              <TooltipContent>
                <p>Sign in to access Financial Sector data</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 opacity-75">
                <RadioGroupItem 
                  value="energy" 
                  id="energy" 
                  disabled={!isAuthenticated}
                />
                <Label 
                  htmlFor="energy" 
                  className={`cursor-pointer flex items-center gap-2 ${!isAuthenticated ? 'cursor-not-allowed' : ''}`}
                >
                  Energy Sector ♻️
                  {!isAuthenticated && <Lock className="h-4 w-4" />}
                </Label>
              </div>
            </TooltipTrigger>
            {!isAuthenticated && (
              <TooltipContent>
                <p>Sign in to access Energy Sector data</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </RadioGroup>
    </div>
  );
};
