import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, CheckCircle2, Circle, Zap, Search, Layers, CheckSquare, Sparkles } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const Home = () => {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModels, setSelectedModels] = useState(['groq', 'gemini', 'mistral'])
  const [toggleIndex, setToggleIndex] = useState(0)
  const navigate = useNavigate()

  const togglePhrases = [
    "Compare Engines",
    "Synthesize Insights",
    "Scale Intelligence",
    "Select Best Path"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setToggleIndex((prev) => (prev + 1) % togglePhrases.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  const toggleModel = (model) => {
    if (selectedModels.includes(model)) {
      setSelectedModels(selectedModels.filter(m => m !== model))
    } else {
      setSelectedModels([...selectedModels, model])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || selectedModels.length === 0) return

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: prompt })
      })
      const data = await response.json()
      // Note: adjust navigation if backend response structure has changed
      navigate(`/results/${data.interaction_id || data.id || 'latest'}`, { state: { data } })
    } catch (err) {
      console.error("Error processing prompt:", err)
      alert("Failed to connect to backend. Make sure the Flask server is running on port 5001.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-page fade-in">
      <header className="hero-section">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pre-header"
        >
          <Sparkles size={14} />
          <span>The Neural Synthesis</span>
        </motion.div>
        
        <h1>One Prompt Multiple Minds.</h1>
        
        <div className="dynamic-toggle-container">
          <span className="toggle-static">Empowering you to</span>
          <div className="toggle-dynamic-wrapper">
            <AnimatePresence mode="wait">
              <motion.span
                key={toggleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="accent-text"
              >
                {togglePhrases[toggleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="workflow-sequence">
          <div className="flow-item">
            <div className="flow-icon-circle"><Search size={20} /></div>
            <span className="flow-text">Ask</span>
          </div>
          <div className="flow-connector"></div>
          <div className="flow-item">
            <div className="flow-icon-circle"><Layers size={20} /></div>
            <span className="flow-text">Compare</span>
          </div>
          <div className="flow-connector"></div>
          <div className="flow-item">
            <div className="flow-icon-circle"><CheckSquare size={20} /></div>
            <span className="flow-text">Choose</span>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="prompt-form glass">
        <textarea
          placeholder="Enter your prompt here (e.g., Explain quantum entanglement in simple terms...)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />

        <div className="model-selector">
          <p className="selector-label">Select AI Engines:</p>
          <div className="model-chips">
            {['groq', 'gemini', 'mistral'].map(model => (
              <div 
                key={model} 
                className={`model-chip ${selectedModels.includes(model) ? 'active' : ''}`}
                onClick={() => !loading && toggleModel(model)}
              >
                {selectedModels.includes(model) ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                <span className="capitalize">{model}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className={`btn-primary flex-center ${loading ? 'loading-glitch' : ''}`}
          disabled={loading || !prompt.trim() || selectedModels.length === 0}
        >
          {loading ? (
            <div className="flex-center gap-2">
              <div className="loader-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
              <span>Calibrating Minds</span>
            </div>
          ) : (
            <>
              <Send size={18} />
              <span>Initialize Synthesis</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default Home
