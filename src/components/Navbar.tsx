import React from "react";

export const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">market index.in</span>
          </a>
        </div>
      </div>
    </nav>
  );
};