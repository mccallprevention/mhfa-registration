// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated, createLoginRedirect } from '@/lib/auth-simple'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const startTime = Date.now()

  // Add security headers to all responses
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Only run auth middleware for admin routes
  if (pathname.startsWith('/admin')) {
    console.log(`🔐 Auth check for: ${pathname}`)

    // Allow access to login page without authentication
    if (pathname === '/admin/login') {
      // If user is already authenticated and tries to access login page,
      // redirect them to the admin dashboard
      const authenticated = await isAuthenticated(request)
      if (authenticated) {
        console.log(`↩️  Authenticated user redirected from login to dashboard`)
        const adminUrl = new URL('/admin', request.url)
        const redirectResponse = NextResponse.redirect(adminUrl)
        
        // Copy security headers to redirect response
        response.headers.forEach((value, key) => {
          redirectResponse.headers.set(key, value)
        })
        
        return redirectResponse
      }
      console.log(`✅ Unauthenticated user accessing login page`)
      return response
    }

    // For all other admin routes, check authentication
    const authenticated = await isAuthenticated(request)
    
    if (!authenticated) {
      console.log(`❌ Unauthenticated access attempt to: ${pathname}`)
      const loginRedirect = createLoginRedirect(request)
      
      // Copy security headers to redirect response
      response.headers.forEach((value, key) => {
        loginRedirect.headers.set(key, value)
      })
      
      return loginRedirect
    }

    console.log(`✅ Authenticated access to: ${pathname}`)
    const duration = Date.now() - startTime
    console.log(`⏱️  Auth check completed in ${duration}ms`)
    
    return response
  }

  // For all non-admin routes, continue without any checks
  return response
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
    // Exclude static files and API routes that don't need protection
    '/((?!api|_next/static|_next/image|favicon.ico|img_assets).*)',
  ]
}