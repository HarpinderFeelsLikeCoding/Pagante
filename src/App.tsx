import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/Layout/Header'
import { Footer } from './components/Layout/Footer'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Governance } from './pages/Governance'
import { CreatorDashboard } from './pages/CreatorDashboard'
import { CreatorProfile } from './pages/CreatorProfile'

function App() {
  return (
    <AuthProvider>
      <Router future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/dashboard" element={<CreatorDashboard />} />
              <Route path="/creator/:username" element={<CreatorProfile />} />
              {/* Catch-all route for 404s */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App