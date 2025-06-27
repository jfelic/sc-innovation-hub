"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar, Newspaper, User, LogOut, ChevronDown, Settings, Building, Menu, X } from 'lucide-react'
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
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group py-2">
              <Image 
                src="/scih-logo.svg" 
                alt="SCIH Logo" 
                width={180} 
                height={48}
                className="h-10 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
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

          {/* Desktop Auth Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3">
            {status === "loading" ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-gray-50 text-black transition-colors flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{session.user?.name || session.user?.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[10000]">
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {/* Navigation Links */}
            <Link 
              href="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === '/' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Building className="h-5 w-5" />
              <span>Directory</span>
            </Link>
            <Link 
              href="/events" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === '/events' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link 
              href="/news" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === '/news' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Newspaper className="h-5 w-5" />
              <span>News</span>
            </Link>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>
            
            {/* Auth Links */}
            {status === "loading" ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mx-3"></div>
            ) : session ? (
              <div className="space-y-2">
                <Link 
                  href="/account-dashboard" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Account Dashboard</span>
                </Link>
                <button 
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link 
                  href="/auth/signin" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block mx-3 px-3 py-2 rounded-md text-base font-medium text-white transition-colors"
                  style={{ backgroundColor: '#0B4168' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}