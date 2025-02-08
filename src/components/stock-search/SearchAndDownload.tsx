
import { Search, Lock, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchAndDownloadProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isAuthenticated: boolean;
  handleDownloadAnalysis: () => void;
}

export const SearchAndDownload = ({
  searchQuery,
  setSearchQuery,
  isAuthenticated,
  handleDownloadAnalysis,
}: SearchAndDownloadProps) => {
  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                disabled={!isAuthenticated}
              />
              {!isAuthenticated && (
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </TooltipTrigger>
          {!isAuthenticated && (
            <TooltipContent>
              <p>Sign in to search stocks</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleDownloadAnalysis}
              className="whitespace-nowrap"
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? (
                <Download className="w-4 h-4 mr-2" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Download Analysis
            </Button>
          </TooltipTrigger>
          {!isAuthenticated && (
            <TooltipContent>
              <p>Sign in to download analysis data</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
