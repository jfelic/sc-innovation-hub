"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <section 
      className="relative py-24 overflow-hidden"
      style={{
        backgroundImage: "url('/hero-img.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Darker overlay for better contrast */}
      {/* <div className="absolute inset-0 bg-black/40"></div> */}
      
      {/* Optional: Add a gradient overlay for even better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/80"></div>
      
      <div className="relative max-w-3xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl shadow-black/80">
          Connect With Innovative Companies in SC
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg shadow-black/60">
          Explore the thriving innovation ecosystem across South Carolina
        </p>
        <form className="flex justify-center" onSubmit={handleSubmit}>
          <div className="flex w-full max-w-md shadow-2xl">
            <Input
              type="text"
              placeholder="Search companies, categories, or counties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-r-none border-r-0 focus-visible:ring-2 focus-visible:ring-red-500 bg-white/98 backdrop-blur-sm border-white/20"
              style={{ '--tw-ring-color': '#0B4168' } as React.CSSProperties}
            />
            <Button
              type="submit"
              className="rounded-l-none text-white shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#0B4168' }}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}