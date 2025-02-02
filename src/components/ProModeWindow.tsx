import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, ArrowRight, Info } from "lucide-react";

interface ProModeWindowProps {
  onProModeActivated: () => void;
  userEmail: string;
}

export const ProModeWindow = ({ onProModeActivated, userEmail }: ProModeWindowProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [proKey, setProKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const verifyProKey = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pro_keys')
        .select('*')
        .eq('key_value', proKey)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (data) {
        // Update the key's usage information
        const { error: updateError } = await supabase
          .from('pro_keys')
          .update({
            last_used_at: new Date().toISOString(),
            used_by: [...(data.used_by || []), userEmail]
          })
          .eq('id', data.id);

        if (updateError) throw updateError;

        toast({
          title: "Success!",
          description: "Pro Mode activated successfully.",
        });
        onProModeActivated();
        setIsOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Key",
          description: "The provided Pro Mode key is invalid or inactive.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify Pro Mode key.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetProKey = () => {
    window.open('https://tally.so/r/npJ428', '_blank');
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        Activate Pro Mode
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border bg-card p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Activate Pro Mode</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-muted/50 rounded-lg p-3 mb-4 flex items-start gap-2">
        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Enter the pro mode key to access 100+ stocks with report download. Logged-in users without pro access will be able to view only 50 listings.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Enter Pro Mode Key"
          value={proKey}
          onChange={(e) => setProKey(e.target.value)}
        />
        <Button
          className="w-full"
          onClick={verifyProKey}
          disabled={isLoading || !proKey}
        >
          {isLoading ? "Verifying..." : "Activate"}
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGetProKey}
        >
          Get Pro Key
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};