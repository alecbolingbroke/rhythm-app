import { Navigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useUser()


  if (loading) return <p>Loading...</p>
  if (!session) return <Navigate to="/auth" />


  return <>{children}</>
}
