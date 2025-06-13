// Auth configuration
// This file is used to configure authentication for the application using NextAuth.js and Prisma.

import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter" // PrismaAdapter connects NextAuth to your Prisma database
import GoogleProvider from "next-auth/providers/google" // GoogleProvider enables Google OAuth sign-in
import CredentialsProvider from "next-auth/providers/credentials" // CredentialsProvider enables custom email/password authentication
import bcrypt from "bcryptjs" // bcrypt is used for securely hashing and comparing passwords
import { prisma } from "./db" // Import your Prisma client instance

// Main NextAuth configuration object
export const authOptions: NextAuthOptions = {
  // Use Prisma as the database adapter
  adapter: PrismaAdapter(prisma),
  // List of authentication providers
  providers: [
    // Google OAuth provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, // Google client ID from environment variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google client secret from environment variables
    }),
    // Credentials provider for email/password sign-in
    CredentialsProvider({
      name: "Credentials", // Name shown in the UI (if rendered)
      credentials: {
        email: { label: "Email", type: "email" }, // Email input field
        password: { label: "Password", type: "password" }, // Password input field
      },
      // The authorize function is called when a user tries to sign in with credentials
      async authorize(credentials) {
        // Ensure both email and password are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
    
        // Find the user in the database by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });
    
        // If user doesn't exist or has no password (e.g., Google-only account), fail
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }
    
        // Compare the provided password with the hashed password in the database
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
    
        // If the password doesn't match, fail
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
    
        // If everything checks out, return the user object
        return user;
      }
    }),
  ],
  // Callback functions to customize session and JWT behavior
  callbacks: {
    // Called whenever a session is checked or created
    session: async ({ session, token }) => {
      // If the session has a user and a token subject (user ID)
      if (session?.user && token?.sub) {
        session.user.id = token.sub
        // Optionally, fetch the user's full name from the database
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { firstName: true, lastName: true }
        })
        // If found, set the session user's name to "First Last"
        if (user) {
          session.user.name = `${user.firstName} ${user.lastName}`.trim()
        }
      }
      return session
    },
    // Called whenever a JWT is created or updated
    jwt: async ({ user, token }) => {
      // If a user object is present (on sign-in), add the user ID to the token
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  // Use JWTs for session management
  session: {
    strategy: "jwt",
  },
  // Custom pages configuration
  pages: {
    signIn: "/auth/signin", // Custom sign-in page route
  },
}