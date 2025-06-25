"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Calendar, Newspaper, User, LogOut, ChevronDown, Settings, Building } from 'lucide-react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  // Get session data and status
  const { data: session, status } = useSession()
  // Get current pathname to highlight active nav item
  const pathname = usePathname()

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
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className={`transition-colors flex items-center space-x-1 ${
                pathname === '/' 
                  ? 'bg-red-100 text-red-700 hover:bg-red-100' 
                  : 'hover:bg-red-50 text-black hover:text-red-600'
              }`}
            >
              <Link href="/" className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>Directory</span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className={`transition-colors flex items-center space-x-1 ${
                pathname === '/events' 
                  ? 'bg-red-100 text-red-700 hover:bg-red-100' 
                  : 'hover:bg-red-50 text-black hover:text-red-600'
              }`}
            >
              <Link href="/events" className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className={`transition-colors flex items-center space-x-1 ${
                pathname === '/news' 
                  ? 'bg-red-100 text-red-700 hover:bg-red-100' 
                  : 'hover:bg-red-50 text-black hover:text-red-600'
              }`}
            >
              <Link href="/news" className="flex items-center space-x-1">
                <Newspaper className="h-4 w-4" />
                <span>News</span>
              </Link>
            </Button>
          </div>

          {/* Right side - Auth Links with Session Management */}
          <div className="flex items-center space-x-3">
            {status === "loading" ? (
              // Show loading state while checking session
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : session ? (
              // User is logged in - show dropdown menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-gray-50 text-black transition-colors flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>{session.user?.name || session.user?.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/account-dashboard" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // User is not logged in - show login/register buttons
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}