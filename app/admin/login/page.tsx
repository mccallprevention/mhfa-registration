// app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoHeader } from '@/components/ui/logo-header'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          username: credentials.username,
          password: credentials.password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Login successful, redirect to admin dashboard
        router.push('/admin')
        router.refresh()
      } else {
        setError(result.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mccall-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-mccall-gradient-blue rounded-2xl p-8 mb-6">
            <LogoHeader className="justify-center mb-4" />
            <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
            <p className="text-white/90 text-lg">Event Management System</p>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-mccall-navy">Sign In</CardTitle>
            <p className="text-gray-600 text-sm">Enter your credentials to access the admin dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}
              
              <div suppressHydrationWarning>
                <label htmlFor="username" className="block text-sm font-medium text-mccall-navy mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green focus:border-transparent transition-colors"
                  disabled={loading}
                  suppressHydrationWarning
                />
              </div>

              <div suppressHydrationWarning>
                <label htmlFor="password" className="block text-sm font-medium text-mccall-navy mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green focus:border-transparent transition-colors"
                  disabled={loading}
                  suppressHydrationWarning
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-mccall-navy hover:bg-mccall-navy/90 text-white font-semibold py-3 text-lg rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link 
            href="/"
            className="text-mccall-navy hover:text-mccall-green transition-colors text-sm font-medium"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    </div>
  )
}