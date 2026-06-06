"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Role } from "./rbac"

export type User = {
  name: string
  email: string
  role: Role
  roleLabel: string
  initials: string
  phone?: string
  country?: string
  info?: string
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem("vb_user")
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr) as User
        setUser(savedUser)
      }
    } catch (e) {
      console.error("Failed to parse user from local storage")
      localStorage.removeItem("vb_user")
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("vb_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("vb_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

