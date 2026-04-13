import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from './AuthContext'
import NavBar from './components/NavBar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <NavBar />
        <Toaster position='top-middle' />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
