import React from "react";
import { Button } from "./ui/button";
import { ExternalLink, Github } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">market index.in</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="sm"
            className="bg-black hover:bg-black/90"
            asChild
          >
            <a 
              href="https://github.com/lovable-grin/stock-signal-simplifier" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
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
            variant="outline"
            size="sm"
            asChild
          >
            <a 
              href="https://market-index.onrender.com/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Market Index API Docs
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
};