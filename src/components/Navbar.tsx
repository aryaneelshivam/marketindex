
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ExternalLink, TrendingUpDown, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const NavButtons = () => (
    <div className="flex flex-col gap-4 md:flex-row">
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
      {isAuthenticated ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      ) : (
        <>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              navigate("/auth?mode=signup");
              setIsOpen(false);
            }}
          >
            Sign Up
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigate("/auth?mode=signin");
              setIsOpen(false);
            }}
          >
            Sign In
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <TrendingUpDown className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight">market index</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-4">
            <img 
              src="https://www.openapis.org/wp-content/uploads/sites/3/2016/10/OpenAPI_Pantone-768x204.png" 
              alt="OpenAPI Badge" 
              className="h-4 object-contain"
            />
            <div className="hidden md:flex md:items-center md:gap-4">
              <NavButtons />
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <NavButtons />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <div className="w-full bg-black text-white py-2 px-4 flex items-center justify-center">
        <p className="text-sm">
          🚀 marketindex v2.0.0 has launched! Developed by Aryaneel Shivam
        </p>
      </div>
    </>
  );
};

