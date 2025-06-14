
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users } from 'lucide-react';
import { GameMode } from '@/types/gameTypes';

interface GameModeSelectorProps {
  onSelect: (mode: GameMode) => void;
  onBack: () => void;
  onTutorial: () => void;
}

const modes = [
  {
    id: 'classic' as GameMode,
    name: 'Clássico',
    icon: User,
    description: 'A experiência tradicional. Um tabuleiro, um oponente.',
    color: 'from-blue-600 to-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30'
  },
  {
    id: 'dual' as GameMode,
    name: 'Supremo',
    icon: Users,
    description: 'O teste definitivo de APM. Dois tabuleiros simultaneamente.',
    color: 'from-purple-600 to-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30'
  }
];

const GameModeSelector = ({ onSelect, onBack, onTutorial }: GameModeSelectorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Escolha o Modo de Jogo
          </CardTitle>
          <p className="text-gray-300">Como você quer desafiar seus limites?</p>
          
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={onTutorial}
              variant="outline"
              className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
            >
              📖 Tutorial
            </Button>
            <Button 
              onClick={onBack}
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              ← Voltar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <Button
                  key={mode.id}
                  onClick={() => onSelect(mode.id)}
                  className={`h-auto p-6 flex flex-col items-center space-y-3 ${mode.bgColor} hover:scale-105 transition-all duration-300 border-2 hover:border-opacity-60 group`}
                  variant="outline"
                >
                  <IconComponent className="w-8 h-8 text-gray-300 group-hover:text-white transition-colors" />
                  <div className="text-center">
                    <div className={`text-xl font-bold bg-gradient-to-r ${mode.color} bg-clip-text text-transparent`}>
                      {mode.name}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{mode.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameModeSelector;
