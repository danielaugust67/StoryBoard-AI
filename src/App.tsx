// App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Book, Scroll, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { generateStory, generateChoice, generateOutcome, generateEnding } from './geminiService';
import type { GameState, Genre } from './types';

import fantasiBg from './assets/fantasi.jpg';
import hororBg from './assets/horor.jpg';
import misteriBg from './assets/misteri.jpg';
import romantisBg from './assets/romantis.jpg';
import petualanganBg from './assets/petualangan.jpg';

import fantasiSound from './assets/sounds/fantasi.mp3';
import hororSound from './assets/sounds/horor.mp3';
import misteriSound from './assets/sounds/misteri.mp3';
import romantisSound from './assets/sounds/romantis.mp3';
import petualanganSound from './assets/sounds/petualangan.mp3';

import fantasiCursor from './assets/cursor/fantasi.png';
import hororCursor from './assets/cursor/horor.gif';
import misteriCursor from './assets/cursor/misteri.gif';
import romantisCursor from './assets/cursor/romantis.gif';
import petualanganCursor from './assets/cursor/petualangan.gif';

const cursorMap = {
  fantasi: fantasiCursor,
  horor: hororCursor,
  misteri: misteriCursor,
  romantis: romantisCursor,
  petualangan: petualanganCursor,
};

const genres: { id: Genre; title: string; icon: string }[] = [
  { id: 'fantasi', title: 'Fantasi', icon: '🧙‍♂️' },
  { id: 'horor', title: 'Horor', icon: '👻' },
  { id: 'misteri', title: 'Misteri', icon: '🔍' },
  { id: 'romantis', title: 'Romantis', icon: '💝' },
  { id: 'petualangan', title: 'Petualangan', icon: '🗺️' },
];

const backgroundImages = {
  fantasi: fantasiBg,
  horor: hororBg,
  misteri: misteriBg,
  romantis: romantisBg,
  petualangan: petualanganBg,
};

const audioMap = {
  fantasi: fantasiSound,
  horor: hororSound,
  misteri: misteriSound,
  romantis: romantisSound,
  petualangan: petualanganSound,
};

const genreColors: Record<Genre, string> = {
  fantasi: 'from-indigo-100 to-indigo-200',
  horor: 'from-gray-800 to-black text-grey',
  misteri: 'from-slate-100 to-slate-300',
  romantis: 'from-pink-100 to-pink-200',
  petualangan: 'from-amber-100 to-yellow-200',
};

