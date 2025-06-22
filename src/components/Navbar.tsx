import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - SCIH */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              SCIH
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/events" className="text-gray-600 hover:text-gray-900">
              Events
            </Link>
            <Link href="/news" className="text-gray-600 hover:text-gray-900">
              News
            </Link>
          </div>

          {/* Right side - Auth Links */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/auth/register" className="text-gray-600 hover:text-gray-900">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}