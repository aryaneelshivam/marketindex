import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectorTabs } from "@/components/SectorTabs";

const Index = () => {
  const [period, setPeriod] = useState("3mo");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-[1400px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
            <p className="text-muted-foreground">
              Technical analysis indicator screener for Nifty50 and most active equities 
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <RadioGroup
                defaultValue="3mo"
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

            <SectorTabs period={period} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;