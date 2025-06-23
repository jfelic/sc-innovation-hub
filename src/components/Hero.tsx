import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-blue-50 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
          Connect With Innovative Companies in SC
        </h1>
        <form className="flex justify-center">
          <div className="flex w-full max-w-md">
            <Input
              type="text"
              placeholder="Search companies, categories, or counties..."
              className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              className="rounded-l-none bg-blue-600 hover:bg-blue-700"
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