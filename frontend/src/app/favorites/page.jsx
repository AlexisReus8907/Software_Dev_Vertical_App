'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getFavorites } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function FavoritesPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) { router.push('/login'); return }
    const load = async () => {
      try {
        const data = await getFavorites(token)
        setFavorites(data.favorites || [])
      } catch {
        setError('Could not load your saved articles.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token, router])

  return (
    <div className="container">
      <div className="page-header">
        <p className="page-header-tag">Your Reading List</p>
        <h1 className="page-header-title">Saved Articles</h1>
        <p className="page-header-sub">
          {user?.email ? `Signed in as ${user.email}` : 'Your private collection'}
        </p>
      </div>

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          <span className="loading-text">Retrieving your archive…</span>
        </div>
      )}

      {error && !loading && (
        <div className="empty-state">
          <div className="empty-icon">⚠</div>
          <p className="empty-title">Could not load</p>
          <p className="empty-text">{error}</p>
        </div>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">✦</div>
          <p className="empty-title">Your archive is empty</p>
          <p className="empty-text">
            Summarise an article on the homepage, then save it here.
          </p>
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <>
          <div className="section-label">
            {favorites.length} Saved {favorites.length === 1 ? 'Article' : 'Articles'}
          </div>
          <div className="fav-grid">
            {favorites.map((fav, i) => (
              <div
                key={fav.id || i}
                className="fav-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="card-source">Saved Article</span>
                <h2 className="fav-title">{fav.title}</h2>
                {fav.summary && <p className="fav-summary">{fav.summary}</p>}
                {fav.url && (
                  <a
                    className="fav-link"
                    href={fav.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read Original →
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
