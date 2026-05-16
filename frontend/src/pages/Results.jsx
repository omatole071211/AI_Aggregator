import React, { useEffect, useState, useRef } from 'react'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, FileText, ChevronRight, CheckCircle, Sparkles } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

// Elite Component: Simulated Streaming Text
const TypedText = ({ text, speed = 2, delay = 0, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    let timeout = setTimeout(() => {
      setIsTyping(true)
      let index = 0
      timerRef.current = setInterval(() => {
        setDisplayedText((prev) => text.slice(0, index))
        index++
        if (index > text.length) {
          clearInterval(timerRef.current)
          if (onComplete) onComplete()
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [text, speed, delay, onComplete])

  return <span>{displayedText}{isTyping && <span className="custom-cursor">|</span>}</span>
}

const Results = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState(location.state?.data || null)
  const [loading, setLoading] = useState(!data)
  const [showResults, setShowResults] = useState(!!data)

  useEffect(() => {
    if (!data) {
      const fetchData = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || '';
          const response = await axios.get(`${API_URL}/api/history/${id}`)
          // Simulate some additional "Thinking" time for the Elite Scanner
          setTimeout(() => {
            setData(response.data)
            setLoading(false)
            setTimeout(() => setShowResults(true), 100)
          }, 2000)
        } catch (err) {
          console.error("Error fetching results:", err)
          alert("Failed to fetch results.")
          navigate('/')
        }
      }
      fetchData()
    }
  }, [id, data, navigate])

  if (loading) {
    return (
      <div className="neural-loader-overlay">
        <div className="neural-pulse-core"></div>
        <div className="loader-text">Synthesizing Minds</div>
        <div className="loader-subtext opacity-40 text-sm">Aligning weights across neural engines...</div>
      </div>
    )
  }

  if (!data) return <div className="loader-text">No data found.</div>

  return (
    <div className="results-page fade-in compact-results">
      <Link to="/" className="back-btn minimal-btn">
        <ArrowLeft size={18} />
        <span>New Insight</span>
      </Link>

      <section className="summary-section">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="summary-card shimmer-card"
        >
          <div className="pre-header mb-1">
            <Sparkles size={12} />
            <span>Collective Insight</span>
          </div>
          <h2 className="title text-rose-grad">Unified Synthesis</h2>
          <div className="summary-text white-space-pre">
            {showResults && <TypedText text={data.summary} speed={4} delay={500} />}
          </div>
        </motion.div>
      </section>

      <div className="section-header minimal-header">
        <h3 className="section-title">Engine Comparison</h3>
        <p className="section-desc">Side-by-side analysis of AI interpretions.</p>
      </div>

      <div className="results-grid">
        {data.responses.map((res, index) => (
          <motion.div 
            key={index} 
            className="model-card shimmer-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (0.1 * index) }}
          >
            <div className="model-header">
              <span className="model-name">{res.model_name} Engine</span>
              <div className="model-status">
                <div className="pulse-dot"></div>
                <span className="text-xs">Active</span>
              </div>
            </div>
            
            <div className="response-metrics minimal-metrics">
              <div className="metric">
                <FileText size={12} />
                <span>{res.word_count} words</span>
              </div>
              <div className="metric">
                <Clock size={12} />
                <span>{res.response_time}s</span>
              </div>
            </div>

            <div className="response-content">
              {showResults && (
                <TypedText 
                  text={res.response_text} 
                  speed={2} 
                  delay={1000 + (index * 200)} 
                />
              )}
            </div>

            <div className="card-footer">
              <button 
                className="btn-minimal"
                onClick={() => navigator.clipboard.writeText(res.response_text)}
              >
                Copy
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Results
