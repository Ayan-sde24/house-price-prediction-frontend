import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Square, Bath, IndianRupee, Loader2, Sparkles } from 'lucide-react';

const API_URL = 'https://house-price-prediction-oajs.onrender.com';

function App() {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    location: '',
    bhk: '2',
    bath: '2',
    total_sqft: '1000'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_URL}/get_locations`);
      const data = await response.json();
      if (data.locations) {
        setLocations(data.locations);
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.total_sqft) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        setResult(data.price);
      } else {
        setError(data.error || 'Failed to predict price');
      }
    } catch (err) {
      setError('Cannot connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />
      
      <motion.div 
        className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Left Side: Hero content */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Prediction</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Predict Bengaluru <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              House Prices
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Get accurate estimates for your dream house in Bengaluru based on real market data. Leverage our advanced ML models instantly.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">200+</span>
              <span className="text-slate-500 text-sm">Locations</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">~90%</span>
              <span className="text-slate-500 text-sm">Accuracy</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Prediction Form */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Location
                </label>
                <div className="relative">
                  <select 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="glass-input w-full appearance-none pr-10"
                  >
                    <option value="" disabled className="bg-surface text-slate-400">Choose a location...</option>
                    {locations.map((loc, idx) => (
                      <option key={idx} value={loc} className="bg-surface text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Square Feet */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Square className="w-4 h-4 text-primary" /> Area (Square Feet)
                </label>
                <input 
                  type="number" 
                  name="total_sqft"
                  value={formData.total_sqft}
                  onChange={handleInputChange}
                  placeholder="e.g., 1200"
                  className="glass-input w-full"
                  min="300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* BHK */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> BHK
                  </label>
                  <select 
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num} className="bg-surface">{num} BHK</option>
                    ))}
                  </select>
                </div>

                {/* Bath */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Bath className="w-4 h-4 text-primary" /> Bathrooms
                  </label>
                  <select 
                    name="bath"
                    value={formData.bath}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  >
                    {[1,2,3,4,5].map(num => (
                      <option key={num} value={num} className="bg-surface">{num} Bath</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Predicting...
                </>
              ) : (
                'Predict Price'
              )}
            </button>
          </form>

          {/* Results Area */}
          <AnimatePresence>
            {result !== null && !loading && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-br from-surface to-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 mt-2">
                    <IndianRupee className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-slate-400 text-sm tracking-widest uppercase font-semibold mb-1">Estimated Market Value</h3>
                  <div className="text-4xl font-bold text-white mb-6 flex items-baseline justify-center gap-2">
                    <span className="text-2xl text-emerald-400">₹</span>
                    {result} <span className="text-xl text-slate-400 font-normal">Lakhs</span>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => setResult(null)}
                    className="w-full py-3 px-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 active:bg-white/10 transition-all font-medium text-slate-300 flex items-center justify-center gap-2"
                  >
                    Adjust Attributes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
