import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDualTicTacToe } from '@/hooks/useDualTicTacToe';
import { difficultySettings } from '@/constants/difficultySettings';
import { DifficultyLevel } from '@/types/gameTypes';
import { Sparkles, RotateCcw, Settings, Clock, User, Users } from 'lucide-react';

interface DualTicTacToeGameProps {
  playerName: string;
  difficulty: DifficultyLevel;
  onDifficultyChange: () => void;
  onNameChange: () => void;
  onModeChange: () => void;
}

const DualTicTacToeGame = ({ playerName, difficulty, onDifficultyChange, onNameChange, onModeChange }: DualTicTacToeGameProps) => {
  const {
    game1,
    game2,
    activeBoard,
    sharedSelectedPosition,
    updateSelectedPosition,
    makeMove,
    resetGame,
    changeDifficulty,
  } = useDualTicTacToe(playerName, difficulty);

  const games = [game1, game2];
  const totalPlayerScore = game1.playerScore + game2.playerScore;
  const totalComputerScore = game1.computerScore + game2.computerScore;
  const activeGame = activeBoard === 1 ? game1 : game2;
  const winner = game1.winner || game2.winner;
  const isMatchOver = !game1.isGameActive && !game2.isGameActive;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      let newPosition = sharedSelectedPosition;
      if (event.key === 'ArrowUp' && newPosition > 2) newPosition -= 3;
      else if (event.key === 'ArrowDown' && newPosition < 6) newPosition += 3;
      else if (event.key === 'ArrowLeft' && newPosition % 3 !== 0) newPosition -= 1;
      else if (event.key === 'ArrowRight' && newPosition % 3 !== 2) newPosition += 1;
      
      if (newPosition !== sharedSelectedPosition) updateSelectedPosition(newPosition);
      
      const isAnyGameActive = game1.isGameActive || game2.isGameActive;
      if (event.key === ' ' && isAnyGameActive) {
        event.preventDefault();
        const gameToPlay = activeBoard === 1 ? game1 : game2;
        if (gameToPlay.isGameActive) {
          makeMove(activeBoard, sharedSelectedPosition);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sharedSelectedPosition, updateSelectedPosition, makeMove, activeBoard, game1.isGameActive, game2.isGameActive]);

  const getCellClass = (cell: 'X' | 'O' | null, index: number, boardNum: number) => {
    const baseClass = "w-16 h-16 md:w-20 md:h-20 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-600 rounded-xl flex items-center justify-center text-3xl font-bold transition-all duration-300";
    const selectedClass = index === sharedSelectedPosition ? "ring-2 ring-yellow-400 ring-opacity-75 bg-yellow-500/10" : "";
    const isActiveBoard = (boardNum + 1) === activeBoard;
    const isPlayerTurn = isActiveBoard && activeGame.currentPlayer === 'X';
    const turnClass = isPlayerTurn ? "cursor-pointer hover:bg-gray-700/50 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20" : "cursor-not-allowed opacity-60";
    
    if (cell === 'X') return `${baseClass} ${selectedClass} text-blue-400 bg-blue-500/20 border-blue-500/40 shadow-lg shadow-blue-500/20`;
    if (cell === 'O') return `${baseClass} ${selectedClass} text-cyan-400 bg-cyan-500/20 border-cyan-500/40 shadow-lg shadow-cyan-500/20`;
    
    return `${baseClass} ${selectedClass} ${turnClass} hover:border-gray-500`;
  };

  const getDifficultyColor = () => {
    const colors = { easy: 'text-green-400', medium: 'text-blue-400', hard: 'text-purple-400', nightmare: 'text-red-400', insane: 'text-yellow-400', godlike: 'text-violet-400', armageddon: 'text-orange-400' };
    return colors[difficulty];
  };

  const getTimeBarColor = () => {
    if (activeGame.timeLeft > 3) return 'bg-gradient-to-r from-green-500 to-blue-500';
    if (activeGame.timeLeft > 1) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const handleCellClick = (boardIndex: 1 | 2, cellIndex: number) => {
    makeMove(boardIndex, cellIndex);
  }

  const getBoardStatus = (boardNum: number) => {
    const game = boardNum === 0 ? game1 : game2;
    const isActive = (boardNum + 1) === activeBoard;
    
    if (game.winner) return `${game.winner === 'X' ? playerName : 'Computador'} Venceu!`;
    if (game.currentPlayer === 'O') return 'Computador jogando...';
    if (isActive && game.currentPlayer === 'X') return 'Sua vez!';
    return 'Aguardando...';
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-gray-900/80 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Velha Suprema
            </CardTitle>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/40 px-4 py-2 text-lg">
              {playerName}: {totalPlayerScore}
            </Badge>
            <div className="flex flex-col items-center">
              <Badge variant="outline" className={`${getDifficultyColor()} bg-gray-800/50 border-gray-600 px-3 py-1 text-sm`}>
                {difficulty.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="mt-1 bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1 text-xs">MODO SUPREMO</Badge>
            </div>
            <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 px-4 py-2 text-lg">
              Computador: {totalComputerScore}
            </Badge>
          </div>

          {activeGame.isGameActive && !winner && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-white/80">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Tempo: {activeGame.timeLeft.toFixed(1)}s</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-100 ${getTimeBarColor()}`}
                  style={{ width: `${(activeGame.timeLeft / difficultySettings[difficulty].time) * 100}%` }}/>
              </div>
            </div>
          )}
          
          <div className="text-center text-xs text-gray-400">
            Use as setas do teclado para navegar • ESPAÇO para confirmar • Jogue no tabuleiro {activeBoard}
          </div>

          <div className="text-center">
            {isMatchOver && (
              <div className="space-y-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {totalPlayerScore > totalComputerScore && `🎉 ${playerName} Venceu a partida! 🎉`}
                  {totalComputerScore > totalPlayerScore && `🎉 Computador Venceu a partida! 🎉`}
                  {totalComputerScore === totalPlayerScore && `😲 Empate incrível! 😲`}
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button onClick={resetGame} className="bg-gradient-to-r from-blue-600 to-cyan-600"> <RotateCcw className="w-4 h-4 mr-2" /> Jogar Novamente </Button>
                  <Button onClick={onDifficultyChange} variant="outline"> <Settings className="w-4 h-4 mr-2" /> Mudar Nível </Button>
                  <Button onClick={onModeChange} variant="outline"> <Users className="w-4 h-4 mr-2" /> Mudar Modo </Button>
                  <Button onClick={onNameChange} variant="outline"> <User className="w-4 h-4 mr-2" /> Trocar Nome </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            {games.map((game, boardNum) => (
              <div key={boardNum} className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">
                    Tabuleiro {boardNum + 1}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`px-3 py-1 text-sm ${
                      (boardNum + 1) === activeBoard && game.currentPlayer === 'X' 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' 
                        : game.currentPlayer === 'O'
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/40'
                    }`}
                  >
                    {getBoardStatus(boardNum)}
                  </Badge>
                </div>
                <div className={`grid grid-cols-3 gap-2 w-fit ${(boardNum + 1) === activeBoard ? 'ring-2 ring-blue-400/50 rounded-xl p-2' : 'opacity-60'}`}>
                  {game.board.map((cell, index) => (
                    <div
                      key={index}
                      className={getCellClass(cell, index, boardNum)}
                      onClick={() => handleCellClick((boardNum + 1) as 1 | 2, index)}
                    >
                      {cell && <span className="animate-scale-in">{cell}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DualTicTacToeGame;
