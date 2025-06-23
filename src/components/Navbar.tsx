import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Calendar, Newspaper } from 'lucide-react'
import Image from 'next/image'

export function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Left side - Enhanced Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group py-2">
              <Image 
                src="/scih-logo.svg" 
                alt="SCIH Logo" 
                width={240} 
                height={64}
                className="h-16 w-auto max-h-16 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Center - Enhanced Navigation Links */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild className="hover:bg-red-50 text-black hover:text-red-600 transition-colors">
              <Link href="/events" className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-red-50 text-black hover:text-red-600 transition-colors">
              <Link href="/news" className="flex items-center space-x-1">
                <Newspaper className="h-4 w-4" />
                <span>News</span>
              </Link>
            </Button>
          </div>

          {/* Right side - Enhanced Auth Links */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100 text-black transition-colors">
              <Link href="/auth/signin">Login</Link>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              asChild 
              className="text-white shadow-md hover:shadow-lg transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: '#0B4168' }}
            >
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}