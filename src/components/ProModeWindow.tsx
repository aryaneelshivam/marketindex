import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

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
      </div>
    </div>
  );
};