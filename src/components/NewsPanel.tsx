
import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ChevronDown } from "lucide-react";

export const NewsPanel: FC = () => {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Today's news and events</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Market</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-background/50">
            All
          </Badge>
          <Badge variant="outline" className="bg-background/50">
            News
          </Badge>
          <Badge variant="outline" className="bg-background/50">
            Macro
          </Badge>
          <Badge variant="outline" className="bg-background/50">
            Earnings
          </Badge>
          <Badge variant="outline" className="bg-background/50">
            Corp Action
          </Badge>
          <Badge variant="outline" className="bg-background/50">
            Dividends
          </Badge>
        </div>
      </div>

      <div className="divide-y divide-border">
        <NewsItem
          symbol="BEMHY"
          title="Bemco Hydraulics to convene EGM"
          description="Bemco Hydraulics announced that an Extra Ordinary General Meeting (EGM) of the Company will be held on..."
          time="47 MINUTES AGO"
          category="CAPITAL MARKET - LIVE"
          trend="down"
        />
        
        <NewsItem
          symbol="JYOTISTRUC"
          title="Rights Issue"
          description="9:26 Rights Issue of Equity Shares"
          time="1 HOUR AGO"
          category="CORPORATE ACTION"
          trend="down"
          exDate="Feb 10, 2025"
        />
        
        <NewsItem
          symbol="ASTERDM"
          title="Cash Dividend"
          description="Interim dividend announced"
          time="2 HOURS AGO"
          category="DIVIDENDS"
          trend="down"
          exDate="Feb 10, 2025"
        />
      </div>
    </div>
  );
};

interface NewsItemProps {
  symbol: string;
  title: string;
  description: string;
  time: string;
  category: string;
  trend: "up" | "down";
  exDate?: string;
}

const NewsItem: FC<NewsItemProps> = ({
  symbol,
  title,
  description,
  time,
  category,
  trend,
  exDate
}) => {
  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${trend === 'down' ? 'text-red-500 border-red-500/20 bg-red-500/10' : 'text-green-500 border-green-500/20 bg-green-500/10'}`}>
            {symbol} {trend === 'down' && <ArrowDown className="h-3 w-3 ml-1" />}
          </Badge>
        </div>
        {exDate && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Ex Date</div>
            <div className="font-medium">{exDate}</div>
          </div>
        )}
      </div>
      
      <h4 className="mt-2 font-medium">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
      
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{time}</span>
        <span>•</span>
        <span>{category}</span>
      </div>
    </div>
  );
};
