const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchNews(searchTerm = 'technology') {
  const res = await fetch(`${BASE}/api/news?search_term=${encodeURIComponent(searchTerm)}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch news')
  return res.json()
}

export async function summarizeArticle(articleText, token) {
  const res = await fetch(`${BASE}/api/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ article_text: articleText }),
  })
  if (!res.ok) throw new Error('Failed to summarize')
  return res.json()
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Login failed')
  }
  return res.json()
}

export async function signupUser(email, password) {
  const res = await fetch(`${BASE}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Signup failed')
  }
  return res.json()
}

export async function saveFavorite(article, token) {
  const res = await fetch(`${BASE}/api/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(article),
  })
  if (!res.ok) throw new Error('Failed to save')
  return res.json()
}

export async function getFavorites(token) {
  const res = await fetch(`${BASE}/api/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch favorites')
  return res.json()
}
