// app/api/test-auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { 
  validateCredentials, 
  createSession, 
  verifySession,
  setSessionCookie,
  clearSessionCookie 
} from '@/lib/auth-simple'

export const runtime = 'nodejs' // Required for server-side auth functions

export async function POST(request: NextRequest) {
  try {
    const { action, username, password, token } = await request.json()

    switch (action) {
      case 'validate':
        // Test credential validation
        const isValid = validateCredentials(username, password)
        return NextResponse.json({ 
          success: true, 
          isValid,
          message: isValid ? 'Credentials valid' : 'Credentials invalid'
        })

      case 'login':
        // Test full login flow
        if (!validateCredentials(username, password)) {
          return NextResponse.json({ 
            success: false, 
            message: 'Invalid credentials' 
          }, { status: 401 })
        }

        const sessionToken = await createSession(username)
        const response = NextResponse.json({ 
          success: true, 
          message: 'Login successful',
          hasToken: !!sessionToken
        })
        
        setSessionCookie(response, sessionToken)
        return response

      case 'verify':
        // Test token verification
        if (!token) {
          return NextResponse.json({ 
            success: false, 
            message: 'No token provided' 
          })
        }

        const sessionData = await verifySession(token)
        return NextResponse.json({ 
          success: true, 
          isValid: !!sessionData,
          sessionData: sessionData || null
        })

      case 'logout':
        // Test logout flow
        const logoutResponse = NextResponse.json({ 
          success: true, 
          message: 'Logged out successfully' 
        })
        
        clearSessionCookie(logoutResponse)
        return logoutResponse

      default:
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid action. Use: validate, login, verify, or logout' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Auth test endpoint - Use POST with action parameter',
    availableActions: ['validate', 'login', 'verify', 'logout'],
    example: {
      validate: { action: 'validate', username: 'admin', password: 'your_password' },
      login: { action: 'login', username: 'admin', password: 'your_password' },
      verify: { action: 'verify', token: 'your_jwt_token' },
      logout: { action: 'logout' }
    }
  })
}