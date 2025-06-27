"use client"

// Import React hooks and Next.js navigation
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Import icons from lucide-react and Toggle from Radix UI
import { UserPlus, Eye, EyeOff, Mail, Lock } from "lucide-react"
import * as Toggle from "@radix-ui/react-toggle"

export default function RegisterPage() {
  // Router for programmatic navigation
  const router = useRouter()
  // State for error messages
  const [error, setError] = useState<string | null>(null)
  // State for loading indicator
  const [loading, setLoading] = useState(false)
  // State to track error shake animation
  const [errorShake, setErrorShake] = useState(false)
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false)
  // State to toggle confirm password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Handles form submission for registration
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Get form values
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      // Trigger shake animation to show error is fresh
      setErrorShake(true)
      setTimeout(() => setErrorShake(false), 500)
      setLoading(false)
      return
    }

    try {
      // Send registration data to the API route
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      })

      // If registration fails, show error
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Something went wrong")
      }

      // On success, redirect to sign-in page
      router.push("/auth/signin?registered=true")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Card container */}
      <div className="max-w-md w-full space-y-8 bg-card p-8 shadow-lg border border-border rounded-xl">
        {/* Header with icon and title */}
        <div className="flex flex-col items-center">
          {/* UserPlus icon for visual cue */}
          <UserPlus className="w-10 h-10 text-primary mb-2" />
          <h2 className="text-center text-3xl font-extrabold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            {/* Link to sign-in page */}
            <Link href="/auth/signin" className="text-primary hover:text-primary/80 font-medium">
              sign in to your account
            </Link>
          </p>
        </div>

        {/* Registration form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error message display */}
          {error && (
            <div className={`bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded transition-transform duration-200 ${
              errorShake ? 'animate-pulse scale-105' : ''
            }`}>
              {error}
            </div>
          )}

          {/* Input fields */}
          <div className="rounded-md space-y-4">
            {/* First and last name fields side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="relative">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm bg-background"
                  placeholder="First name"
                />
                {/* Icon inside input */}
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {/* Last Name */}
              <div className="relative">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm bg-background"
                  placeholder="Last name"
                />
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            {/* Email field with icon */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm bg-background"
                placeholder="Email address"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {/* Password field with icon and visibility toggle */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm bg-background"
                placeholder="Password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
            {/* Confirm Password field with icon and visibility toggle */}
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm bg-background"
                placeholder="Confirm Password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {/* Radix UI Toggle for confirm password visibility */}
              <Toggle.Root
                pressed={showConfirmPassword}
                onPressedChange={setShowConfirmPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                aria-label="Toggle confirm password visibility"
                tabIndex={0}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </Toggle.Root>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}