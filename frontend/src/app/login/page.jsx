'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginUser(email, password)
      login(data.access_token, data.user)
      router.push('/')
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-head">
          <div className="auth-logo">
            The <span className="auth-logo-accent">Chronicle</span>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to access your saved articles</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              className="field-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="field-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          New reader? <Link href="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
