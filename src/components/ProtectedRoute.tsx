"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

// Component to protect routes that require authentication
export function ProtectedRoute({ children, redirectTo = "/auth/signin" }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // If session is loading, wait
    if (status === "loading") return

    // If no session exists, redirect to signin
    if (!session) {
      router.push(redirectTo)
    }
  }, [session, status, router, redirectTo])

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If no session, don't render children (will redirect)
  if (!session) {
    return null
  }

  // If authenticated, render the protected content
  return <>{children}</>
}