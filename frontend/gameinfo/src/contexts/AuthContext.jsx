import React, { createContext } from 'react'
import { useAuthState }      from 'react-firebase-hooks/auth'
import { auth }              from '../firebase'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, loading, error] = useAuthState(auth)
  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}
