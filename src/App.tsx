import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, Info, Loader2, Lock, ExternalLink, Mail, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeContent, AnalysisResult } from './services/geminiService';

export default function App() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeContent(input);
      setResult(data);
    } catch (err) {
      setError('Analysis failed. Please try again later.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Critical': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'High': return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 'Medium': return <Info className="w-6 h-6 text-yellow-600" />;
      case 'Low': return <CheckCircle className="w-6 h-6 text-green-600" />;
      default: return <Shield className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              PhishGuard AI
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Secure Analysis
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setInput("URGENT: Your account has been suspended. Click here to verify your identity: http://secure-bank-login-verify.com/login")}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium transition-colors"
              >
                Phishing Example
              </button>
              <button 
                onClick={() => setInput("Hi Mom, I lost my phone and I'm using a friend's. Can you send $200 to this account for my taxi? I'll pay you back tonight.")}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium transition-colors"
              >
                Smishing Example
              </button>
              <button 
                onClick={() => setInput("Hey, just checking in to see if we're still on for lunch tomorrow at 1 PM? Let me know!")}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium transition-colors"
              >
                Safe Example
              </button>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-[#121214] border border-white/10 rounded-2xl overflow-hidden">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste message content or URL here..."
                  className="w-full h-64 p-6 bg-transparent text-gray-200 placeholder:text-gray-600 focus:outline-none resize-none text-lg"
                />
                <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                  <div className="flex gap-3">
                    <button className="p-2 text-gray-500 hover:text-blue-400 transition-colors" title="Email Analysis">
                      <Mail className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-blue-400 transition-colors" title="SMS Analysis">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-blue-400 transition-colors" title="URL Analysis">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !input.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Analyze Content
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready for Scan</h3>
                  <p className="text-gray-500 text-sm">
                    Enter content on the left to start the forensic analysis.
                  </p>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-3xl bg-white/[0.02]"
                >
                  <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
                    <Shield className="w-10 h-10 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Forensic Scan in Progress</h3>
                  <p className="text-gray-500 text-sm max-w-[200px]">
                    Checking linguistic patterns, technical metadata, and intent...
                  </p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Risk Badge */}
                  <div className={`p-6 rounded-3xl border ${getRiskColor(result.Risk_Level)} transition-colors`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getRiskIcon(result.Risk_Level)}
                        <span className="text-sm font-bold uppercase tracking-widest">Risk Level</span>
                      </div>
                      <span className="text-2xl font-black">{result.Risk_Level}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider opacity-70">
                        <span>Confidence Score</span>
                        <span>{result.Confidence_Score}%</span>
                      </div>
                      <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.Confidence_Score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${result.Risk_Level === 'Critical' || result.Risk_Level === 'High' ? 'bg-red-500' : 'bg-green-500'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-6 bg-[#121214] border border-white/10 rounded-3xl space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Threat Summary</h4>
                    <p className="text-gray-300 leading-relaxed italic">
                      "{result.Summary_of_Threat}"
                    </p>
                  </div>

                  {/* Indicators */}
                  <div className="p-6 bg-[#121214] border border-white/10 rounded-3xl space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Red Flags Detected</h4>
                    <ul className="space-y-3">
                      {result.Specific_Indicators.map((indicator, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-400">
                          <span className="text-red-500 font-bold">•</span>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action */}
                  <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-blue-400">Recommended Action</h4>
                    <p className="text-blue-100 font-medium">
                      {result.Recommended_Action}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-white/5 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-500">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Shield className="w-5 h-5" />
              <span className="font-bold">PhishGuard AI</span>
            </div>
            <p>Advanced forensic analysis for the modern threat landscape.</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-gray-300 font-semibold">Analysis Layers</h5>
            <ul className="space-y-1">
              <li>Heuristic Intent Analysis</li>
              <li>Linguistic Pattern Matching</li>
              <li>Technical Metadata Verification</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-gray-300 font-semibold">Safety First</h5>
            <p>All analysis is performed in a sandboxed environment. Your data is never stored or used for training.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
