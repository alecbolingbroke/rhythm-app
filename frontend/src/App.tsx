import AppRouter from './routes/AppRouter'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'

function App() {

  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster richColors position="top-right"/>
    </BrowserRouter>
  )
}

export default App
