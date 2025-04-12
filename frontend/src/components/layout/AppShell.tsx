import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../lib/supabaseClient'

export default function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-muted border-r hidden sm:block p-4">
        <h1 className="text-xl font-bold mb-6">Rhythm</h1>
        <nav className="space-y-2">
          <a href="/" className="block hover:underline">
            Dashboard
          </a>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Optional header bar
        <header className="mb-6">
          <h2 className="text-2xl font-semibold">Today’s Rhythm</h2>
        </header> */}
        {children}
      </div>
    </div>
  )
}
