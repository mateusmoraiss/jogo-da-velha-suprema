import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, Skull, Flame, Target, Shield, Sword } from 'lucide-react';
import { playClickSound } from '@/utils/soundUtils';
import { DifficultyLevel } from '@/types/gameTypes';

interface DifficultySelectorProps {
  onSelect: (difficulty: DifficultyLevel) => void;
  onBack: () => void;
  onTutorial: () => void;
}

export const difficulties = [
  {
    id: 'easy' as DifficultyLevel,
    name: 'Divino',
    icon: Shield,
    time: '∞',
    description: 'Ideal para iniciantes.',
    color: 'from-green-600 to-green-400',
    bgColor: 'bg-green-500/10 border-green-500/30'
  },
  {
    id: 'medium' as DifficultyLevel,
    name: 'Muito Fácil',
    icon: Target,
    time: '2s',
    description: 'Tempo confortável.',
    color: 'from-blue-600 to-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30'
  },
  {
    id: 'hard' as DifficultyLevel,
    name: 'Fácil',
    icon: Brain,
    time: '1.6s',
    description: 'Pense rápido!',
    color: 'from-purple-600 to-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30'
  },
  {
    id: 'nightmare' as DifficultyLevel,
    name: 'Médio',
    icon: Sword,
    time: '1.3s',
    description: 'Pressão crescente.',
    color: 'from-violet-600 to-pink-600',
    bgColor: 'bg-violet-500/10 border-violet-500/30'
  },
  {
    id: 'insane' as DifficultyLevel,
    name: 'Difícil',
    icon: Zap,
    time: '1.1s',
    description: 'Reflexos rápidos.',
    color: 'from-yellow-600 to-orange-600',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30'
  },
  {
    id: 'godlike' as DifficultyLevel,
    name: 'Pesadelo',
    icon: Skull,
    time: '0.9s',
    description: 'Quase impossível.',
    color: 'from-red-600 to-red-400',
    bgColor: 'bg-red-500/10 border-red-500/30'
  },
  {
    id: 'armageddon' as DifficultyLevel,
    name: 'Armagedon',
    icon: Flame,
    time: '0.6s',
    description: '💀 Terror puro.',
    color: 'from-red-700 via-orange-600 to-yellow-500',
    bgColor: 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-600/50 shadow-lg shadow-red-500/20'
  }
];

const DifficultySelector = ({ onSelect, onBack, onTutorial }: DifficultySelectorProps) => {
  const handleClick = (callback: () => void) => {
    playClickSound();
    callback();
  };

  const handleSelect = (difficulty: DifficultyLevel) => {
    playClickSound();
    onSelect(difficulty);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Escolha a Dificuldade
          </CardTitle>
          <p className="text-gray-300">Teste suas habilidades contra diferentes níveis de IA</p>
          
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => handleClick(onTutorial)}
              variant="outline"
              className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
            >
              📖 Tutorial
            </Button>
            <Button 
              onClick={() => handleClick(onBack)}
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              ← Voltar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => {
              const IconComponent = difficulty.icon;
              return (
                <Button
                  key={difficulty.id}
                  onClick={() => handleSelect(difficulty.id)}
                  className={`h-auto p-6 flex flex-col items-center space-y-3 ${difficulty.bgColor} hover:scale-105 transition-all duration-300 border-2 hover:border-opacity-60 group`}
                  variant="outline"
                >
                  <IconComponent className="w-8 h-8 text-gray-300 group-hover:text-white transition-colors" />
                  <div className="text-center">
                    <div className={`text-xl font-bold bg-gradient-to-r ${difficulty.color} bg-clip-text text-transparent`}>
                      {difficulty.name}
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs bg-gray-800/50 text-gray-300 border-gray-600">
                      {difficulty.time} por jogada
                    </Badge>
                    <p className="text-sm text-gray-400 mt-2">{difficulty.description}</p>
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

export default DifficultySelector;
