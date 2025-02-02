import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const Paywall = () => {
  const navigate = useNavigate();

  return (
    <div className="relative mt-8 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
      <div className="relative p-6 text-center space-y-4">
        <h3 className="text-xl font-semibold">Get Full Access</h3>
        <p className="text-muted-foreground">
          Sign in to view all stock listings and detailed market analysis
        </p>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    </div>
  );
};