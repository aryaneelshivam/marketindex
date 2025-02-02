import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Download } from "lucide-react";

export const Paywall = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      // Get user email
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      if (!email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to continue with the payment.",
        });
        return;
      }

      // Create payment session
      const { data, error } = await supabase.functions.invoke('create-payment', {
        method: 'POST',
        body: { email },
      });

      if (error) throw error;

      // Redirect to Cashfree payment page
      window.location.href = data.payment_link;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate payment. Please try again later.",
      });
    }
  };

  const handleDownload = async () => {
    try {
      // Check if user has a successful payment
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      if (!email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to download the analysis.",
        });
        return;
      }

      const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('customer_email', email)
        .eq('status', 'success')
        .limit(1);

      if (paymentError) throw paymentError;

      if (!payments || payments.length === 0) {
        toast({
          variant: "destructive",
          title: "Payment Required",
          description: "Please purchase the analysis report to download it.",
        });
        return;
      }

      // Download analysis
      const { data, error } = await supabase.functions.invoke('download-stock-analysis', {
        method: 'POST'
      });

      if (error) throw error;

      // Create a Blob from the base64 data
      const byteCharacters = atob(data.fileContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'stock-analysis.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download analysis. Please try again later.",
      });
    }
  };

  return (
    <div className="relative mt-8 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
      <div className="relative p-6 text-center space-y-4">
        <h3 className="text-xl font-semibold">Get Full Access</h3>
        <p className="text-muted-foreground">
          Sign in to view all stock listings and detailed market analysis
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
          <span className="text-muted-foreground">or</span>
          <button 
            onClick={handlePayment}
            className="flex items-center bg-black text-white px-4 py-2 rounded-xl hover:bg-black/90 transition-colors"
          >
            <img 
              src="https://cashfreelogo.cashfree.com/cashfreepayments/logosvgs/Group_4355.svg" 
              alt="Cashfree" 
              className="w-10 h-10"
            />
            <div className="flex flex-col ml-2 mr-2">
              <span className="text-sm mb-1">Download Full Report</span>
              <div className="flex items-center text-xs">
                <span>Powered By Cashfree</span>
                <img 
                  src="https://cashfreelogo.cashfree.com/cashfreepayments/logosvgs/Group_4355.svg" 
                  alt="Cashfree" 
                  className="w-4 h-4 ml-1"
                />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};