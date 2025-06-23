import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - SCIH */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              SCIH
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/events">Events</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/news">News</Link>
            </Button>
          </div>

          {/* Right side - Auth Links */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/signin">Login</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}