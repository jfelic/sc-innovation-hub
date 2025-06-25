"use client"

// Import NextAuth helpers, React hooks, icons, and Radix UI Toggle
import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Globe, Eye, EyeOff } from "lucide-react"
import * as Toggle from "@radix-ui/react-toggle"

interface Provider {
  id: string
  name: string
  type: string
}

export default function SignInPage() {
  // State for available providers (Google, Credentials, etc.)
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false)
  // Get URL search params to check for registration success
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')

  // Fetch authentication providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  // Handles sign-in with email/password (credentials)
  async function handleCredentialsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // Use NextAuth's signIn for credentials
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // Handle error (show a toast or error message)
        console.error(result.error)
      } else {
        // On success, redirect to home
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Card container */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg border border-gray-200 rounded-xl">
        {/* Header */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Sign in to SC Innovation Hub
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect with South Carolina's innovation ecosystem
          </p>
        </div>

        {/* Registration success message */}
        {registered && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">Registration successful!</p>
            <p className="text-sm">Please sign in with your new account.</p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {/* Email/password sign-in form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            {/* Password field with visibility toggle */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                placeholder="Password"
              />
              {/* Radix UI Toggle for password visibility */}
              <Toggle.Root
                pressed={showPassword}
                onPressedChange={setShowPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                aria-label="Toggle password visibility"
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </Toggle.Root>
            </div>
            {/* Submit button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Sign In
            </button>
          </form>

          {/* Link to registration page */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Register here
            </a>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social provider buttons (e.g., Google) */}
          {providers &&
            Object.values(providers)
              .filter((provider) => provider.id !== "credentials") // Only show non-credentials providers
              .map((provider) => (
                <div key={provider.name}>
                  <button
                    onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                    className="group relative w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    {/* Use Globe icon for Google, or replace with a Google SVG/icon if desired */}
                    {provider.id === "google" && (
                      <Globe className="w-5 h-5" />
                    )}
                    Sign in with {provider.name}
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}