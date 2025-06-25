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
      try {
        const res = await getProviders()
        setProviders(res)
      } catch (error) {
        console.error('Error fetching providers:', error)
      }
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Card container */}
      <div className="max-w-md w-full space-y-8 bg-card p-8 shadow-lg border border-border rounded-xl">
        {/* Header */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground">
            Sign in to SC Innovation Hub
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm bg-background"
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm pr-10 bg-background"
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
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </Toggle.Root>
            </div>
            {/* Submit button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition"
            >
              Sign In
            </button>
          </form>

          {/* Link to registration page */}
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Register here
            </a>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
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
                    className="group relative w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition"
                  >
                    {/* Google icon SVG */}
                    {provider.id === "google" && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
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