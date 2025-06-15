import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInfiniteTicTacToe } from '@/hooks/useInfiniteTicTacToe';
import { difficultySettings } from '@/constants/difficultySettings';
import { DifficultyLevel, ConfirmKey, CONFIRM_KEY_OPTIONS } from '@/types/gameTypes';
import { Sparkles, RotateCcw, Settings, Clock, User, Target, Zap, Home } from 'lucide-react';
import { difficulties } from './DifficultySelector';

interface TicTacToeGameProps {
  playerName: string;
  difficulty: DifficultyLevel;
  confirmKey: ConfirmKey;
  customKey?: string;
  onDifficultyChange: () => void;
  onBackToMenu: () => void;
}

const TicTacToeGame = ({ playerName, difficulty, confirmKey, customKey = '', onDifficultyChange, onBackToMenu }: TicTacToeGameProps) => {
  const [canRestart, setCanRestart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    board,
    currentPlayer,
    winner,
    isGameActive,
    playerScore,
    computerScore,
    timeLeft,
    selectedPosition,
    survivedMoves,
    averageAPM,
    averageMoveTime,
    makeMove,
    resetGame,
    changeDifficulty,
    updateSelectedPosition
  } = useInfiniteTicTacToe(playerName, difficulty);

  const difficultyName = difficulties.find(d => d.id === difficulty)?.name || difficulty;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (winner) {
      setCanRestart(false);
      const timer = setTimeout(() => {
        setCanRestart(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  useEffect(() => {
    if (isGameActive && !winner) {
      setCanRestart(false);
    }
  }, [isGameActive, winner]);

  const playMoveSound = useCallback(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const gain3 = ctx.createGain();
    const masterGain = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + 0.3);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(329.63, ctx.currentTime + 0.3);
    
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(392.00, ctx.currentTime);
    osc3.frequency.exponentialRampToValueAtTime(196.00, ctx.currentTime + 0.3);
    
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
    
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    gain3.connect(masterGain);
    
    masterGain.connect(ctx.destination);
    
    const startTime = ctx.currentTime;
    const stopTime = startTime + 0.5;
    
    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);
    
    setTimeout(() => ctx.close(), 600);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      let confirmKeyCode = '';
      if (confirmKey === 'custom') {
        confirmKeyCode = customKey.toLowerCase();
      } else {
        const confirmKeyOption = CONFIRM_KEY_OPTIONS.find(option => option.value === confirmKey);
        confirmKeyCode = confirmKeyOption?.key.toLowerCase() || ' ';
      }
      
      if (key === confirmKeyCode && winner && canRestart) {
        event.preventDefault();
        resetGame();
        return;
      }
      
      if (!winner && isGameActive) {
        let newPosition = selectedPosition;

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
        
        if (key === confirmKeyCode && currentPlayer === 'X') {
          event.preventDefault();
          makeMove(selectedPosition);
          playMoveSound();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPosition, currentPlayer, isGameActive, winner, canRestart, makeMove, updateSelectedPosition, playMoveSound, resetGame, isMobile, confirmKey, customKey]);

  const handleCellClick = (index: number) => {
    if (currentPlayer === 'X' && isGameActive && !winner && board[index] === null) {
      if (isMobile) {
        makeMove(index);
        playMoveSound();
      } else {
        updateSelectedPosition(index);
      }
    }
  };

  const handleCellHover = (index: number) => {
    if (!isMobile && currentPlayer === 'X' && isGameActive && !winner) {
      updateSelectedPosition(index);
    }
  };

  const getCellClass = (index: number) => {
    const baseClass = "w-20 h-20 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-600 rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 hover:bg-gray-700/50 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20";
    const isSelected = !isMobile && index === selectedPosition;
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

  const getConfirmKeyLabel = () => {
    if (confirmKey === 'custom') {
      return customKey || 'Personalizado';
    }
    const keyOption = CONFIRM_KEY_OPTIONS.find(option => option.value === confirmKey);
    return keyOption?.label || 'Espaço';
  };

  const getWinnerMessage = () => {
    if (winner === 'X') {
      return `🎉 Parabéns, você venceu com o APM ${averageAPM}! 🎉`;
    } else {
      return `😔 Você perdeu, sobreviveu a ${survivedMoves} jogadas`;
    }
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
                {difficultyName.toUpperCase()}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 px-4 py-2 text-lg">
                Computador: {computerScore}
              </Badge>
            </div>
          </div>

          <div className="h-16 flex flex-col justify-center">
            {currentPlayer === 'X' && isGameActive && !winner && (
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
            )}
          </div>

          <div className="h-6 text-center text-xs text-gray-400 flex items-center justify-center">
            {winner ? (
              <span>{canRestart ? (isMobile ? 'Toque "Jogar Novamente"' : `${getConfirmKeyLabel()} para reiniciar`) : 'Aguarde 1 segundo...'}</span>
            ) : (
              <span>
                {isMobile 
                  ? 'Toque na célula para jogar' 
                  : `Use WASD ou setas para navegar • Mouse para selecionar • ${getConfirmKeyLabel()} para confirmar`
                }
              </span>
            )}
          </div>

          <div className="h-20 text-center flex flex-col justify-center">
            {winner ? (
              <div className="space-y-4">
                <div className="text-xl font-bold text-yellow-400">
                  {getWinnerMessage()}
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
                    onClick={onBackToMenu}
                    variant="outline"
                    className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 px-4 py-2"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Voltar ao Início
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-xl font-semibold text-gray-200">
                Vez de: <span className={currentPlayer === 'X' ? 'text-blue-400' : 'text-cyan-400'}>
                  {currentPlayer === 'X' ? playerName : 'Computador'}
                </span>
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

          <div className="text-center h-32 flex flex-col justify-start">
            <div className="text-sm text-gray-400 mb-2">Estatísticas de Desempenho:</div>
            <div className="text-sm text-gray-300 flex-1 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-center gap-2 bg-gray-800/30 rounded-lg p-3">
                  <Target className="w-4 h-4 text-green-400" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{survivedMoves}</div>
                    <div className="text-xs text-gray-400">Jogadas Sobrevividas</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 bg-gray-800/30 rounded-lg p-3">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{averageAPM}</div>
                    <div className="text-xs text-gray-400">APM Médio</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 bg-gray-800/30 rounded-lg p-3">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">
                      {averageMoveTime > 0 ? (averageMoveTime / 1000).toFixed(1) : '0.0'}s
                    </div>
                    <div className="text-xs text-gray-400">Tempo Médio/Jogada</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicTacToeGame;
