import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainApp from './pages/MainApp'
import History from './pages/History'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  )
}

export default App
