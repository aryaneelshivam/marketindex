import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Info } from "lucide-react";

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = mode === "signup" ? formData.get("password") as string : undefined;

    try {
      if (mode === "signup" && password) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;

        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        
        if (error) throw error;

        toast({
          title: "Success",
          description: "Check your email for the magic link to sign in.",
        });
      }

      // Redirect to home page after successful sign-in/sign-up
      navigate("/");
      
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

        {mode === "signup" && (
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
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : mode === "signup" ? "Create Account" : "Sign In"}
        </Button>
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