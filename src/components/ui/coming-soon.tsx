import React from "react";
import { Clock, Wrench, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ComingSoon() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
          <p className="text-lg text-gray-600 mb-6">
            This site is under active development. We're working hard to bring you new features and content.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-full mb-8">
          <Wrench className="h-4 w-4" />
          <span>Currently in development</span>
        </div>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>
    </div>
  );
}