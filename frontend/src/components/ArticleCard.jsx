'use client'

import { useState } from 'react'
import { summarizeArticle, saveFavorite } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function ArticleCard({ article, delay = 0 }) {
  const { token } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const fullText = [article.title, article.description, article.content]
    .filter(Boolean).join(' ')

  const handleSummarize = async () => {
    if (summary) { setSummary(null); return }
    setLoadingSummary(true)
    try {
      const data = await summarizeArticle(fullText, token)
      setSummary(data.summary)
    } catch {
      setSummary('Could not summarize this article.')
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleSave = async () => {
    if (!token || saved) return
    setSaving(true)
    try {
      await saveFavorite({
        title: article.title,
        summary: summary || article.description || '',
        url: article.url,
      }, token)
      setSaved(true)
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : ''

  return (
    <article className="card" style={{ animationDelay: `${delay}ms` }}>
      {article.urlToImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="card-img"
          src={article.urlToImage}
          alt={article.title}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      )}
      <span className="card-source">{article.source?.name || 'News'}</span>
      <h2 className="card-title">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {article.title}
        </a>
      </h2>
      {article.description && (
        <p className="card-desc">{article.description}</p>
      )}
      <span className="card-meta">
        {date}{article.author ? ` · ${article.author}` : ''}
      </span>

      {summary && (
        <div className="summary-panel">
          <div className="summary-label">✦ AI Summary</div>
          {summary}
        </div>
      )}

      <div className="card-actions">
        <button
          className="card-btn card-btn-primary"
          onClick={handleSummarize}
          disabled={loadingSummary}
        >
          {loadingSummary ? 'Summarising…' : summary ? 'Hide Summary' : '✦ AI Summary'}
        </button>
        <a
          className="card-btn"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read Full →
        </a>
        {token && summary && (
          <button
            className="card-btn"
            onClick={handleSave}
            disabled={saving || saved}
          >
            {saved ? '✓ Saved' : saving ? 'Saving…' : '♡ Save'}
          </button>
        )}
      </div>
    </article>
  )
}
