"use client"

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { User, Calendar, Building2, Trash2 } from 'lucide-react'

export default function AccountDashboard() {
  // Get session data and redirect if not authenticated
  const { data: session, status } = useSession()
  
  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white" style={{ backgroundColor: '#FFFFFF' }}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to signin if not authenticated
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Dashboard</h1>
          <div className="space-y-2">
            <h2 className="text-xl text-gray-700">Hi {session.user?.name || session.user?.email}!</h2>
            <p className="text-gray-600">You&apos;re one step closer to being plugged into South Carolina&apos;s innovation scene.</p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {/* Profile Settings Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Profile Settings</CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/profile-settings">
                  Manage Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Saved Events Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Saved Events</CardTitle>
              <CardDescription>
                View and manage your bookmarked events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/saved-events">
                  View Saved Events
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Saved Companies Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Saved Companies</CardTitle>
              <CardDescription>
                Access your bookmarked companies and organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/saved-companies">
                  View Saved Companies
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Delete Account Section */}
        <div className="border-t pt-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Account
              </CardTitle>
              <CardDescription className="text-red-600">
                Permanently delete your account and all associated data. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={() => {
                  // TODO: Implement delete account functionality
                  console.log('Delete account clicked')
                }}
              >
                Delete My Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}