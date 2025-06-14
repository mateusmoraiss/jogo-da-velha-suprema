
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInfiniteTicTacToe } from '@/hooks/useInfiniteTicTacToe';
import { difficultySettings } from '@/constants/difficultySettings';
import { DifficultyLevel } from '@/types/gameTypes';
import { Sparkles, RotateCcw, Settings, Clock, User, Users } from 'lucide-react';

interface TicTacToeGameProps {
  playerName: string;
  difficulty: DifficultyLevel;
  onDifficultyChange: () => void;
  onNameChange: () => void;
  onModeChange: () => void;
}

const TicTacToeGame = ({ playerName, difficulty, onDifficultyChange, onNameChange, onModeChange }: TicTacToeGameProps) => {
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

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      let newPosition = selectedPosition;

      if (key === 'ArrowUp' && selectedPosition > 2) newPosition = selectedPosition - 3;
      else if (key === 'ArrowDown' && selectedPosition < 6) newPosition = selectedPosition + 3;
      else if (key === 'ArrowLeft' && selectedPosition % 3 !== 0) newPosition = selectedPosition - 1;
      else if (key === 'ArrowRight' && selectedPosition % 3 !== 2) newPosition = selectedPosition + 1;
      
      if (newPosition !== selectedPosition) updateSelectedPosition(newPosition);
      
      if (key === ' ' && currentPlayer === 'X' && isGameActive && !winner) {
        event.preventDefault();
        makeMove(selectedPosition);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPosition, currentPlayer, isGameActive, winner, makeMove, updateSelectedPosition]);

  const handleCellClick = (index: number) => {
    if (currentPlayer === 'X' && isGameActive && !winner) {
      makeMove(index);
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
              <Badge variant="outline" className="mt-1 bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1 text-xs">MODO CLÁSSICO</Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 px-4 py-2 text-lg">
                Computador: {computerScore}
              </Badge>
            </div>
          </div>

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

          <div className="text-center text-xs text-gray-400">
            Use as setas do teclado para navegar • ESPAÇO para confirmar
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
                    onClick={onModeChange}
                    variant="outline"
                    className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 px-4 py-2"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Mudar Modo
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
              >
                {cell && (
                  <span className="animate-scale-in">
                    {cell}
                  </span>
                )}
              </div>
            ))}
          </div>

          {moveHistory.length > 0 && (
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Histórico de Jogadas:</div>
              <div className="text-sm text-gray-300 max-h-20 overflow-y-auto">
                {moveHistory.slice(-5).reverse().map((move, index) => (
                  <div key={index} className="mb-1">
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
