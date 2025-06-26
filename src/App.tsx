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
import { Discover } from './pages/Discover'
import { Creators } from './pages/Creators'
import { Disputes } from './pages/Disputes'
import { DemoData } from './pages/DemoData'

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
              <Route path="/discover" element={<Discover />} />
              <Route path="/creators" element={<Creators />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/disputes" element={<Disputes />} />
              <Route path="/dashboard" element={<CreatorDashboard />} />
              <Route path="/creator/:username" element={<CreatorProfile />} />
              <Route path="/demo-data" element={<DemoData />} />
              {/* Catch-all route for unmatched paths - redirect to home */}
              <Route path="*" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                  <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Go Home
                  </a>
                </div>
              </div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App