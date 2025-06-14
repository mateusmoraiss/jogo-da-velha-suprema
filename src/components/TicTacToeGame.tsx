
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInfiniteTicTacToe } from '@/hooks/useInfiniteTicTacToe';
import PlayerNameDialog from './PlayerNameDialog';
import DifficultySelector, { DifficultyLevel } from './DifficultySelector';
import { Sparkles, RotateCcw, Settings, Clock } from 'lucide-react';

const TicTacToeGame = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const [showNameDialog, setShowNameDialog] = useState(true);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  
  const {
    board,
    currentPlayer,
    winner,
    isGameActive,
    playerScore,
    computerScore,
    moveHistory,
    timeLeft,
    difficulty,
    makeMove,
    resetGame,
    changeDifficulty
  } = useInfiniteTicTacToe(playerName, selectedDifficulty);

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowNameDialog(false);
    setShowDifficultySelector(true);
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    changeDifficulty(difficulty);
    setShowDifficultySelector(false);
  };

  const handleCellClick = (index: number) => {
    if (currentPlayer === 'X' && isGameActive) {
      makeMove(index);
    }
  };

  const getCellClass = (index: number) => {
    const baseClass = "w-20 h-20 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-600 rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 hover:bg-gray-700/50 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20";
    
    if (board[index] === 'X') {
      return `${baseClass} text-blue-400 bg-blue-500/20 border-blue-500/40 shadow-lg shadow-blue-500/20`;
    } else if (board[index] === 'O') {
      return `${baseClass} text-cyan-400 bg-cyan-500/20 border-cyan-500/40 shadow-lg shadow-cyan-500/20`;
    }
    
    return `${baseClass} hover:border-gray-500`;
  };

  const getDifficultyColor = () => {
    const colors = {
      easy: 'text-green-400',
      medium: 'text-blue-400',
      hard: 'text-purple-400',
      nightmare: 'text-red-400',
      armageddon: 'text-orange-400',
      insane: 'text-yellow-400',
      godlike: 'text-violet-400'
    };
    return colors[difficulty];
  };

  const getTimeBarColor = () => {
    if (timeLeft > 3) return 'bg-gradient-to-r from-green-500 to-blue-500';
    if (timeLeft > 1) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  if (showNameDialog) {
    return <PlayerNameDialog onSubmit={handleNameSubmit} />;
  }

  if (showDifficultySelector) {
    return <DifficultySelector onSelect={handleDifficultySelect} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gray-900/80 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Jogo da Velha Infinito
            </CardTitle>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-center">
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/40 px-4 py-2 text-lg">
                {playerName}: {playerScore}
              </Badge>
            </div>
            <div className="text-center">
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

          {/* Timer */}
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

          <div className="text-center">
            {winner ? (
              <div className="space-y-4">
                <div className="text-2xl font-bold text-yellow-400">
                  🎉 {winner === 'X' ? playerName : 'Computador'} Venceu! 🎉
                </div>
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={resetGame}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Jogar Novamente
                  </Button>
                  <Button 
                    onClick={() => setShowDifficultySelector(true)}
                    variant="outline"
                    className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 px-6 py-2 rounded-lg transition-all duration-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Mudar Nível
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
                {moveHistory.slice(-3).map((move, index) => (
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
