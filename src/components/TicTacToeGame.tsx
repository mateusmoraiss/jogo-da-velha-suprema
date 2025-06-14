
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInfiniteTicTacToe } from '@/hooks/useInfiniteTicTacToe';
import PlayerNameDialog from './PlayerNameDialog';
import { Sparkles, RotateCcw } from 'lucide-react';

const TicTacToeGame = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const [showNameDialog, setShowNameDialog] = useState(true);
  
  const {
    board,
    currentPlayer,
    winner,
    isGameActive,
    playerScore,
    computerScore,
    moveHistory,
    makeMove,
    resetGame
  } = useInfiniteTicTacToe(playerName);

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowNameDialog(false);
  };

  const handleCellClick = (index: number) => {
    if (currentPlayer === 'X' && isGameActive) {
      makeMove(index);
    }
  };

  const getCellClass = (index: number) => {
    const baseClass = "w-20 h-20 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg";
    
    if (board[index] === 'X') {
      return `${baseClass} text-cyan-400 bg-cyan-400/20 border-cyan-400/40`;
    } else if (board[index] === 'O') {
      return `${baseClass} text-pink-400 bg-pink-400/20 border-pink-400/40`;
    }
    
    return `${baseClass} hover:border-white/40`;
  };

  if (showNameDialog) {
    return <PlayerNameDialog onSubmit={handleNameSubmit} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Jogo da Velha Infinito
            </CardTitle>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-center">
              <Badge variant="outline" className="bg-cyan-400/20 text-cyan-400 border-cyan-400/40 px-4 py-2 text-lg">
                {playerName}: {playerScore}
              </Badge>
            </div>
            <div className="text-white/60 font-semibold text-lg">VS</div>
            <div className="text-center">
              <Badge variant="outline" className="bg-pink-400/20 text-pink-400 border-pink-400/40 px-4 py-2 text-lg">
                Computador: {computerScore}
              </Badge>
            </div>
          </div>

          <div className="text-center">
            {winner ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-yellow-400">
                  🎉 {winner === 'X' ? playerName : 'Computador'} Venceu! 🎉
                </div>
                <Button 
                  onClick={resetGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Jogar Novamente
                </Button>
              </div>
            ) : (
              <div className="text-xl font-semibold text-white/80">
                Vez de: <span className={currentPlayer === 'X' ? 'text-cyan-400' : 'text-pink-400'}>
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
              <div className="text-sm text-white/60 mb-2">Histórico de Jogadas:</div>
              <div className="text-sm text-white/80 max-h-20 overflow-y-auto">
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
