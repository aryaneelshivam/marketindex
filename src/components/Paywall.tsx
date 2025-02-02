import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const Paywall = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for payment success on component mount and URL change
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('order_id');

      if (!orderId) return;

      try {
        const { data: payments, error } = await supabase
          .from('payments')
          .select('*')
          .eq('order_id', orderId)
          .eq('status', 'success')
          .limit(1);

        if (error) throw error;

        if (payments && payments.length > 0) {
          // Payment successful, trigger download
          handleDownload();
          // Clear URL parameters
          window.history.replaceState({}, '', window.location.pathname);
          // Show success message
          toast({
            title: "Payment Successful",
            description: "Your payment was successful. Your report is being downloaded.",
          });
        }
      } catch (error) {
        console.error('Payment status check error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify payment status. Please try again.",
        });
      }
    };

    checkPaymentStatus();
  }, [window.location.search]);

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

      // Redirect to Cashfree payment form
      window.location.href = "https://payments.cashfree.com/forms/marketindex";

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

      toast({
        title: "Success",
        description: "Your analysis report is being downloaded.",
      });
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
          <Button 
            onClick={handlePayment}
            className="bg-primary hover:bg-primary/90"
          >
            Download Full Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};
