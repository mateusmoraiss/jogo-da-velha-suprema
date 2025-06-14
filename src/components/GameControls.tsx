
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Settings, User } from 'lucide-react';

interface GameControlsProps {
  winner: string | null;
  onResetGame: () => void;
  onDifficultyChange: () => void;
  onNameChange: () => void;
}

const GameControls = ({ winner, onResetGame, onDifficultyChange, onNameChange }: GameControlsProps) => {
  if (!winner) return null;

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      <Button 
        onClick={onResetGame}
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
  );
};

export default GameControls;
