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
  const [videoEnded, setVideoEnded] = useState(false);
  
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

  // Initialize SoundCloud Widget API for persistent autoplay
  useEffect(() => {
    // Load SoundCloud Widget API
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.onload = () => {
      const iframe = document.getElementById('soundcloud-widget');
      if (iframe && window.SC) {
        const widget = window.SC.Widget(iframe);
        
        // Auto-play when ready
        widget.bind(window.SC.Widget.Events.READY, () => {
          widget.play();
        });
      }
    };
    document.body.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Auto-navigate from puzzle video to confession when video ends
  useEffect(() => {
    if (puzzleSolved && videoEnded) {
      const timer = setTimeout(() => {
        setCurrentPage('confession');
        setVideoEnded(false);
      }, 1000); // 1 second delay for smooth transition
      return () => clearTimeout(timer);
    }
  }, [puzzleSolved, videoEnded]);

  return (
    <div className="min-h-screen bg-romantic-pink-100 text-gray-800 overflow-hidden relative grain-overlay font-romantic">
      {/* Ambient romantic background with gradient blooms */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient blooms */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-romantic-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-romantic-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-romantic-lavender-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Subtle floating hearts */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-romantic-pink-400 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 5}s`,
              animation: 'float 8s ease-in-out infinite',
            }}
          >
            ♡
          </div>
        ))}
      </div>

      {/* Lock Screen */}
      {!isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] bg-gradient-to-br from-romantic-purple-200 via-romantic-lavender-200 to-romantic-violet-200 flex items-center justify-center"
        >
          <div className="absolute inset-0 overflow-hidden opacity-15">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute text-romantic-purple-600 opacity-50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 30 + 15}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animation: 'float 10s ease-in-out infinite',
                }}
              >
                ♡
              </div>
            ))}
          </div>
          
          <div className="relative z-10 max-w-md w-full mx-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="text-center mb-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl mb-6"
              >
                💕
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold text-romantic-purple-700 mb-4 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.5px' }}>
                This is for you
              </h1>
              <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-romantic-purple-600 via-romantic-lavender-500 to-romantic-violet-600 bg-clip-text text-transparent mb-6" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '1px' }}>
                Trisha
              </h2>
              <p className="text-2xl text-romantic-purple-700 mb-8 font-medium">Happy New Year 2026! 🎊</p>
            </motion.div>

            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              onSubmit={handlePasswordSubmit}
              className="bg-white/60 backdrop-blur-romantic rounded-3xl p-8 border-2 border-romantic-purple-300 shadow-romantic-lg"
            >
              <label className="block text-romantic-purple-700 text-lg font-semibold mb-4 text-center">
                Enter the magic word 🔐
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl bg-white/70 border-2 ${
                  passwordError ? 'border-red-500 animate-shake' : 'border-romantic-purple-400'
                } text-gray-800 placeholder-romantic-purple-400 focus:outline-none focus:border-romantic-violet-500 focus:ring-2 focus:ring-romantic-purple-300 text-center text-xl transition-all duration-300`}
                placeholder="Hint: Your name, year, or celebration"
                autoFocus
              />
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-center mt-3 font-medium"
                >
                  Oops! Try again 💗
                </motion.p>
              )}
              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-romantic-purple-500 via-romantic-violet-500 to-romantic-lavender-500 hover:from-romantic-purple-600 hover:via-romantic-violet-600 hover:to-romantic-lavender-600 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-romantic-glow min-h-[48px]"
              >
                tu bohot awesome hai 💖
              </button>
            </motion.form>

            <div className="text-center mt-8 text-romantic-purple-700 text-sm font-medium">
              Made with love ❤️
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-romantic-purple-300/60 z-50 backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="h-full bg-gradient-to-r from-romantic-purple-600 via-romantic-violet-600 to-romantic-lavender-600 shadow-romantic"
        />
      </div>

      {/* Persistent SoundCloud Player (Hidden) */}
      <div className="fixed bottom-0 left-0 w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
        <iframe
          id="soundcloud-widget"
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          title="SoundCloud Music Player"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%3Aplaylists%3A2163661529%3Fsecret_token%3Ds-uIIJQ0rsHC4&color=%23a566c3&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
        />
      </div>

      {/* Floating Music Player Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        onClick={() => setIsPlayerVisible(!isPlayerVisible)}
      >
        <div className="bg-gradient-to-r from-romantic-purple-500 to-romantic-violet-500 rounded-full px-6 py-4 shadow-romantic-lg flex items-center gap-3 hover:shadow-romantic-glow transition-all duration-300 min-h-[48px]">
          <Music className="w-5 h-5 text-white animate-pulse" />
          <span className="text-sm text-white font-semibold">
            {isPlayerVisible ? 'Hide Player' : 'Playing: Our Playlist'}
          </span>
        </div>
      </motion.div>

      {/* SoundCloud Player Visual Display */}
      <AnimatePresence>
        {isPlayerVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-24 right-6 z-50"
          >
            <div className="bg-white/80 backdrop-blur-romantic border-2 border-romantic-pink-200 rounded-3xl shadow-romantic-lg p-6 w-80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Music className="w-6 h-6 text-romantic-pink-500" />
                  <span className="text-base font-semibold text-romantic-purple-700">Our Special Playlist</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlayerVisible(false);
                  }}
                  className="text-romantic-purple-600 hover:text-romantic-purple-800 transition-colors text-xl font-bold"
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
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%3Aplaylists%3A2163661529%3Fsecret_token%3Ds-uIIJQ0rsHC4&color=%23ff8fab&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
                className="rounded-2xl"
                title="SoundCloud Player"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto p-6 min-h-screen">
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="text-center pt-20 pb-12">
              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-romantic-pink-500 via-romantic-lavender-500 to-romantic-purple-500 bg-clip-text text-transparent mb-4 tracking-wide"
                style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '1px' }}
              >
                For Trisha
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-romantic-purple-600 text-xl font-medium mb-6"
              >
                Your special New Year 2026 gift 🎊
              </motion.p>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-16 h-16 mx-auto mt-4 text-romantic-pink-500" />
              </motion.div>
            </div>

            <div className="space-y-5 mt-12 max-w-xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.02, x: 8 }}
                onClick={() => setCurrentPage('flames')}
                className="bg-white/50 backdrop-blur-romantic border-2 border-romantic-purple-300 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-romantic-lg flex items-center gap-6 min-h-[90px]"
              >
                <div className="bg-gradient-to-br from-romantic-purple-300 to-romantic-violet-300 rounded-2xl p-4 text-4xl shadow-romantic">🔥</div>
                <div>
                  <h3 className="text-2xl font-semibold text-romantic-purple-700 mb-1">FLAMES Calculator</h3>
                  <p className="text-romantic-purple-600 text-base">Discover our destiny</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.02, x: 8 }}
                onClick={() => setCurrentPage('theater')}
                className="bg-white/50 backdrop-blur-romantic border-2 border-romantic-lavender-300 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-romantic-lg flex items-center gap-6 min-h-[90px]"
              >
                <div className="bg-gradient-to-br from-romantic-lavender-300 to-romantic-violet-200 rounded-2xl p-4 text-4xl shadow-romantic">🎬</div>
                <div>
                  <h3 className="text-2xl font-semibold text-romantic-lavender-700 mb-1">Video Theater</h3>
                  <p className="text-romantic-lavender-600 text-base">Our moments together</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.02, x: 8 }}
                onClick={() => setCurrentPage('puzzle')}
                className="bg-white/50 backdrop-blur-romantic border-2 border-romantic-pink-300 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-romantic-lg flex items-center gap-6 min-h-[90px]"
              >
                <div className="bg-gradient-to-br from-romantic-pink-300 to-romantic-lavender-300 rounded-2xl p-4 text-4xl shadow-romantic">🧩</div>
                <div>
                  <h3 className="text-2xl font-semibold text-romantic-pink-700 mb-1">Puzzle Time</h3>
                  <p className="text-romantic-pink-600 text-base">Solve to reveal something special</p>
                </div>
              </motion.div>
            </div>

            {/* Easter eggs */}
            <motion.div
              whileHover={{ scale: 1.3, rotate: 10 }}
              className="absolute top-12 right-8 text-3xl cursor-pointer"
              onClick={() => triggerEasterEgg('brooklyn99')}
            >
              🚔
            </motion.div>
          </motion.div>
        )}

        {/* THEATER PAGE */}
        {currentPage === 'theater' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage('home')}
              className="absolute top-6 left-6 bg-white/70 hover:bg-white/90 backdrop-blur-romantic rounded-full p-3 transition-all duration-300 shadow-romantic border-2 border-romantic-pink-200 min-h-[48px] min-w-[48px] flex items-center justify-center z-20"
            >
              <ArrowLeft className="w-6 h-6 text-romantic-purple-600" />
            </motion.button>

            <div className="text-center pt-24 pb-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-romantic-purple-600 via-romantic-lavender-500 to-romantic-pink-500 bg-clip-text text-transparent mb-3 tracking-wide"
                style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.8px' }}
              >
                Video Theater
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-romantic-purple-600 text-lg font-medium"
              >
                Every frame is a memory with you
              </motion.p>
            </div>

            <div className="grid grid-cols-2 gap-5 mt-8 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden rounded-3xl shadow-romantic-lg border-2 border-romantic-pink-200 hover:shadow-romantic-glow"
                onClick={() => setEnlargedImage('/images/image1.jpg')}
              >
                <img src="/images/image1.jpg" alt="Memory 1" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.05, rotate: -1 }}
                className="aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden rounded-3xl shadow-romantic-lg border-2 border-romantic-lavender-200 hover:shadow-romantic-glow"
                onClick={() => setEnlargedImage('/images/image2.jpg')}
              >
                <img src="/images/image2.jpg" alt="Memory 2" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden rounded-3xl shadow-romantic-lg border-2 border-romantic-purple-200 hover:shadow-romantic-glow"
                onClick={() => setEnlargedImage('/images/image3.jpg')}
              >
                <img src="/images/image3.jpg" alt="Memory 3" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="aspect-square flex items-center justify-center overflow-hidden relative rounded-3xl shadow-romantic-lg border-2 border-romantic-pink-200 bg-white/50 backdrop-blur-sm"
              >
                <iframe
                  src="https://drive.google.com/file/d/1J_LcJLUDkzv_HIuQbnTlTZS57Lb2OyRW/preview"
                  className="absolute inset-0 w-full h-full border-0 rounded-3xl"
                  style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}
                  title="Video Theater Memory"
                  allow="autoplay"
                  loading="eager"
                  preload="auto"
                  allowFullScreen
                />
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.3, rotate: 10 }}
              className="absolute top-28 right-8 text-3xl cursor-pointer"
              onClick={() => triggerEasterEgg('fightclub')}
            >
              🥊
            </motion.div>
          </motion.div>
        )}

        {/* PUZZLE PAGE */}
        {currentPage === 'puzzle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage('theater')}
              className="absolute top-6 left-6 bg-white/70 hover:bg-white/90 backdrop-blur-romantic rounded-full p-3 transition-all duration-300 shadow-romantic border-2 border-romantic-pink-200 z-20 min-h-[48px] min-w-[48px] flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 text-romantic-purple-600" />
            </motion.button>

            <div className="text-center pt-24 pb-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-romantic-pink-600 via-romantic-lavender-500 to-romantic-purple-600 bg-clip-text text-transparent mb-3 tracking-wide"
                style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.8px' }}
              >
                Puzzle Time
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-romantic-purple-600 text-lg font-medium"
              >
                You organize my chaos
              </motion.p>
            </div>

            {!puzzleSolved ? (
              <div className="max-w-6xl mx-auto mt-8 flex flex-col md:flex-row gap-8 items-start justify-center px-4">
                {/* Original Image Reference */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-shrink-0 mx-auto"
                >
                  <p className="text-center mb-3 text-romantic-pink-600 text-sm font-semibold">Reference</p>
                  <div className="w-64 h-64 rounded-3xl overflow-hidden border-2 border-romantic-pink-300 shadow-romantic-lg">
                    <img src={coupleImageUrl} alt="Reference" className="w-full h-full object-contain bg-white/50" />
                  </div>
                </motion.div>
                
                {/* Puzzle Grid */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  className="mx-auto"
                >
                  <p className="text-center mb-3 text-romantic-lavender-600 text-sm font-semibold">Solve the Puzzle</p>
                  <div className="grid grid-cols-3 gap-2 bg-white/60 backdrop-blur-romantic p-3 rounded-3xl border-2 border-romantic-lavender-200 shadow-romantic-lg">
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
                          className="aspect-square rounded-2xl cursor-move hover:scale-105 transition-all duration-300 shadow-romantic overflow-hidden border-2 border-romantic-pink-200 hover:border-romantic-purple-300"
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
                  <p className="text-center mt-4 text-romantic-purple-600 text-sm font-medium">Drag and drop pieces to solve</p>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="text-center"
              >
                <div className="bg-white/70 backdrop-blur-romantic border-2 border-romantic-pink-200 rounded-3xl p-10 mx-auto max-w-2xl shadow-romantic-lg">
                  <h3 className="text-3xl md:text-4xl font-bold text-romantic-pink-600 mb-8 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>You did it! 💕</h3>
                  
                  <div className="rounded-3xl overflow-hidden shadow-romantic-lg mb-8 border-2 border-romantic-lavender-200">
                    <iframe
                      src="https://drive.google.com/file/d/1YRrc0wJY57TZdQZXbECRqeJuHMcxUkL3/preview"
                      className="w-full rounded-3xl aspect-video"
                      title="Puzzle Completion Video"
                      allow="autoplay"
                      allowFullScreen
                      onLoad={(e) => {
                        // Auto-navigate to confession after video duration (estimate 30 seconds)
                        setTimeout(() => setCurrentPage('confession'), 32000);
                      }}
                    />
                  </div>

                  <div className="space-y-6 mb-6">
                    <p className="text-2xl md:text-3xl text-romantic-purple-700 leading-relaxed font-semibold" style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 1.7 }}>
                      yaar tu mujhe genuinely bohot pasand hai
                    </p>
                    <motion.p
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="text-4xl md:text-5xl bg-gradient-to-r from-romantic-pink-600 via-romantic-lavender-500 to-romantic-purple-600 bg-clip-text text-transparent font-bold leading-relaxed"
                      style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 1.6 }}
                    >
                      I LOVE YOU ❤️
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.3, rotate: 10 }}
              className="absolute top-32 left-8 text-3xl cursor-pointer"
              onClick={() => triggerEasterEgg('fir')}
            >
              🚓
            </motion.div>
          </motion.div>
        )}

        {/* FLAMES CALCULATOR PAGE */}
        {currentPage === 'flames' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-screen flex items-center justify-center px-4 py-20"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage('home')}
              className="absolute top-6 left-6 bg-white/70 hover:bg-white/90 backdrop-blur-romantic rounded-full p-3 transition-all duration-300 shadow-romantic border-2 border-romantic-pink-200 z-10 min-h-[48px] min-w-[48px] flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 text-romantic-purple-600" />
            </motion.button>

            <div className="w-full max-w-lg">
              <AnimatePresence mode="wait">
                {!showFlamesResult ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                      className="text-8xl mb-8"
                    >
                      🔥
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-romantic-pink-500 via-romantic-lavender-500 to-romantic-purple-500 bg-clip-text text-transparent mb-4 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.8px' }}>
                      FLAMES Calculator
                    </h2>
                    <p className="text-romantic-purple-600 text-lg mb-10 font-medium">Discover what the universe has planned for us</p>

                    <div className="bg-white/70 backdrop-blur-romantic border-2 border-romantic-pink-200 rounded-3xl p-8 shadow-romantic-lg">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-romantic-purple-700 text-sm font-semibold mb-3 text-left">First Name</label>
                          <input
                            type="text"
                            value={flamesName1}
                            onChange={(e) => {
                              setFlamesName1(e.target.value);
                              setShowFlamesResult(false);
                            }}
                            className="w-full px-6 py-4 rounded-2xl bg-white/80 border-2 border-romantic-pink-300 text-gray-800 placeholder-romantic-pink-400 focus:outline-none focus:border-romantic-purple-400 focus:ring-2 focus:ring-romantic-purple-200 text-center text-xl transition-all duration-300 min-h-[56px]"
                            placeholder="Your name"
                          />
                        </div>

                        <div className="text-4xl text-romantic-pink-500">💕</div>

                        <div>
                          <label className="block text-romantic-purple-700 text-sm font-semibold mb-3 text-left">Second Name</label>
                          <input
                            type="text"
                            value={flamesName2}
                            onChange={(e) => {
                              setFlamesName2(e.target.value);
                              setShowFlamesResult(false);
                            }}
                            className="w-full px-6 py-4 rounded-2xl bg-white/80 border-2 border-romantic-lavender-300 text-gray-800 placeholder-romantic-lavender-400 focus:outline-none focus:border-romantic-purple-400 focus:ring-2 focus:ring-romantic-purple-200 text-center text-xl transition-all duration-300 min-h-[56px]"
                            placeholder="Their name"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={calculateFlames}
                        className="w-full mt-8 bg-gradient-to-r from-romantic-pink-400 via-romantic-lavender-400 to-romantic-purple-400 hover:from-romantic-pink-500 hover:via-romantic-lavender-500 hover:to-romantic-purple-500 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-300 shadow-romantic-lg hover:shadow-romantic-glow min-h-[56px]"
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
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    className="text-center relative"
                  >
                    {/* Ambient glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-romantic-pink-300/40 via-romantic-lavender-300/40 to-romantic-purple-300/40 rounded-full blur-3xl" 
                      style={{ animation: 'pulse 3s ease-in-out infinite' }}
                    />
                    
                    <div className="relative bg-white/70 backdrop-blur-romantic border-2 border-romantic-pink-200 rounded-3xl p-12 md:p-16 shadow-romantic-lg">
                      {/* Burning Heart Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                        className="mb-10"
                      >
                        <div className="relative inline-block">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.15, 1],
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2.5,
                              ease: "easeInOut"
                            }}
                            className="text-9xl"
                          >
                            ❤️‍🔥
                          </motion.div>
                          <div className="absolute inset-0 bg-gradient-to-br from-romantic-pink-400 via-romantic-lavender-400 to-romantic-purple-400 rounded-full blur-3xl opacity-30"
                            style={{ animation: 'pulse 2.5s ease-in-out infinite' }}
                          />
                        </div>
                      </motion.div>

                      {/* Result */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <h3 className="text-romantic-purple-600 text-xl mb-6 font-semibold tracking-wide">Your Destiny:</h3>
                        <motion.h1 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                          className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-romantic-pink-500 via-romantic-lavender-500 to-romantic-purple-500 bg-clip-text text-transparent mb-8 leading-tight tracking-wide"
                          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '1.2px' }}
                        >
                          {flamesResult}
                        </motion.h1>
                        
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2, duration: 0.7 }}
                          className="space-y-6"
                        >
                          <div className="text-2xl text-romantic-purple-700 font-semibold">
                            {flamesName1} × {flamesName2}
                          </div>
                          
                          {flamesResult === 'Love' && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.4, duration: 0.7 }}
                              className="text-xl text-romantic-purple-600 leading-relaxed font-medium"
                            >
                              The stars have aligned perfectly for you two 💕
                            </motion.p>
                          )}
                          {flamesResult === 'Marriage' && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.4, duration: 0.7 }}
                              className="text-xl text-romantic-purple-600 leading-relaxed font-medium"
                            >
                              Forever is written in the stars for you both 💍
                            </motion.p>
                          )}
                          {flamesResult === 'Affection' && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.4, duration: 0.7 }}
                              className="text-xl text-romantic-purple-600 leading-relaxed font-medium"
                            >
                              A beautiful bond of care and warmth 🌸
                            </motion.p>
                          )}
                          {flamesResult === 'Friend' && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.4, duration: 0.7 }}
                              className="text-xl text-romantic-purple-600 leading-relaxed font-medium"
                            >
                              The best kind of friendship that could bloom into more 🌈
                            </motion.p>
                          )}
                          {(flamesResult === 'Enemy' || flamesResult === 'Sister') && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.4, duration: 0.7 }}
                              className="text-xl text-romantic-purple-600 leading-relaxed font-medium"
                            >
                              But who believes in FLAMES anyway? Our bond is beyond words 💫
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6, duration: 0.7 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setShowFlamesResult(false);
                            setFlamesName1('Shashwat');
                            setFlamesName2('Trisha');
                          }}
                          className="mt-10 bg-gradient-to-r from-romantic-pink-400/70 to-romantic-lavender-400/70 hover:from-romantic-pink-400 hover:to-romantic-lavender-400 text-white font-semibold py-4 px-10 rounded-2xl text-lg transition-all duration-300 border-2 border-romantic-pink-300 shadow-romantic min-h-[52px]"
                        >
                          Calculate Again
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* CONFESSION PAGE */}
        {currentPage === 'confession' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage('puzzle')}
              className="absolute top-6 left-6 bg-white/70 hover:bg-white/90 backdrop-blur-romantic rounded-full p-3 transition-all duration-300 shadow-romantic border-2 border-romantic-pink-200 z-20 min-h-[48px] min-w-[48px] flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 text-romantic-purple-600" />
            </motion.button>

            <div className="pt-24 pb-12 max-w-2xl mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-romantic-pink-600 via-romantic-lavender-500 to-romantic-purple-600 bg-clip-text text-transparent mb-8 tracking-wide"
                style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.8px', lineHeight: 1.4 }}
              >
                What I've Been Wanting to Say
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white/70 backdrop-blur-romantic border-2 border-romantic-pink-200 rounded-3xl p-8 md:p-10 mb-8 max-w-2xl mx-auto shadow-romantic-lg"
            >
              <p className="text-xl md:text-2xl leading-relaxed text-romantic-purple-700 font-medium" style={{ lineHeight: 1.8 }}>
                Mai kisi ke liye kabhi 250km durr bina bataye delhi nhi aaunga,<br />
                siway tere, apne liye bhi nhi
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white/70 backdrop-blur-romantic border-2 border-romantic-lavender-200 rounded-3xl p-8 md:p-10 max-w-2xl mx-auto shadow-romantic-lg"
            >
              <p className="text-2xl md:text-3xl leading-relaxed bg-gradient-to-r from-romantic-pink-600 via-romantic-lavender-500 to-romantic-purple-600 bg-clip-text text-transparent font-bold" style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 1.7 }}>
                yaar tu mujhe genuinely bohot pasand,<br />
                <span className="text-romantic-pink-600">KISMAT badal de</span>
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.3, rotate: 10 }}
              className="absolute bottom-40 right-8 text-4xl cursor-pointer z-10"
              onClick={() => setShowDialPad(true)}
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            >
              📞
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Easter Egg Tooltip */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-romantic border-2 border-romantic-pink-300 px-8 py-6 rounded-3xl shadow-romantic-lg z-[101] max-w-sm text-center"
          >
            <p className="text-lg text-romantic-purple-700 font-medium leading-relaxed">{easterEggMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dial Pad */}
      <AnimatePresence>
        {showDialPad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[102]"
            onClick={() => setShowDialPad(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white/95 backdrop-blur-romantic p-10 rounded-3xl shadow-romantic-lg border-2 border-romantic-pink-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold text-romantic-purple-700 mb-6 text-center tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Call karu bacha? 💕
              </h3>
              <div className="text-4xl text-romantic-pink-600 font-bold tracking-wider mb-8 text-center">8619491164</div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map((num) => (
                  <button
                    key={num}
                    className="w-16 h-16 rounded-2xl bg-romantic-pink-100 border-2 border-romantic-pink-300 text-2xl font-semibold text-romantic-purple-700 hover:bg-romantic-pink-200 hover:scale-105 transition-all duration-200 min-h-[64px]"
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              <a
                href="tel:8619491164"
                className="block w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 py-4 rounded-2xl text-xl font-semibold text-white text-center hover:scale-[1.02] transition-all duration-300 shadow-romantic min-h-[56px] flex items-center justify-center"
              >
                📞 Call Now
              </a>
              
              <button
                onClick={() => setShowDialPad(false)}
                className="mt-4 w-full bg-romantic-pink-100 hover:bg-romantic-pink-200 py-3 rounded-2xl text-romantic-purple-700 font-medium transition-all duration-200 min-h-[48px]"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enlarged Image Modal */}
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[103]"
            onClick={() => setEnlargedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-6">
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                src={enlargedImage}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain rounded-3xl shadow-romantic-lg border-4 border-white/20"
                onClick={(e) => e.stopPropagation()}
              />
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setEnlargedImage(null)}
                className="absolute top-8 right-8 bg-white/90 hover:bg-white backdrop-blur-romantic rounded-full p-4 text-3xl transition-all duration-300 shadow-romantic border-2 border-romantic-pink-200 min-h-[56px] min-w-[56px] flex items-center justify-center text-romantic-purple-700 font-bold"
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
