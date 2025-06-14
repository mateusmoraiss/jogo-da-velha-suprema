
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useInfiniteTicTacToe } from '@/hooks/useInfiniteTicTacToe';
import { DifficultyLevel } from '@/types/gameTypes';
import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import GameHistory from './GameHistory';

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gray-900/80 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <GameHeader
          playerName={playerName}
          playerScore={playerScore}
          computerScore={computerScore}
          difficulty={difficulty}
          currentPlayer={currentPlayer}
          isGameActive={isGameActive}
          winner={winner}
          timeLeft={timeLeft}
        />

        <CardContent className="space-y-6">
          <GameBoard
            board={board}
            selectedPosition={selectedPosition}
            onCellClick={handleCellClick}
            onCellHover={handleCellHover}
          />

          <div className="text-center">
            <GameStatus
              winner={winner}
              currentPlayer={currentPlayer}
              playerName={playerName}
              isGameActive={isGameActive}
            />
            <GameControls
              winner={winner}
              onResetGame={resetGame}
              onDifficultyChange={onDifficultyChange}
              onNameChange={onNameChange}
            />
          </div>

          <GameHistory moveHistory={moveHistory} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TicTacToeGame;
