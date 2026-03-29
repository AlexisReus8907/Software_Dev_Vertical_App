'use client'

import { useState, useEffect } from 'react'
import { fetchNews } from '@/lib/api'
import ArticleCard from '@/components/ArticleCard'

const TOPICS = ['Technology', 'India', 'Science', 'Business', 'Health', 'World', 'Climate']

export default function NewsClient() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('technology')
  const [input, setInput] = useState('')

  const load = async (term) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchNews(term)
      const valid = (data.articles || []).filter(
        a => a.title && a.title !== '[Removed]'
      )
      setArticles(valid)
    } catch {
      setError('Could not fetch news. Is your backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(search) }, [search])

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim()) { setSearch(input.trim()); setInput('') }
  }

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Daily Intelligence · AI-Powered Edition</p>
          <h1 className="hero-title">
            Today&apos;s <span className="hero-title-em">News,</span>
            <br />Intelligently Summarised
          </h1>
          <p className="hero-sub">
            Search any topic. Let AI distil what matters.
          </p>
          <form className="search-wrap" onSubmit={handleSearch}>
            <input
              className="search-input"
              type="text"
              placeholder="Search any topic…"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button className="search-btn" type="submit">Search</button>
          </form>
        </div>
      </div>

      {/* Topic pills */}
      <div className="topics">
        {TOPICS.map(t => (
          <button
            key={t}
            className={`topic-pill${search.toLowerCase() === t.toLowerCase() ? ' topic-pill-active' : ''}`}
            onClick={() => setSearch(t.toLowerCase())}
          >
            {t}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="container">
        <div className="section-label">
          {loading ? 'Loading' : `${articles.length} Stories`}
          &nbsp;·&nbsp;
          {search.charAt(0).toUpperCase() + search.slice(1)}
        </div>

        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <span className="loading-text">Gathering dispatches…</span>
          </div>
        )}

        {error && !loading && (
          <div className="empty-state">
            <div className="empty-icon">⚠</div>
            <p className="empty-title">Something went wrong</p>
            <p className="empty-text">{error}</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <p className="empty-title">No stories found</p>
            <p className="empty-text">Try a different search term.</p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="news-grid">
            {articles.slice(0, 9).map((article, i) => (
              <ArticleCard
                key={article.url || i}
                article={article}
                delay={i * 50}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
