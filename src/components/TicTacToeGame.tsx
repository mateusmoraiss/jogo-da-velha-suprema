import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInfiniteTicTacToe } from '@/hooks/useInfiniteTicTacToe';
import { difficultySettings } from '@/constants/difficultySettings';
import { DifficultyLevel } from '@/types/gameTypes';
import { Sparkles, RotateCcw, Settings, Clock, User } from 'lucide-react';

interface TicTacToeGameProps {
  playerName: string;
  difficulty: DifficultyLevel;
  onDifficultyChange: () => void;
  onNameChange: () => void;
}

const TicTacToeGame = ({ playerName, difficulty, onDifficultyChange, onNameChange }: TicTacToeGameProps) => {
  const {
    board,
    currentPlayer,
    winner,
    isGameActive,
    playerScore,
    computerScore,
    moveHistory,
    timeLeft,
    selectedPosition,
    makeMove,
    resetGame,
    changeDifficulty,
    updateSelectedPosition
  } = useInfiniteTicTacToe(playerName, difficulty);

  // Modern pleasant sound effect for piece placement
  const playMoveSound = useCallback(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create multiple oscillators for a richer sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const gain3 = ctx.createGain();
    const masterGain = ctx.createGain();
    
    // Main tone - warm sine wave
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + 0.3); // C4
    
    // Harmonic - adds warmth
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc2.frequency.exponentialRampToValueAtTime(329.63, ctx.currentTime + 0.3); // E4
    
    // Sub harmonic - adds depth
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
    osc3.frequency.exponentialRampToValueAtTime(196.00, ctx.currentTime + 0.3); // G3
    
    // Gain envelopes for smooth attack and decay
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    gain3.gain.setValueAtTime(0, ctx.currentTime);
    gain3.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.02);
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    masterGain.gain.setValueAtTime(0.8, ctx.currentTime);
    
    // Connect the audio graph
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    gain3.connect(masterGain);
    
    masterGain.connect(ctx.destination);
    
    // Start and stop
    const startTime = ctx.currentTime;
    const stopTime = startTime + 0.5;
    
    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);
    
    // Clean up
    setTimeout(() => ctx.close(), 600);
  }, []);

  // Enhanced keyboard controls with WASD support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      let newPosition = selectedPosition;

      // Arrow keys and WASD support
      if ((key === 'arrowup' || key === 'w') && selectedPosition > 2) {
        newPosition = selectedPosition - 3;
      } else if ((key === 'arrowdown' || key === 's') && selectedPosition < 6) {
        newPosition = selectedPosition + 3;
      } else if ((key === 'arrowleft' || key === 'a') && selectedPosition % 3 !== 0) {
        newPosition = selectedPosition - 1;
      } else if ((key === 'arrowright' || key === 'd') && selectedPosition % 3 !== 2) {
        newPosition = selectedPosition + 1;
      }
      
      if (newPosition !== selectedPosition) {
        updateSelectedPosition(newPosition);
      }
      
      if (key === ' ' && currentPlayer === 'X' && isGameActive && !winner) {
        event.preventDefault();
        makeMove(selectedPosition);
        playMoveSound();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPosition, currentPlayer, isGameActive, winner, makeMove, updateSelectedPosition, playMoveSound]);

  // Mouse apenas seleciona, não clica para jogar
  const handleCellClick = (index: number) => {
    // Mouse click apenas seleciona a célula, não faz a jogada
    if (currentPlayer === 'X' && isGameActive && !winner) {
      updateSelectedPosition(index);
    }
  };

  const handleCellHover = (index: number) => {
    if (currentPlayer === 'X' && isGameActive && !winner) {
      updateSelectedPosition(index);
    }
  };

  const getCellClass = (index: number) => {
    const baseClass = "w-20 h-20 bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-xl border border-gray-600/30 rounded-2xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:shadow-2xl hover:bg-gradient-to-br hover:from-gray-700/40 hover:to-gray-800/60 relative overflow-hidden";
    const isSelected = index === selectedPosition;
    const selectedClass = isSelected ? "ring-2 ring-yellow-400/80 ring-offset-2 ring-offset-gray-900/50 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 shadow-lg shadow-yellow-400/20" : "";
    
    if (board[index] === 'X') return `${baseClass} ${selectedClass} text-blue-400 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50 shadow-xl shadow-blue-500/30`;
    if (board[index] === 'O') return `${baseClass} ${selectedClass} text-cyan-400 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-cyan-400/50 shadow-xl shadow-cyan-500/30`;
    
    return `${baseClass} ${selectedClass} hover:border-gray-400/50 hover:shadow-gray-500/20`;
  };

  const getDifficultyColor = () => {
    const colors = { easy: 'text-emerald-400', medium: 'text-blue-400', hard: 'text-purple-400', nightmare: 'text-red-400', insane: 'text-yellow-400', godlike: 'text-violet-400', armageddon: 'text-orange-400' };
    return colors[difficulty];
  };

  const getTimeBarColor = () => {
    if (timeLeft > 3) return 'bg-gradient-to-r from-emerald-400 via-blue-500 to-cyan-500 progress-modern';
    if (timeLeft > 1) return 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 progress-modern';
    return 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 progress-modern';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="glass-morphism border-gray-700/30 shadow-2xl card-hover bg-gradient-to-br from-gray-900/80 to-gray-800/80">
        <CardHeader className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 reveal">
            <Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Velha Suprema
            </CardTitle>
            <Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
          </div>
          
          <div className="flex items-center justify-between fade-in-up">
            <div className="text-center">
              <Badge variant="outline" className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-400/40 px-6 py-3 text-lg font-semibold backdrop-blur-sm">
                {playerName}: {playerScore}
              </Badge>
            </div>
            <div className="flex flex-col items-center">
              <Badge variant="outline" className={`${getDifficultyColor()} bg-gradient-to-r from-gray-800/60 to-gray-700/60 border-gray-500/40 px-4 py-2 text-sm font-medium backdrop-blur-sm`}>
                {difficulty.toUpperCase()}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-400/40 px-6 py-3 text-lg font-semibold backdrop-blur-sm">
                Computador: {computerScore}
              </Badge>
            </div>
          </div>

          {currentPlayer === 'X' && isGameActive && !winner && (
            <div className="space-y-3 fade-in-up">
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Clock className="w-5 h-5" />
                <span className="text-base font-medium">
                  Tempo: {timeLeft.toFixed(1)}s
                </span>
              </div>
              <div className="w-full bg-gray-700/50 backdrop-blur-sm rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-200 ease-out ${getTimeBarColor()}`}
                  style={{ width: `${(timeLeft / difficultySettings[difficulty].time) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-400/80 bg-gray-800/30 backdrop-blur-sm rounded-lg px-4 py-2">
            Use WASD ou setas para navegar • Mouse para selecionar • ESPAÇO para confirmar
          </div>

          <div className="text-center">
            {winner ? (
              <div className="space-y-6 scale-in">
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  🎉 {winner === 'X' ? playerName : 'Computador'} Venceu! 🎉
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button 
                    onClick={resetGame}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 btn-modern btn-micro shadow-lg hover:shadow-xl"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Jogar Novamente
                  </Button>
                  <Button 
                    onClick={onDifficultyChange}
                    variant="outline"
                    className="bg-gray-800/60 border-gray-500/40 text-gray-300 hover:bg-gray-700/60 px-6 py-3 rounded-xl backdrop-blur-sm btn-micro transition-all duration-300"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Mudar Nível
                  </Button>
                  <Button 
                    onClick={onNameChange}
                    variant="outline"
                    className="bg-gray-800/60 border-gray-500/40 text-gray-300 hover:bg-gray-700/60 px-6 py-3 rounded-xl backdrop-blur-sm btn-micro transition-all duration-300"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Trocar Nome
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-2xl font-semibold text-gray-200">
                Vez de: <span className={currentPlayer === 'X' ? 'text-blue-400' : 'text-cyan-400'}>
                  {currentPlayer === 'X' ? playerName : 'Computador'}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-3 gap-4 mx-auto w-fit p-6 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-600/20">
            {board.map((cell, index) => (
              <div
                key={index}
                className={getCellClass(index)}
                onClick={() => handleCellClick(index)}
                onMouseEnter={() => handleCellHover(index)}
              >
                {cell && (
                  <span className="scale-in drop-shadow-lg">
                    {cell}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
              </div>
            ))}
          </div>

          {moveHistory.length > 0 && (
            <div className="text-center fade-in-up">
              <div className="text-base text-gray-400 mb-3 font-medium">Histórico de Jogadas:</div>
              <div className="text-sm text-gray-300 max-h-24 overflow-y-auto bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/20">
                {moveHistory.slice(-5).reverse().map((move, index) => (
                  <div key={index} className="mb-2 last:mb-0 opacity-80 hover:opacity-100 transition-opacity">
                    {move}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TicTacToeGame;
