'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { token, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const linkClass = (path) =>
    pathname === path ? 'nav-link nav-link-active' : 'nav-link'

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-left">{today}</span>

        <Link href="/" className="navbar-logo">
          <span className="masthead">
            The <span className="masthead-accent">Chronicle</span>
          </span>
          <span className="tagline">Informed · Intelligent · Independent</span>
        </Link>

        <div className="navbar-right">
          <Link href="/" className={linkClass('/')}>News</Link>
          {token && (
            <Link href="/favorites" className={linkClass('/favorites')}>Saved</Link>
          )}
          {token ? (
            <button className="nav-btn" onClick={handleLogout}>Sign Out</button>
          ) : (
            <>
              <Link href="/login" className={linkClass('/login')}>Sign In</Link>
              <Link href="/signup" className="nav-btn nav-btn-filled">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
