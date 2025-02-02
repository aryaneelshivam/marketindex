import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const Paywall = () => {
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
            Get Full Access
          </h3>
          <p className="text-muted-foreground text-lg">
            Sign-in to access 200+ stock analysis, enable search functionality and download analysis reports offline.
          </p>
          <div className="pt-4">
            <Button 
              onClick={() => navigate("/auth")}
              size="lg"
              className="min-w-[200px]"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};