import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface PaywallProps {
  isAuthenticated?: boolean;
}

export const Paywall = ({ isAuthenticated }: PaywallProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative mt-8">
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/95 to-background"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)'
        }}
      />
      
      {/* Content */}
      <div className="relative p-8 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {isAuthenticated ? "Upgrade to Pro Mode" : "Get Full Access"}
          </h3>
          <p className="text-muted-foreground text-lg">
            {isAuthenticated 
              ? "Enter your Pro Mode key to unlock unlimited stock analysis, enable offline downloads, and access all 100+ stocks."
              : "Sign-in to access 20+ stock analysis and Go-Pro to enable search functionality and view detailed market insights of 100+ listings."}
          </p>
          <div className="pt-4">
            {!isAuthenticated && (
              <Button 
                onClick={() => navigate("/auth")}
                size="lg"
                className="min-w-[200px]"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};