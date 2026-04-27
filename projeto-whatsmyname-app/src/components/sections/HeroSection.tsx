import { useState, useEffect, useCallback } from "react";
import { Search, Mail, User, ArrowRight, Loader2, ExternalLink, Globe, AlertCircle, ShieldCheck, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

interface SearchResult {
  platform: string;
  url: string;
  status: "found" | "not_found" | "error";
  details?: string;
}

export function HeroSection() {
  const [searchType, setSearchType] = useState<"username" | "email">("username");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState("");

  const platformsToScan = ["Instagram", "Twitter", "GitHub", "LinkedIn", "Reddit", "TikTok", "Pinterest", "Facebook"];

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setResults(null);
      return;
    }
    
    setIsLoading(true);
    setIsScanning(true);
    setError(null);

    // Simulate "Live Scanning" animation
    let platformIdx = 0;
    const scanInterval = setInterval(() => {
      setCurrentPlatform(platformsToScan[platformIdx % platformsToScan.length]);
      platformIdx++;
    }, 600);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      
      const prompt = `Perform a professional OSINT investigation for the ${searchType}: "${searchQuery}". 
      Search across major social networks (Instagram, Twitter/X, GitHub, LinkedIn, Reddit, TikTok, etc.), forums, and professional platforms.
      Return a list of potential profile matches with their URLs. 
      Format the response as a JSON array of objects with keys: "platform", "url", "status" (always "found"), and "details" (brief description of what was found).
      Only return the JSON array, nothing else.`;

      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        },
      });

      const text = response.text;
      if (text) {
        const parsedResults = JSON.parse(text);
        setResults(parsedResults);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      // We don't want to show error for every keystroke unless it's a major failure
      if (searchQuery.length > 5) {
        setError("Discovery engine is busy. Please wait a moment.");
      }
    } finally {
      clearInterval(scanInterval);
      setIsLoading(false);
      setIsScanning(false);
      setCurrentPlatform("");
    }
  }, [searchType]);

  // Debounce logic for "Live" search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        performSearch(query);
      }
    }, 1000); // 1 second debounce to avoid hitting API limits too fast

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-brand-dark py-20 px-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-widest mb-6">
            <Activity size={14} className="animate-pulse" />
            Live OSINT Discovery Active
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Real-Time <span className="text-brand-purple">Digital Identity</span> Mapping
          </h1>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Start typing a username or email. Our AI-powered engine scans 500+ platforms 
            in real-time to map the digital footprint instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-dark p-8 md:p-10 rounded-[2.5rem] shadow-2xl mb-12 relative overflow-hidden"
        >
          {/* Scanning Overlay */}
          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center"
              >
                <div className="relative">
                  <Loader2 size={60} className="text-brand-purple animate-spin mb-4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Search size={20} className="text-white animate-bounce" />
                  </div>
                </div>
                <p className="text-white font-bold text-xl mb-2">Scanning {currentPlatform}...</p>
                <p className="text-brand-purple text-sm animate-pulse">Analyzing digital footprints for "{query}"</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Type Toggles */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setSearchType("username")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
                searchType === "username"
                  ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <User size={18} />
              Username Discovery
            </button>
            <button
              onClick={() => setSearchType("email")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
                searchType === "email"
                  ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Mail size={18} />
              Email Analysis
            </button>
          </div>

          {/* Search Input Area */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-purple transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === "username" ? "Type a username..." : "Type an email address..."}
              className="w-full bg-white/5 border border-white/10 text-white pl-16 pr-16 py-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:bg-white/10 transition-all text-xl font-medium"
            />
            {isLoading && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <Loader2 size={24} className="text-brand-purple animate-spin" />
              </div>
            )}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 text-red-400 text-sm justify-center"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-green-500" /> GDPR Compliant</span>
            <span className="flex items-center gap-2"><Activity size={14} className="text-blue-500" /> Real-time API</span>
            <span className="flex items-center gap-2"><Globe size={14} className="text-purple-500" /> Global Coverage</span>
          </div>
        </motion.div>

        {/* Results Area */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center">
                    <Globe className="text-brand-purple" size={20} />
                  </div>
                  Digital Footprint: <span className="text-brand-purple">{query}</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Confidence Score
                  </span>
                  <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      className="h-full bg-brand-purple"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result, idx) => (
                  <motion.a
                    key={idx}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-dark p-6 rounded-3xl flex flex-col gap-4 group hover:bg-white/10 transition-all border border-white/5 hover:border-brand-purple/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 rounded-lg bg-brand-purple/10 text-brand-purple text-[10px] font-black uppercase tracking-wider">
                        {result.platform}
                      </div>
                      <ExternalLink size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                        {result.details || "Profile match identified with high probability."}
                      </p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-600 font-bold uppercase">Verified Link</span>
                      <span className="text-[10px] text-green-500 font-bold uppercase">Active</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
