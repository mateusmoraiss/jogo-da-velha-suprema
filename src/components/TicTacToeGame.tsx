
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
  const [canRestart, setCanRestart] = useState(false);
  
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

  // Controla o delay para reiniciar
  useEffect(() => {
    if (winner) {
      setCanRestart(false);
      const timer = setTimeout(() => {
        setCanRestart(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  // Reseta o flag quando o jogo reinicia
  useEffect(() => {
    if (isGameActive && !winner) {
      setCanRestart(false);
    }
  }, [isGameActive, winner]);

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
      
      // Se o jogo terminou, ESPAÇO reinicia (com delay)
      if (key === ' ' && winner && canRestart) {
        event.preventDefault();
        resetGame();
        return;
      }
      
      // Controles normais durante o jogo
      if (!winner && isGameActive) {
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
        
        if (key === ' ' && currentPlayer === 'X') {
          event.preventDefault();
          makeMove(selectedPosition);
          playMoveSound();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPosition, currentPlayer, isGameActive, winner, canRestart, makeMove, updateSelectedPosition, playMoveSound, resetGame]);

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
    const baseClass = "w-20 h-20 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-600 rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 hover:bg-gray-700/50 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20";
    const isSelected = index === selectedPosition;
    const selectedClass = isSelected ? "ring-2 ring-yellow-400 ring-opacity-75 bg-yellow-500/10" : "";
    
    if (board[index] === 'X') return `${baseClass} ${selectedClass} text-blue-400 bg-blue-500/20 border-blue-500/40 shadow-lg shadow-blue-500/20`;
    if (board[index] === 'O') return `${baseClass} ${selectedClass} text-cyan-400 bg-cyan-500/20 border-cyan-500/40 shadow-lg shadow-cyan-500/20`;
    
    return `${baseClass} ${selectedClass} hover:border-gray-500`;
  };

  const getDifficultyColor = () => {
    const colors = { easy: 'text-green-400', medium: 'text-blue-400', hard: 'text-purple-400', nightmare: 'text-red-400', insane: 'text-yellow-400', godlike: 'text-violet-400', armageddon: 'text-orange-400' };
    return colors[difficulty];
  };

  const getTimeBarColor = () => {
    if (timeLeft > 3) return 'bg-gradient-to-r from-green-500 to-blue-500';
    if (timeLeft > 1) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gray-900/80 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Velha Suprema
            </CardTitle>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-center">
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/40 px-4 py-2 text-lg">
                {playerName}: {playerScore}
              </Badge>
            </div>
            <div className="flex flex-col items-center">
              <Badge variant="outline" className={`${getDifficultyColor()} bg-gray-800/50 border-gray-600 px-3 py-1 text-sm`}>
                {difficulty.toUpperCase()}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 px-4 py-2 text-lg">
                Computador: {computerScore}
              </Badge>
            </div>
          </div>

          {/* Container com altura fixa para evitar movimento do layout */}
          <div className="h-16 flex flex-col justify-center">
            {currentPlayer === 'X' && isGameActive && !winner ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-white/80">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Tempo: {timeLeft.toFixed(1)}s
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-100 ${getTimeBarColor()}`}
                    style={{ width: `${(timeLeft / difficultySettings[difficulty].time) * 100}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="text-center text-xs text-gray-400">
            {winner ? (
              <span>{canRestart ? 'ESPAÇO para reiniciar' : 'Aguarde 1 segundo...'}</span>
            ) : (
              <span>Use WASD ou setas para navegar • Mouse para selecionar • ESPAÇO para confirmar</span>
            )}
          </div>

          <div className="text-center">
            {winner ? (
              <div className="space-y-4">
                <div className="text-2xl font-bold text-yellow-400">
                  🎉 {winner === 'X' ? playerName : 'Computador'} Venceu! 🎉
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button 
                    onClick={resetGame}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-4 py-2 rounded-lg"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Jogar Novamente
                  </Button>
                  <Button 
                    onClick={onDifficultyChange}
                    variant="outline"
                    className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 px-4 py-2"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Mudar Nível
                  </Button>
                  <Button 
                    onClick={onNameChange}
                    variant="outline"
                    className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 px-4 py-2"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Trocar Nome
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-xl font-semibold text-gray-200">
                {currentPlayer === 'O' ? (
                  <span className="text-cyan-400">Computador jogando...</span>
                ) : (
                  <>Sua vez, <span className="text-blue-400">{playerName}</span>!</>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-3 mx-auto w-fit">
            {board.map((cell, index) => (
              <div
                key={index}
                className={getCellClass(index)}
                onClick={() => handleCellClick(index)}
                onMouseEnter={() => handleCellHover(index)}
              >
                {cell && (
                  <span className="animate-scale-in">
                    {cell}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Container com altura fixa para o histórico */}
          <div className="text-center h-32 flex flex-col justify-start">
            <div className="text-sm text-gray-400 mb-2">Histórico de Jogadas:</div>
            <div className="text-sm text-gray-300 h-24 overflow-y-auto flex-1">
              {moveHistory.length > 0 ? (
                <div className="space-y-1">
                  {moveHistory.slice(-5).reverse().map((move, index) => (
                    <div key={index} className="py-0.5">
                      {move}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic pt-8">
                  Nenhuma jogada ainda
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicTacToeGame;
