import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ChevronRight, MessageSquare, Trash2, Sparkles } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/history')
      setHistory(response.data)
    } catch (err) {
      console.error("Error fetching history:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interaction?")) return
    
    try {
      await axios.delete(`http://localhost:5001/api/history/${id}`)
      setHistory(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error("Error deleting history item:", err)
      alert("Failed to delete item.")
    }
  }

  if (loading) return <div className="loader">Retrieving your insights...</div>

  return (
    <div className="history-page fade-in compact-results">
      <header className="hero-section">
        <div className="pre-header">
          <Sparkles size={14} />
          <span>The Neural Synthesis</span>
        </div>
        <h1>Past Integrations.</h1>
        <p className="subtitle">Retrieve or manage your synthesized insights.</p>
      </header>

      {history.length === 0 ? (
        <div className="empty-state glass">
          <MessageSquare size={40} className="empty-icon" />
          <p>No history found.</p>
          <Link to="/" className="btn-primary">New Comparison</Link>
        </div>
      ) : (
        <div className="history-list minimal-list">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="history-item glass-minimal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.05 * index }}
              >
                <div className="history-content">
                  <div className="history-meta minimal-metrics">
                    <Clock size={12} className="accent-icon" />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <h3 className="history-prompt line-clamp-1">{item.prompt}</h3>
                  <p className="history-summary line-clamp-1 text-sm opacity-60">{item.summary}</p>
                </div>
                
                <div className="history-actions">
                  <Link to={`/results/${item.id}`} className="icon-btn-refined">
                    <ChevronRight size={18} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="icon-btn-danger"
                    title="Delete Interaction"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default History
