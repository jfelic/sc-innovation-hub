"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Navigate immediately when search term is cleared
  useEffect(() => {
    if (searchTerm === "") {
      router.push('/');
    }
  }, [searchTerm, router]);

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
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        backgroundImage: "url('/hero-img.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/80"></div>
      
      <div className="relative max-w-3xl mx-auto text-center px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl shadow-black/80">
          Connect With Innovative Companies in SC
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto drop-shadow-lg shadow-black/60">
          Explore the thriving innovation ecosystem across South Carolina
        </p>
        <form className="flex justify-center" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row w-full max-w-md shadow-2xl gap-2 sm:gap-0">
            <Input
              type="text"
              placeholder="Search companies, categories..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value === "") {
                  router.push('/');
                }
              }}
              className="sm:rounded-r-none sm:border-r-0 focus-visible:ring-2 focus-visible:ring-red-500 bg-white/98 backdrop-blur-sm border-white/20 h-12 text-base"
              style={{ '--tw-ring-color': '#0B4168' } as React.CSSProperties}
            />
            <Button
              type="submit"
              size="lg"
              className="sm:rounded-l-none text-white shadow-lg hover:opacity-90 transition-opacity h-12 min-h-[48px] px-6"
              style={{ backgroundColor: '#0B4168' }}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="text-base">Search</span>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}