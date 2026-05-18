import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, BrainCircuit, Activity, Cpu, Bot, ChevronRight, Copy, MessageSquare, Zap, CheckCircle2, RotateCcw, Share2, BarChart2 } from 'lucide-react';
import axios from 'axios';

// --- Reusable Components ---

const GlassCard = ({ children, className = '', ...props }) => (
  <motion.div 
    className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const GlowButton = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary hover:bg-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-primary/50',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20',
    purple: 'bg-purple hover:bg-purple-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-purple/50',
    cyan: 'bg-cyan hover:bg-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan/50',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// --- Main Application Component ---

export default function MainApp() {
  const [step, setStep] = useState(0); // 0: Landing, 1: Query, 2: Loading, 3: Dashboard, 4: Compare, 5: Select, 6: Chat
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState(['Gemini', 'Groq', 'Mistral']);
  const [interactionData, setInteractionData] = useState(null);
  const [selectedChatAI, setSelectedChatAI] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  // Auto-scroll ref
  const bottomRef = useRef(null);

  // Ping backend to wake up Render free tier on load
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/`).catch(err => console.log("Wake up ping:", err));
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step, chatHistory]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStep(2); // Loading
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await axios.post(`${API_URL}/api/process`, {
        prompt: prompt,
        models: selectedModels.map(m => m.toLowerCase())
      });
      
      // Add fake metrics for the premium UI since backend doesn't provide all of them
      const enrichedResponses = response.data.responses.map(r => ({
        ...r,
        reasoningScore: Math.floor(Math.random() * 20) + 80,
        creativityScore: Math.floor(Math.random() * 30) + 70,
        accuracy: Math.floor(Math.random() * 15) + 85,
        depth: Math.floor(Math.random() * 25) + 75,
      }));

      setInteractionData({
        ...response.data,
        responses: enrichedResponses
      });
      
      setTimeout(() => setStep(3), 1500); // Artificial delay for premium feel
    } catch (err) {
      console.error(err);
      alert("Failed to connect to AI engines.");
      setStep(1);
    }
  };

  const handleSendMessage = async (msg) => {
    if (!msg.trim()) return;
    const newMessage = { role: 'user', content: msg };
    setChatHistory(prev => [...prev, newMessage]);
    
    // Simulate thinking
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'ai', content: `[${selectedChatAI}] Simulated response for: "${msg}". In a full implementation, this would hit a continuous chat API endpoint.` }]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary relative overflow-x-hidden font-sans selection:bg-primary/30 pb-32">
      
      {/* GLOBAL VISUAL DESIGN: Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[60%] w-[40%] h-[40%] bg-cyan/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      </div>

      {/* Floating Header */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-center">
        <GlassCard className="px-8 py-4 rounded-full flex items-center gap-4">
          <BrainCircuit className="text-primary w-6 h-6" />
          <span className="font-bold tracking-widest uppercase text-sm">One Prompt Multiple Minds</span>
        </GlassCard>
      </nav>

      <main className="relative z-10 pt-32 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: LANDING EXPERIENCE */}
          {step === 0 && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              className="text-center w-full max-w-4xl mt-20"
            >
              <motion.div 
                animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 border-t-2 border-primary rounded-full opacity-50"></div>
                <div className="absolute inset-2 border-r-2 border-purple rounded-full opacity-50"></div>
                <div className="absolute inset-4 border-b-2 border-cyan rounded-full opacity-50"></div>
                <BrainCircuit className="absolute inset-0 m-auto text-white w-8 h-8 glow-text-blue" />
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight leading-tight">
                One Prompt. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple to-cyan">Multiple Minds.</span>
              </h1>
              
              <p className="text-xl text-textSecondary mb-12 max-w-2xl mx-auto leading-relaxed">
                Compare, analyze and collaborate with multiple AI models in one intelligent futuristic workspace.
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <GlowButton onClick={() => setStep(1)} variant="primary" className="text-lg px-8 py-4">
                  <Sparkles className="w-5 h-5" /> Ask
                </GlowButton>
                <GlowButton onClick={() => setStep(1)} variant="purple" className="text-lg px-8 py-4">
                  <Activity className="w-5 h-5" /> Compare
                </GlowButton>
                <GlowButton onClick={() => setStep(1)} variant="cyan" className="text-lg px-8 py-4">
                  <Cpu className="w-5 h-5" /> Choose
                </GlowButton>
              </div>
            </motion.div>
          )}

          {/* STEP 1: QUERY EXPERIENCE */}
          {step === 1 && (
            <motion.div 
              key="query"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-3xl mt-10"
            >
              <GlassCard className="p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple/10 to-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full h-48 bg-transparent text-2xl md:text-4xl text-white placeholder-white/20 outline-none resize-none font-medium relative z-10"
                  autoFocus
                />

                <div className="mt-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex flex-wrap gap-3">
                    {['Gemini', 'Groq', 'Mistral'].map(model => (
                      <button
                        key={model}
                        onClick={() => setSelectedModels(prev => prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model])}
                        className={`px-5 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 ${
                          selectedModels.includes(model) 
                            ? 'bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                            : 'border-white/5 text-white/50 hover:bg-white/5'
                        }`}
                      >
                        {selectedModels.includes(model) && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                        {model}
                      </button>
                    ))}
                  </div>

                  <GlowButton onClick={handleGenerate} variant="primary" className="w-full md:w-auto px-10 py-4 text-lg">
                    Generate Insights <Send className="w-5 h-5 ml-2" />
                  </GlowButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* STEP 2: LOADING EXPERIENCE */}
          {step === 2 && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center mt-32"
            >
              <div className="relative w-32 h-32 mb-12">
                <div className="absolute inset-0 border-4 border-t-primary border-r-purple border-b-cyan border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-t-transparent border-r-cyan border-b-purple border-l-primary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                <BrainCircuit className="absolute inset-0 m-auto text-white w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-4 text-center">
                {selectedModels.map((model, i) => (
                  <motion.div 
                    key={model}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4 }}
                    className="text-xl font-light text-textSecondary flex items-center justify-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan animate-pulse"></div>
                    <span className="text-white font-medium">{model}</span> analyzing parameters...
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: RESULTS DASHBOARD */}
          {step === 3 && interactionData && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
              className="w-full mt-10 space-y-12"
            >
              <div className="text-center mb-10">
                <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Original Prompt</h2>
                <p className="text-2xl font-medium text-white max-w-4xl mx-auto">"{interactionData.prompt}"</p>
              </div>

              <GlassCard className="p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple to-cyan"></div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Sparkles className="w-6 h-6 text-purple" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Collective Insight</h2>
                    <p className="text-textSecondary">Synthesized consensus from all selected AI models</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-lg leading-relaxed text-gray-300">
                  {interactionData.summary}
                </div>

                <div className="mt-8 flex gap-4 pt-6 border-t border-white/10">
                  <GlowButton variant="secondary" className="px-4 py-2 text-sm" onClick={() => navigator.clipboard.writeText(interactionData.summary)}>
                    <Copy className="w-4 h-4" /> Copy Summary
                  </GlowButton>
                </div>
              </GlassCard>

              <div className="flex justify-center mt-12">
                <GlowButton onClick={() => setStep(4)} variant="cyan" className="px-8 py-4 text-lg">
                  Compare Responses <Activity className="w-5 h-5 ml-2" />
                </GlowButton>
              </div>
            </motion.div>
          )}

          {/* STEP 4: COMPARISON ANALYSIS */}
          {step === 4 && interactionData && (
            <motion.div 
              key="compare"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
              className="w-full mt-10"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 glow-text-blue">AI Comparison Analysis</h2>
                <p className="text-textSecondary text-lg">Detailed breakdown of model performance and characteristics.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {interactionData.responses.map((res, i) => {
                  const colors = ['primary', 'cyan', 'purple'];
                  const color = colors[i % colors.length];
                  return (
                    <GlassCard key={i} className="p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/10 rounded-full blur-[50px] group-hover:bg-${color}/20 transition-all`}></div>
                      <h3 className={`text-2xl font-bold mb-6 text-${color} flex items-center gap-3`}>
                        <Cpu className="w-6 h-6" /> {res.model_name}
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-textSecondary">Response Time</span>
                          <span className="font-mono text-white">{res.response_time}s</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5"><div className={`bg-${color} h-1.5 rounded-full`} style={{width: `${Math.min(100, (res.response_time / 5) * 100)}%`}}></div></div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-textSecondary">Word Count</span>
                          <span className="font-mono text-white">{res.word_count}</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5"><div className={`bg-${color} h-1.5 rounded-full`} style={{width: `${Math.min(100, (res.word_count / 1000) * 100)}%`}}></div></div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-textSecondary">Reasoning</span>
                          <span className="font-mono text-white">{res.reasoningScore}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5"><div className={`bg-${color} h-1.5 rounded-full`} style={{width: `${res.reasoningScore}%`}}></div></div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-textSecondary">Creativity</span>
                          <span className="font-mono text-white">{res.creativityScore}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5"><div className={`bg-${color} h-1.5 rounded-full`} style={{width: `${res.creativityScore}%`}}></div></div>
                      </div>
                    </GlassCard>
                  )
                })}
              </div>

              <div className="flex justify-center mt-12">
                <GlowButton onClick={() => setStep(5)} variant="purple" className="px-8 py-4 text-lg">
                  Choose Best AI <ChevronRight className="w-5 h-5 ml-2" />
                </GlowButton>
              </div>
            </motion.div>
          )}

          {/* STEP 5: AI SELECTION CARDS */}
          {step === 5 && interactionData && (
            <motion.div 
              key="select"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
              className="w-full mt-10"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 glow-text-cyan">Select Your AI Mind</h2>
                <p className="text-textSecondary text-lg">Choose an intelligence to continue the conversation deeply.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {interactionData.responses.map((res, i) => {
                  const colors = [
                    { name: 'primary', hex: '#3B82F6', shadow: 'shadow-primary/30', border: 'border-primary/50' },
                    { name: 'purple', hex: '#8B5CF6', shadow: 'shadow-purple/30', border: 'border-purple/50' },
                    { name: 'cyan', hex: '#06B6D4', shadow: 'shadow-cyan/30', border: 'border-cyan/50' }
                  ];
                  const scheme = colors[i % colors.length];
                  
                  return (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.03, translateY: -10 }}
                      className={`bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 cursor-pointer relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px] hover:${scheme.shadow} hover:${scheme.border}`}
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border border-${scheme.name}/30 text-${scheme.name} bg-${scheme.name}/10`}>
                          {res.reasoningScore > 90 ? 'High Logic' : 'Balanced'}
                        </div>
                      </div>

                      <div className={`w-16 h-16 rounded-2xl bg-${scheme.name}/10 border border-${scheme.name}/30 flex items-center justify-center mb-6`}>
                        <Bot className={`w-8 h-8 text-${scheme.name}`} />
                      </div>

                      <h3 className="text-3xl font-bold mb-2">{res.model_name}</h3>
                      <p className="text-sm text-textSecondary mb-6 line-clamp-3">
                        "{res.response_text.substring(0, 100)}..."
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <div className="text-xs text-textSecondary mb-1">Response Time</div>
                          <div className="font-mono text-lg font-bold">{res.response_time}s</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <div className="text-xs text-textSecondary mb-1">Reasoning</div>
                          <div className="font-mono text-lg font-bold text-green-400">{res.reasoningScore}/100</div>
                        </div>
                      </div>

                      <GlowButton 
                        onClick={() => {
                          setSelectedChatAI(res);
                          setChatHistory([{ role: 'ai', content: res.response_text }]);
                          setStep(6);
                        }} 
                        className="w-full"
                        style={{ backgroundColor: scheme.hex, borderColor: scheme.hex }}
                      >
                        Select Engine
                      </GlowButton>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 6: DETAILED AI CHAT EXPERIENCE */}
          {step === 6 && selectedChatAI && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full h-[85vh] mt-4 flex gap-6"
            >
              {/* Main Chat Area */}
              <GlassCard className="flex-1 flex flex-col overflow-hidden relative">
                {/* Chat Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                      <Bot className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{selectedChatAI.model_name} Engine</h3>
                      <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online & Dedicated</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <GlowButton variant="secondary" className="!p-2"><Share2 className="w-4 h-4" /></GlowButton>
                    <GlowButton onClick={() => setStep(5)} variant="secondary" className="!p-2"><RotateCcw className="w-4 h-4" /></GlowButton>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
                  {chatHistory.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-6 ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white shadow-[0_5px_20px_rgba(59,130,246,0.3)] rounded-tr-sm' 
                          : 'bg-white/5 border border-white/10 shadow-lg rounded-tl-sm'
                      }`}>
                        <div className="prose prose-invert max-w-none text-base leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/[0.02] border-t border-white/10 backdrop-blur-xl">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = e.target.elements.chatInput.value;
                      handleSendMessage(val);
                      e.target.reset();
                    }}
                    className="relative"
                  >
                    <input 
                      name="chatInput"
                      type="text" 
                      placeholder="Ask a follow up question..." 
                      className="w-full bg-black/40 border border-white/20 rounded-full py-4 pl-6 pr-16 text-white outline-none focus:border-primary/50 focus:bg-black/60 transition-all shadow-inner"
                      autoComplete="off"
                    />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-blue-400 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </form>
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    {["Elaborate further", "Provide code example", "Summarize above", "What are the alternatives?"].map((sug, i) => (
                      <button key={i} onClick={() => handleSendMessage(sug)} className="whitespace-nowrap px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-textSecondary hover:text-white hover:border-white/30 transition-colors">
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Sidebar Analytics */}
              <GlassCard className="w-80 hidden lg:flex flex-col p-6 overflow-y-auto">
                <h4 className="font-bold text-sm tracking-widest text-textSecondary uppercase mb-6 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" /> Live Analytics
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-textSecondary mb-2">Model Info</div>
                    <div className="text-lg font-bold">{selectedChatAI.model_name}</div>
                    <div className="text-sm text-cyan-400">Synthesizing</div>
                  </div>

                  <div className="h-[1px] bg-white/10 my-4"></div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-textSecondary">Reasoning Score</span>
                        <span className="font-bold">{selectedChatAI.reasoningScore}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{width: `${selectedChatAI.reasoningScore}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-textSecondary">Creativity Score</span>
                        <span className="font-bold">{selectedChatAI.creativityScore}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple" style={{width: `${selectedChatAI.creativityScore}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-textSecondary">Depth Analysis</span>
                        <span className="font-bold">{selectedChatAI.depth}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan" style={{width: `${selectedChatAI.depth}%`}}></div>
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/10 my-4"></div>

                  <div>
                    <div className="text-xs text-textSecondary mb-3">AI Specialization</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">Logic</span>
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">Analysis</span>
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-primary font-bold border-primary/30">Primary Pick</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

        </AnimatePresence>

        {/* BOTTOM SECTION - ORIGINAL RESPONSES (Only show in step 3, 4, 5) */}
        {step >= 3 && step <= 5 && interactionData && (
          <div className="w-full mt-32 pb-20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
              <MessageSquare className="w-6 h-6 text-textSecondary" /> Original Transcripts
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {interactionData.responses.map((res, i) => (
                <GlassCard key={i} className="p-6 h-96 flex flex-col border-t-4 border-t-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold flex items-center gap-2">
                      <Bot className="w-4 h-4 opacity-50" /> {res.model_name}
                    </span>
                    <span className="text-xs text-textSecondary bg-white/5 px-2 py-1 rounded">{res.response_time}s</span>
                  </div>
                  <div className="flex-1 overflow-y-auto text-sm text-gray-300 leading-relaxed pr-2 custom-scrollbar">
                    {res.response_text}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                    <button onClick={() => navigator.clipboard.writeText(res.response_text)} className="text-xs flex items-center gap-1 text-textSecondary hover:text-white transition-colors">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>
    </div>
  );
}
