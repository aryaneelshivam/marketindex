import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Info } from "lucide-react";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?mode=signin`,
          },
        });
        
        if (error) throw error;

        // Show persistent toast with progress bar
        toast({
          title: "Account created successfully!",
          description: "You will be redirected to the home page in 10 seconds. Please check your email for confirmation link.",
          duration: 10000,
        });

        // Start progress bar
        let timeLeft = 0;
        const interval = setInterval(() => {
          timeLeft += 1;
          setProgress(timeLeft * 10);
          
          if (timeLeft >= 10) {
            clearInterval(interval);
            navigate("/");
          }
        }, 1000);
        
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;

        toast({
          title: "Success",
          description: "Signed in successfully.",
        });

        navigate("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to authenticate. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{mode === "signup" ? "Create Account" : "Sign In"}</h2>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-muted/50 p-4">
          <Info className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {mode === "signup" 
              ? "Create an account to access all features"
              : "Sign in to access your account"}
          </p>
        </div>
      </div>

      {mode === "signup" && (
        <Alert>
          <AlertDescription className="text-sm text-muted-foreground">
            After creating your account, you'll receive a confirmation email. 
            Please click the confirmation link and then sign in through the website.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : mode === "signup" ? "Create Account" : "Sign In"}
        </Button>

        {isLoading && mode === "signup" && progress > 0 && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              Redirecting in {10 - Math.floor(progress / 10)} seconds...
            </p>
          </div>
        )}
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
        </span>
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => navigate(`/auth?mode=${mode === "signup" ? "signin" : "signup"}`)}
        >
          {mode === "signup" ? "Sign In" : "Create Account"}
        </Button>
      </div>
    </div>
  );
};