function App() {
  const [gameState, setGameState] = useState<GameState>({
    genre: null,
    currentStep: 0,
    choices: [],
    karma: 0,
    storyTitle: '',
    opening: '',
    conflict: '',
    currentChoice: null,
    currentOutcome: null,
    isGenerating: false,
    isComplete: false,
    ending: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gameState.genre) {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(audioMap[gameState.genre]);
      audio.loop = true;
      audio.volume = 1;
      audio.play().catch(console.error);
      audioRef.current = audio;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [gameState.genre]);

  useEffect(() => {
    if (gameState.genre) {
      document.body.style.cursor = `url(${cursorMap[gameState.genre]}), auto`;
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [gameState.genre]);

  const handleGenreSelect = async (genre: Genre) => {
    setGameState((prev) => ({ ...prev, isGenerating: true, genre }));
    try {
      const story = await generateStory(genre);
      setGameState((prev) => ({
        ...prev,
        storyTitle: story.title,
        opening: story.opening,
        conflict: story.conflict,
        currentStep: 0,
        isGenerating: false,
      }));
    } catch (error) {
      console.error('Error generating story:', error);
      setGameState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const handleNextStep = async () => {
    if (!gameState.genre) return;
    setGameState((prev) => ({ ...prev, isGenerating: true }));
    try {
      const context = `${gameState.opening} ${gameState.conflict}`;
      const choice = await generateChoice(gameState.genre, context);
      setGameState((prev) => ({
        ...prev,
        currentChoice: choice,
        currentOutcome: null,
        isGenerating: false,
        currentStep: prev.currentStep + 1,
      }));
    } catch (error) {
      console.error('Error generating choice:', error);
      setGameState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const handleChoice = async (optionIndex: number) => {
    if (!gameState.genre || !gameState.currentChoice) return;
    setGameState((prev) => ({ ...prev, isGenerating: true }));
    try {
      const context = `${gameState.opening} ${gameState.conflict}`;
      const outcome = await generateOutcome(
        gameState.genre,
        context,
        gameState.currentChoice.text,
        gameState.currentChoice.options[optionIndex]
      );

      setGameState((prev) => ({
        ...prev,
        currentOutcome: outcome,
        choices: [...prev.choices, optionIndex],
        karma: prev.karma + outcome.impact,
        isGenerating: false,
      }));
    } catch (error) {
      console.error('Error generating outcome:', error);
      setGameState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const handleComplete = async () => {
    if (!gameState.genre) return;
    setGameState((prev) => ({ ...prev, isGenerating: true }));
    try {
      const context = `${gameState.opening} ${gameState.conflict}`;
      const ending = await generateEnding(gameState.genre, context, gameState.karma);
      setGameState((prev) => ({
        ...prev,
        ending,
        isComplete: true,
        isGenerating: false,
      }));
    } catch (error) {
      console.error('Error generating ending:', error);
      setGameState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const renderContent = () => {
    if (gameState.isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-lg">Membuat cerita untukmu...</p>
        </div>
      );
    }

    if (!gameState.genre) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-purple-800 mb-10 flex items-center gap-2"
          >
            <Sparkles className="w-8 h-8" />
            Pilih Genre Cerita
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="fixed bottom-10 w-full px-4"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {genres.map((genre) => (
                <motion.button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id)}
                  className="p-4 bg-white/70 backdrop-blur-md rounded-xl border border-purple-300 shadow-md hover:bg-purple-100 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-3xl">{genre.icon}</div>
                  <div className="text-sm font-semibold mt-1">{genre.title}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      );
    }

    if (gameState.currentStep === 0) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h1 className="text-3xl font-bold">
            <TypeAnimation sequence={[gameState.storyTitle]} wrapper="span" speed={90} cursor={false} />
          </h1>
          <TypeAnimation sequence={[gameState.opening]} wrapper="p" speed={90} cursor={false} className="text-lg" />
          <TypeAnimation sequence={[gameState.conflict]} wrapper="p" speed={90} cursor={false} className="text-lg italic" />
          <motion.button
            onClick={handleNextStep}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Book className="w-5 h-5" />
            Mulai Petualangan
          </motion.button>
        </motion.div>
      );
    }

    if (gameState.isComplete) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
          <h2 className="text-3xl font-bold">Akhir Cerita</h2>
          <TypeAnimation sequence={[gameState.ending || '']} wrapper="p" speed={90} cursor={false} className="text-xl leading-relaxed" />
          <motion.button
            onClick={() =>
              setGameState({
                genre: null,
                currentStep: 0,
                choices: [],
                karma: 0,
                storyTitle: '',
                opening: '',
                conflict: '',
                currentChoice: null,
                currentOutcome: null,
                isGenerating: false,
                isComplete: false,
                ending: null,
              })
            }
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Main Lagi
          </motion.button>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-2">
          <Scroll className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-semibold">Pilihan #{gameState.currentStep}</h2>
        </div>

        <AnimatePresence mode="wait">
          {gameState.currentChoice && !gameState.currentOutcome ? (
            <motion.div key="choice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <TypeAnimation sequence={[gameState.currentChoice.text]} wrapper="p" speed={90} cursor={false} className="text-lg" />
              <div className="space-y-3">
                {gameState.currentChoice.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleChoice(index)}
                    className="w-full p-4 text-left bg-white/50 backdrop-blur-sm border border-purple-200 rounded-lg hover:bg-purple-100 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : gameState.currentOutcome ? (
            <motion.div key="outcome" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <TypeAnimation sequence={[gameState.currentOutcome.text]} wrapper="p" speed={90} cursor={false} className="text-lg italic" />
              <motion.button
                onClick={gameState.currentStep >= 5 ? handleComplete : handleNextStep}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {gameState.currentStep >= 5 ? 'Lihat Ending' : 'Lanjutkan'}
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    );
  };

  const gradientClass = gameState.genre ? genreColors[gameState.genre] : 'from-purple-50 to-indigo-50';

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientClass} relative`}
      style={{
        backgroundImage: gameState.genre ? `url(${backgroundImages[gameState.genre]})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl">
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}

export default App;
