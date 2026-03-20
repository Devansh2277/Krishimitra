"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  phoneNumber: string | null
  farmerCardNumber: string | null
  login: (phone: string, card: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [farmerCardNumber, setFarmerCardNumber] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const checkAuth = () => {
        try {
          const isLoggedIn = sessionStorage.getItem("isLoggedIn")
          const phone = sessionStorage.getItem("phoneNumber")
          const card = sessionStorage.getItem("farmerCardNumber")

          console.log("[v0] Auth context check - isLoggedIn:", isLoggedIn, "phone:", phone)

          if (isLoggedIn === "true" && phone && card) {
            setIsAuthenticated(true)
            setPhoneNumber(phone)
            setFarmerCardNumber(card)
          } else {
            setIsAuthenticated(false)
            setPhoneNumber(null)
            setFarmerCardNumber(null)
          }
        } catch (error) {
          console.log("[v0] Auth context error:", error)
          setIsAuthenticated(false)
          setPhoneNumber(null)
          setFarmerCardNumber(null)
        } finally {
          setIsLoading(false)
        }
      }

      checkAuth()
    }
  }, [])

  const login = (phone: string, card: string) => {
    try {
      sessionStorage.setItem("isLoggedIn", "true")
      sessionStorage.setItem("phoneNumber", phone)
      sessionStorage.setItem("farmerCardNumber", card)

      setIsAuthenticated(true)
      setPhoneNumber(phone)
      setFarmerCardNumber(card)

      console.log("[v0] Auth context login successful")
    } catch (error) {
      console.log("[v0] Auth context login error:", error)
    }
  }

  const logout = () => {
    try {
      sessionStorage.removeItem("isLoggedIn")
      sessionStorage.removeItem("phoneNumber")
      sessionStorage.removeItem("farmerCardNumber")
      sessionStorage.removeItem("farmerProfile")
      sessionStorage.removeItem("language")

      setIsAuthenticated(false)
      setPhoneNumber(null)
      setFarmerCardNumber(null)

      console.log("[v0] Auth context logout successful")
    } catch (error) {
      console.log("[v0] Auth context logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        phoneNumber,
        farmerCardNumber,
        login,
        logout,
        isLoading,
      }}
    >
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
