'use client'

import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('token')
    return null
  })
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('user')
      return s ? JSON.parse(s) : null
    }
    return null
  })

  const login = (access_token, userData) => {
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(access_token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
