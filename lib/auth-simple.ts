// lib/auth-simple.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'admin-session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Get the secret key for JWT signing
function getSecretKey(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
  return new TextEncoder().encode(secret)
}

// Interface for our session data - compatible with JWTPayload
export interface SessionData {
  username: string
  role: 'admin'
  expires: number
  [key: string]: string | number // More specific than 'any' - JWT payloads are typically strings/numbers
}

// Validate credentials against environment variables
export function validateCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminUsername || !adminPassword) {
    console.error('Admin credentials not configured in environment variables')
    return false
  }

  return username === adminUsername && password === adminPassword
}

// Create a session token
export async function createSession(username: string): Promise<string> {
  const expires = Date.now() + SESSION_DURATION
  const sessionData: SessionData = {
    username,
    role: 'admin',
    expires
  }

  const token = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(expires))
    .sign(getSecretKey())

  return token
}

// Verify and decode a session token
export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    const sessionData = payload as unknown as SessionData

    // Check if session has expired
    if (Date.now() > sessionData.expires) {
      return null
    }

    return sessionData
  } catch (error) {
    console.error('Session verification failed:', error)
    return null
  }
}

// Get current session from cookies (server-side)
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
    return null
  }

  return await verifySession(sessionCookie.value)
}

// Set session cookie in response
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/'
  })
}

// Clear session cookie
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })
}

// Check if user is authenticated (for middleware)
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  
  if (!sessionCookie?.value) {
    return false
  }

  const session = await verifySession(sessionCookie.value)
  return session !== null
}

// Create redirect response for unauthorized access
export function createLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL('/admin/login', request.url)
  return NextResponse.redirect(loginUrl)
}