import React from "react";
import { Button } from "./ui/button";
import { ExternalLink, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <Globe className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight">market index</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <img 
              src="https://www.openapis.org/wp-content/uploads/sites/3/2016/10/OpenAPI_Pantone-768x204.png" 
              alt="OpenAPI Badge" 
              className="h-4 object-contain"
            />
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a 
                href="https://marketatlas.vercel.app/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Market Atlas API Docs
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Sign Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/auth?mode=signin")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>
      <div className="w-full bg-black text-white py-2 px-4 flex items-center justify-center">
        <p className="text-sm">
          🎉 marketindex v1.0.0 has launched! Developed by Aryaneel Shivam
        </p>
      </div>
    </>
  );
};