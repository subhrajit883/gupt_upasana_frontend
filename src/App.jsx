
import './App.css'
import { Toaster } from 'react-hot-toast'
import AppRoute from './routes/AppRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px', fontWeight: '600' },
          success: { iconTheme: { primary: '#8B0000', secondary: '#FFD700' } },
        }}
      />
      <AppRoute />
    </AuthProvider>
  )
}

export default App;
