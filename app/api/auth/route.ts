// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { 
  validateCredentials, 
  createSession, 
  setSessionCookie,
  clearSessionCookie 
} from '@/lib/auth-simple'

export const runtime = 'nodejs' // Required for server-side auth functions

export async function POST(request: NextRequest) {
  try {
    // Check if environment variables are set
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.NEXTAUTH_SECRET) {
      console.error('Missing required environment variables')
      return NextResponse.json({ 
        success: false, 
        message: 'Server configuration error' 
      }, { status: 500 })
    }

    const body = await request.json()
    const { action, username, password } = body

    switch (action) {
      case 'login':
        if (!username || !password) {
          return NextResponse.json({ 
            success: false, 
            message: 'Username and password are required' 
          }, { status: 400 })
        }

        if (!validateCredentials(username, password)) {
          return NextResponse.json({ 
            success: false, 
            message: 'Invalid credentials' 
          }, { status: 401 })
        }

        // Create session and set cookie
        const sessionToken = await createSession(username)
        const response = NextResponse.json({ 
          success: true, 
          message: 'Login successful'
        })
        
        setSessionCookie(response, sessionToken)
        return response

      case 'logout':
        const logoutResponse = NextResponse.json({ 
          success: true, 
          message: 'Logged out successfully' 
        })
        
        clearSessionCookie(logoutResponse)
        return logoutResponse

      default:
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid action' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error'
    }, { status: 500 })
  }
}