import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectorTabs } from "@/components/SectorTabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [period, setPeriod] = useState("3mo");
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('download-stock-analysis');
      
      if (error) throw error;

      // Convert base64 to blob
      const byteCharacters = atob(data.fileContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stock-analysis.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Analysis downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download analysis",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-[1400px] space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
              <p className="text-muted-foreground">
                Technical analysis indicator screener for Nifty50 and most active equities 
              </p>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download Analysis
            </Button>
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