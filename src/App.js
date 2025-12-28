import React, { useState, useEffect } from 'react';
import { Music, ArrowLeft, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState('');
  const [showDialPad, setShowDialPad] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  
  // FLAMES Calculator State
  const [flamesName1, setFlamesName1] = useState('Shashwat');
  const [flamesName2, setFlamesName2] = useState('Trisha');
  const [flamesResult, setFlamesResult] = useState(null);
  const [showFlamesResult, setShowFlamesResult] = useState(false);

  // Jigsaw Puzzle State - 3x3 grid (9 pieces)
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const coupleImageUrl = '/images/couple.jpg';

  // Initialize puzzle pieces
  useEffect(() => {
    const pieces = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      correctPosition: i,
      currentPosition: i
    }));
    
    // Shuffle pieces
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i].currentPosition, shuffled[j].currentPosition] = 
      [shuffled[j].currentPosition, shuffled[i].currentPosition];
    }
    
    setPuzzlePieces(shuffled.sort((a, b) => a.currentPosition - b.currentPosition));
  }, []);

  // Page navigation
  const pages = ['home', 'theater', 'puzzle', 'confession', 'flames'];
  const currentPageIndex = pages.indexOf(currentPage);
  const progress = (currentPageIndex / (pages.length - 1)) * 100;

  // Puzzle drag and drop
  const handleDragStart = (piece) => {
    setDraggedPiece(piece);
  };

  const handleDrop = (targetPiece) => {
    if (draggedPiece && draggedPiece.id !== targetPiece.id) {
      const newPieces = [...puzzlePieces];
      const draggedIndex = newPieces.findIndex(p => p.id === draggedPiece.id);
      const targetIndex = newPieces.findIndex(p => p.id === targetPiece.id);
      
      [newPieces[draggedIndex].currentPosition, newPieces[targetIndex].currentPosition] = 
      [newPieces[targetIndex].currentPosition, newPieces[draggedIndex].currentPosition];
      
      newPieces.sort((a, b) => a.currentPosition - b.currentPosition);
      setPuzzlePieces(newPieces);
      
      // Check if solved
      const isSolved = newPieces.every(piece => piece.id === piece.currentPosition);
      if (isSolved) {
        setTimeout(() => setPuzzleSolved(true), 500);
      }
    }
    setDraggedPiece(null);
  };

  const easterEggs = {
    brooklyn99: "NINE NINE! Just like Jake loves Amy, that's how I feel about you",
    fightclub: "The first rule of loving you? Never stop. The second rule? Never stop",
    fir: "You've stolen my heart, and I'm not filing an FIR",
    dietcoke: "You're my favorite thing, just like your Diet Coke"
  };

  const triggerEasterEgg = (type) => {
    setEasterEggMessage(easterEggs[type]);
    setShowEasterEgg(true);
    setTimeout(() => setShowEasterEgg(false), 4000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Password: "trisha" or "2026" or "newyear"
    if (password.toLowerCase() === 'trisha' || password === '2026' || password.toLowerCase() === 'newyear') {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  // Helper function for FLAMES calculation logic
  const performFlamesCalculation = (name1Input, name2Input) => {
    const name1 = name1Input.toLowerCase().replace(/\s/g, '');
    const name2 = name2Input.toLowerCase().replace(/\s/g, '');
    
    if (!name1 || !name2) return null;
    
    let str1 = name1.split('');
    let str2 = name2.split('');
    
    // Remove common characters
    for (let i = 0; i < str1.length; i++) {
      for (let j = 0; j < str2.length; j++) {
        if (str1[i] === str2[j]) {
          str1[i] = '';
          str2[j] = '';
          break;
        }
      }
    }
    
    const count = str1.filter(c => c !== '').length + str2.filter(c => c !== '').length;
    const flames = ['Friend', 'Love', 'Affection', 'Marriage', 'Enemy', 'Sister'];
    let flamesArr = [...flames];
    
    let index = 0;
    while (flamesArr.length > 1) {
      index = (index + count - 1) % flamesArr.length;
      flamesArr.splice(index, 1);
      if (index === flamesArr.length) index = 0;
    }
    
    return flamesArr[0];
  };

  // Auto-calculate FLAMES on mount or name change
  useEffect(() => {
    if (currentPage === 'flames' && flamesName1 && flamesName2) {
      const timer = setTimeout(() => {
        const result = performFlamesCalculation(flamesName1, flamesName2);
        if (result) {
          setFlamesResult(result);
          setShowFlamesResult(true);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentPage, flamesName1, flamesName2]);

  // Manual FLAMES calculation for button click
  const calculateFlames = () => {
    const result = performFlamesCalculation(flamesName1, flamesName2);
    if (result) {
      setFlamesResult(result);
      setShowFlamesResult(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* Starry background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Lock Screen */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-[200] bg-gradient-to-br from-pink-900 via-purple-900 to-red-900 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(150)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-pink-300 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.7 + 0.3
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10 max-w-md w-full mx-4">
            <div className="text-center mb-12 animate-fade-in">
              <div className="text-8xl mb-6 animate-pulse">💕</div>
              <h1 className="text-5xl font-bold text-pink-200 mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
                This is for you
              </h1>
              <h2 className="text-6xl font-bold bg-gradient-to-r from-pink-300 via-red-300 to-yellow-300 bg-clip-text text-transparent mb-6" style={{ fontFamily: "'Pacifico', cursive" }}>
                Trisha
              </h2>
              <p className="text-2xl text-pink-200 mb-8">Happy New Year 2026! 🎊</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-pink-300/30 shadow-2xl">
              <label className="block text-pink-200 text-lg font-semibold mb-4 text-center">
                Enter the magic word 🔐
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-6 py-4 rounded-full bg-white/20 border-2 ${
                  passwordError ? 'border-red-400 animate-shake' : 'border-pink-300/50'
                } text-white placeholder-pink-200/50 focus:outline-none focus:border-pink-400 text-center text-xl`}
                placeholder="Hint: Your name, year, or celebration"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-300 text-center mt-3 animate-fade-in">
                  Oops! Try again 💗
                </p>
              )}
              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-full text-xl transition-all hover:scale-105 shadow-lg"
              >
                tu bohot awesome hai 💖
              </button>
            </form>

            <div className="text-center mt-8 text-pink-200/70 text-sm">
              Made with love ❤️
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-700 z-50">
        <div 
          className="h-full bg-gradient-to-r from-pink-400 to-red-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Music Player */}
      <div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        onClick={() => setIsPlayerVisible(!isPlayerVisible)}
      >
        <div className="bg-gradient-to-r from-pink-500 to-red-400 rounded-full px-5 py-3 shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform">
          <Music className="w-5 h-5 animate-pulse" />
          <span className="text-xs text-white font-medium">
            {isPlayerVisible ? 'Hide Player' : 'Playing: Our Playlist'}
          </span>
        </div>
      </div>

      {/* SoundCloud Player Modal */}
      {isPlayerVisible && (
        <div className="fixed bottom-24 right-6 z-50 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-pink-400" />
                <span className="text-sm font-semibold text-white">Our Special Playlist</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlayerVisible(false);
                }}
                className="text-white/70 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%3Aplaylists%3A2163661529%3Fsecret_token%3Ds-uIIJQ0rsHC4&color=%23ff5500&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
              className="rounded-lg"
              title="SoundCloud Player"
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 max-w-lg mx-auto p-6 min-h-screen">
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <div className="animate-fade-in">
            <div className="text-center pt-20 pb-12">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
                For Trisha
              </h1>
              <p className="text-yellow-300 text-lg">Your special New Year 2026 gift 🎊</p>
              <Heart className="w-12 h-12 mx-auto mt-4 text-pink-400 animate-pulse" />
            </div>

            <div className="space-y-5 mt-12">
              <div 
                onClick={() => setCurrentPage('theater')}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/10 rounded-3xl p-6 cursor-pointer hover:translate-x-2 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/30 flex items-center gap-5"
              >
                <div className="bg-white/10 rounded-2xl p-4 text-4xl">🎬</div>
                <div>
                  <h3 className="text-2xl font-semibold text-yellow-300">Video Theater</h3>
                  <p className="text-white/70 text-sm">Our moments together</p>
                </div>
              </div>

              <div 
                onClick={() => setCurrentPage('puzzle')}
                className="bg-gradient-to-r from-pink-500/20 to-yellow-500/20 backdrop-blur-lg border border-white/10 rounded-3xl p-6 cursor-pointer hover:translate-x-2 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/30 flex items-center gap-5"
              >
                <div className="bg-white/10 rounded-2xl p-4 text-4xl">🧩</div>
                <div>
                  <h3 className="text-2xl font-semibold text-yellow-300">Puzzle Time</h3>
                  <p className="text-white/70 text-sm">Solve to reveal something special</p>
                </div>
              </div>

              <div 
                onClick={() => setCurrentPage('flames')}
                className="bg-gradient-to-r from-red-500/20 to-purple-500/20 backdrop-blur-lg border border-white/10 rounded-3xl p-6 cursor-pointer hover:translate-x-2 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/30 flex items-center gap-5"
              >
                <div className="bg-white/10 rounded-2xl p-4 text-4xl">🔥</div>
                <div>
                  <h3 className="text-2xl font-semibold text-yellow-300">FLAMES Calculator</h3>
                  <p className="text-white/70 text-sm">Discover our destiny</p>
                </div>
              </div>
            </div>

            {/* Easter eggs */}
            <div className="absolute top-8 right-8 text-2xl cursor-pointer hover:scale-125 transition" onClick={() => triggerEasterEgg('brooklyn99')}>🚔</div>
          </div>
        )}

        {/* THEATER PAGE */}
        {currentPage === 'theater' && (
          <div className="animate-fade-in">
            <button onClick={() => setCurrentPage('home')} className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 rounded-full p-3 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-center pt-24 pb-12">
              <h2 className="text-5xl font-bold text-yellow-300 mb-3" style={{ fontFamily: "'Pacifico', cursive" }}>Video Theater</h2>
              <p className="text-white/70">Every frame is a memory with you</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div 
                className="aspect-square flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden rounded-2xl"
                onClick={() => setEnlargedImage('/images/image1.jpg')}
              >
                <img src="/images/image1.jpg" alt="Memory 1" className="w-full h-full object-cover" />
              </div>
              <div 
                className="aspect-square flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden rounded-2xl"
                onClick={() => setEnlargedImage('/images/image2.jpg')}
              >
                <img src="/images/image2.jpg" alt="Memory 2" className="w-full h-full object-cover" />
              </div>
              <div 
                className="aspect-square flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden rounded-2xl"
                onClick={() => setEnlargedImage('/images/image3.jpg')}
              >
                <img src="/images/image3.jpg" alt="Memory 3" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square flex items-center justify-center overflow-hidden relative rounded-2xl">
                <iframe
                  src="https://drive.google.com/file/d/1J_LcJLUDkzv_HIuQbnTlTZS57Lb2OyRW/preview"
                  className="absolute inset-0 w-full h-full border-0"
                  style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}
                  title="Video Theater Memory"
                  allow="autoplay"
                  loading="eager"
                  preload="auto"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="absolute top-28 right-6 text-xl cursor-pointer hover:scale-125 transition" onClick={() => triggerEasterEgg('fightclub')}>🥊</div>
          </div>
        )}

        {/* PUZZLE PAGE */}
        {currentPage === 'puzzle' && (
          <div className="animate-fade-in">
            <button onClick={() => setCurrentPage('theater')} className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 rounded-full p-3 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-center pt-24 pb-12">
              <h2 className="text-5xl font-bold text-yellow-300 mb-3" style={{ fontFamily: "'Pacifico', cursive" }}>Puzzle Time</h2>
              <p className="text-white/70">You organize my chaos</p>
            </div>

            {!puzzleSolved ? (
              <div className="max-w-4xl mx-auto mt-8 flex gap-8 items-start justify-center">
                {/* Original Image Reference */}
                <div className="flex-shrink-0">
                  <p className="text-center mb-2 text-pink-300 text-sm font-semibold">Reference</p>
                  <div className="w-64 h-64 rounded-xl overflow-hidden border-2 border-pink-400/50 shadow-xl">
                    <img src={coupleImageUrl} alt="Reference" className="w-full h-full object-contain bg-white/5" />
                  </div>
                </div>
                
                {/* Puzzle Grid */}
                <div>
                  <p className="text-center mb-2 text-yellow-300 text-sm font-semibold">Solve the Puzzle</p>
                  <div className="grid grid-cols-3 gap-1 bg-white/10 p-2 rounded-2xl">
                    {puzzlePieces.map((piece) => {
                      const row = Math.floor(piece.id / 3);
                      const col = piece.id % 3;
                      
                      return (
                        <div
                          key={piece.id}
                          draggable
                          onDragStart={() => handleDragStart(piece)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(piece)}
                          className="aspect-square rounded-lg cursor-move hover:scale-105 transition-transform shadow-lg overflow-hidden border border-pink-300/30 hover:border-pink-400"
                          style={{
                            backgroundImage: `url(${coupleImageUrl})`,
                            backgroundSize: '300% 300%',
                            backgroundPosition: `${col * 50}% ${row * 50}%`,
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-center mt-4 text-white/60 text-sm">Drag and drop pieces to solve</p>
                </div>
              </div>
            ) : (
              <div className="text-center animate-fade-in">
                <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 backdrop-blur-lg border border-pink-300/30 rounded-3xl p-10 mx-auto max-w-2xl">
                  <h3 className="text-3xl font-bold text-pink-400 mb-6" style={{ fontFamily: "'Pacifico', cursive" }}>You did it! 💕</h3>
                  
                  <div className="rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/50 mb-6">
                    <iframe
                      src="https://drive.google.com/file/d/1YRrc0wJY57TZdQZXbECRqeJuHMcxUkL3/preview"
                      className="w-full rounded-2xl aspect-video"
                      title="Puzzle Completion Video"
                      allow="autoplay"
                      allowFullScreen
                      onLoad={(e) => {
                        // Auto-navigate to confession after video duration (estimate 30 seconds)
                        setTimeout(() => setCurrentPage('confession'), 32000);
                      }}
                    />
                  </div>

                  <div className="space-y-4 mb-6">
                    <p className="text-3xl text-yellow-300 leading-relaxed" style={{ fontFamily: "'Pacifico', cursive" }}>
                      yaar tu mujhe genuinely bohot pasand hai
                    </p>
                    <p className="text-5xl text-pink-300 font-bold leading-relaxed animate-pulse" style={{ fontFamily: "'Pacifico', cursive" }}>
                      I LOVE YOU ❤️
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute top-32 left-8 text-lg cursor-pointer hover:scale-125 transition" onClick={() => triggerEasterEgg('fir')}>🚓</div>
          </div>
        )}

        {/* FLAMES CALCULATOR PAGE */}
        {currentPage === 'flames' && (
          <div className="animate-fade-in min-h-screen flex items-center justify-center px-4">
            <button onClick={() => setCurrentPage('home')} className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 rounded-full p-3 transition z-10">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                {!showFlamesResult ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-7xl mb-6"
                    >
                      🔥
                    </motion.div>

                    <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
                      FLAMES Calculator
                    </h2>
                    <p className="text-pink-200 text-lg mb-10">Discover what the universe has planned for us</p>

                    <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-red-500/10 backdrop-blur-lg border border-pink-300/20 rounded-2xl p-8 shadow-2xl">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-pink-200 text-sm font-semibold mb-2 text-left">First Name</label>
                          <input
                            type="text"
                            value={flamesName1}
                            onChange={(e) => {
                              setFlamesName1(e.target.value);
                              setShowFlamesResult(false);
                            }}
                            className="w-full px-6 py-4 rounded-2xl bg-white/10 border-2 border-pink-300/30 text-white placeholder-pink-200/50 focus:outline-none focus:border-pink-400 text-center text-xl transition-all"
                            placeholder="Your name"
                          />
                        </div>

                        <div className="text-3xl text-pink-300">💕</div>

                        <div>
                          <label className="block text-pink-200 text-sm font-semibold mb-2 text-left">Second Name</label>
                          <input
                            type="text"
                            value={flamesName2}
                            onChange={(e) => {
                              setFlamesName2(e.target.value);
                              setShowFlamesResult(false);
                            }}
                            className="w-full px-6 py-4 rounded-2xl bg-white/10 border-2 border-pink-300/30 text-white placeholder-pink-200/50 focus:outline-none focus:border-pink-400 text-center text-xl transition-all"
                            placeholder="Their name"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={calculateFlames}
                        className="w-full mt-8 bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 hover:from-pink-600 hover:via-purple-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all shadow-lg"
                      >
                        Calculate Our Fate 🔥
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    className="text-center relative"
                  >
                    {/* Ambient glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-red-500/30 rounded-full blur-3xl animate-pulse" />
                    
                    <div className="relative bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-red-500/20 backdrop-blur-xl border-2 border-pink-300/30 rounded-3xl p-12 shadow-2xl">
                      {/* Burning Heart Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                        className="mb-8"
                      >
                        <div className="relative inline-block">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2,
                              ease: "easeInOut"
                            }}
                            className="text-8xl"
                          >
                            ❤️‍🔥
                          </motion.div>
                          <motion.div
                            animate={{ 
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-full blur-2xl opacity-50"
                          />
                        </div>
                      </motion.div>

                      {/* Result */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="text-pink-200 text-xl mb-4 font-medium">Your Destiny:</h3>
                        <motion.h1 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                          className="text-7xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-red-300 bg-clip-text text-transparent mb-6 leading-tight"
                          style={{ fontFamily: "'Pacifico', cursive" }}
                        >
                          {flamesResult}
                        </motion.h1>
                        
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="space-y-4"
                        >
                          <div className="text-2xl text-pink-200 font-medium">
                            {flamesName1} × {flamesName2}
                          </div>
                          
                          {flamesResult === 'Love' && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 }}
                              className="text-xl text-pink-100/80 leading-relaxed"
                            >
                              The stars have aligned perfectly for you two 💕
                            </motion.p>
                          )}
                          {flamesResult === 'Marriage' && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 }}
                              className="text-xl text-pink-100/80 leading-relaxed"
                            >
                              Forever is written in the stars for you both 💍
                            </motion.p>
                          )}
                          {flamesResult === 'Affection' && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 }}
                              className="text-xl text-pink-100/80 leading-relaxed"
                            >
                              A beautiful bond of care and warmth 🌸
                            </motion.p>
                          )}
                          {flamesResult === 'Friend' && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 }}
                              className="text-xl text-pink-100/80 leading-relaxed"
                            >
                              The best kind of friendship that could bloom into more 🌈
                            </motion.p>
                          )}
                          {(flamesResult === 'Enemy' || flamesResult === 'Sister') && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 }}
                              className="text-xl text-pink-100/80 leading-relaxed"
                            >
                              But who believes in FLAMES anyway? Our bond is beyond words 💫
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.4 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setShowFlamesResult(false);
                            setFlamesName1('Shashwat');
                            setFlamesName2('Trisha');
                          }}
                          className="mt-8 bg-gradient-to-r from-pink-500/50 to-purple-500/50 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-2xl text-lg transition-all border border-pink-300/30"
                        >
                          Calculate Again
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* CONFESSION PAGE */}
        {currentPage === 'confession' && (
          <div className="animate-fade-in text-center">
            <button onClick={() => setCurrentPage('puzzle')} className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 rounded-full p-3 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="pt-24 pb-8">
              <h2 className="text-5xl font-bold text-yellow-300 mb-8" style={{ fontFamily: "'Pacifico', cursive" }}>What I've Been Wanting to Say</h2>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 backdrop-blur-lg border border-pink-300/30 rounded-3xl p-8 mb-8">
              <p className="text-2xl leading-relaxed text-yellow-200">
                Mai kisi ke liye kabhi 250km durr bina bataye delhi nhi aaunga,<br />
                siway tere, apne liye bhi nhi
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 backdrop-blur-lg border border-pink-300/30 rounded-3xl p-8">
              <p className="text-3xl leading-relaxed text-yellow-300 font-semibold" style={{ fontFamily: "'Pacifico', cursive" }}>
                yaar tu mujhe genuinely bohot pasand,<br />
                <span className="text-pink-300">KISMAT badal de</span>
              </p>
            </div>

            <div className="absolute bottom-40 right-8 text-3xl cursor-pointer hover:scale-125 transition animate-pulse" onClick={() => setShowDialPad(true)}>📞</div>
          </div>
        )}
      </div>

      {/* Easter Egg Tooltip */}
      {showEasterEgg && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-red-400 px-8 py-6 rounded-2xl shadow-2xl z-[101] max-w-sm text-center animate-fade-in">
          <p className="text-lg">{easterEggMessage}</p>
        </div>
      )}

      {/* Dial Pad */}
      {showDialPad && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[102]" onClick={() => setShowDialPad(false)}>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-3xl font-bold text-yellow-300 mb-4 text-center" style={{ fontFamily: "'Pacifico', cursive" }}>Call karu bacha? 💕</h3>
            <div className="text-4xl text-pink-400 font-bold tracking-wider mb-8 text-center">8619491164</div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map((num) => (
                <button key={num} className="w-16 h-16 rounded-full bg-pink-500/20 border-2 border-pink-500/50 text-2xl hover:bg-pink-500/40 transition">
                  {num}
                </button>
              ))}
            </div>
            
            <a href="tel:8619491164" className="block w-full bg-gradient-to-r from-green-500 to-green-600 py-4 rounded-full text-xl font-semibold text-center hover:scale-105 transition">
              📞 Call Now
            </a>
            
            <button onClick={() => setShowDialPad(false)} className="mt-4 w-full bg-white/10 py-2 rounded-full hover:bg-white/20 transition">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[103] animate-fade-in"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <img 
              src={enlargedImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-full object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={() => setEnlargedImage(null)}
              className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 rounded-full p-4 text-3xl transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in;
        }
        
        .animate-shake {
          animation: shake 0.5s;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default App;
