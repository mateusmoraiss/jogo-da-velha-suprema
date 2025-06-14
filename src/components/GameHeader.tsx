
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock } from 'lucide-react';
import { DifficultyLevel } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';

interface GameHeaderProps {
  playerName: string;
  playerScore: number;
  computerScore: number;
  difficulty: DifficultyLevel;
  currentPlayer: string;
  isGameActive: boolean;
  winner: string | null;
  timeLeft: number;
}

const GameHeader = ({ 
  playerName, 
  playerScore, 
  computerScore, 
  difficulty, 
  currentPlayer, 
  isGameActive, 
  winner, 
  timeLeft 
}: GameHeaderProps) => {
  const getDifficultyColor = () => {
    const colors = { 
      easy: 'text-green-400', 
      medium: 'text-blue-400', 
      hard: 'text-purple-400', 
      nightmare: 'text-red-400', 
      insane: 'text-yellow-400', 
      godlike: 'text-violet-400', 
      armageddon: 'text-orange-400' 
    };
    return colors[difficulty];
  };

  const getTimeBarColor = () => {
    if (timeLeft > 3) return 'bg-gradient-to-r from-green-500 to-blue-500';
    if (timeLeft > 1) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  return (
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
        {winner ? (
          <span>ESPAÇO para reiniciar</span>
        ) : (
          <span>Use WASD ou setas para navegar • Mouse para selecionar • ESPAÇO para confirmar</span>
        )}
      </div>
    </CardHeader>
  );
};

export default GameHeader;
