import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import History from './pages/History'
import { LayoutDashboard, History as HistoryIcon, Sparkles } from 'lucide-react'

function App() {
  return (
    <Router>
      <div className="layout">
        <nav className="glass floating-nav">
          <div className="nav-content">
            <Link to="/" className="logo">
              <Sparkles size={20} className="accent-icon" />
              <span className="logo-text">One Prompt Multiple Minds</span>
            </Link>
            <div className="nav-links">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <HistoryIcon size={18} />
                <span>History</span>
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
