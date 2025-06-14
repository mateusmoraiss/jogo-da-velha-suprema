
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, Skull, Flame, Target, Shield, Sword, Trophy, Trash2 } from 'lucide-react';
import { usePlayerStorage } from '@/hooks/usePlayerStorage';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'nightmare' | 'insane' | 'godlike' | 'armageddon';

interface DifficultySelectorProps {
  onSelect: (difficulty: DifficultyLevel) => void;
  onBack: () => void;
  onTutorial: () => void;
  currentPlayer: string;
}

const difficulties = [
  {
    id: 'easy' as DifficultyLevel,
    name: 'Fácil',
    icon: Shield,
    time: 10,
    description: 'IA básica, muito tempo',
    color: 'from-green-600 to-green-400',
    bgColor: 'bg-green-500/10 border-green-500/30'
  },
  {
    id: 'medium' as DifficultyLevel,
    name: 'Médio',
    icon: Target,
    time: 7,
    description: 'IA moderada, tempo razoável',
    color: 'from-blue-600 to-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30'
  },
  {
    id: 'hard' as DifficultyLevel,
    name: 'Difícil',
    icon: Brain,
    time: 5,
    description: 'IA inteligente, tempo limitado',
    color: 'from-purple-600 to-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30'
  },
  {
    id: 'nightmare' as DifficultyLevel,
    name: 'Pesadelo',
    icon: Skull,
    time: 3.5,
    description: 'IA muito esperta, pressão extrema',
    color: 'from-red-600 to-red-400',
    bgColor: 'bg-red-500/10 border-red-500/30'
  },
  {
    id: 'insane' as DifficultyLevel,
    name: 'Insano',
    icon: Zap,
    time: 2,
    description: 'IA quase perfeita, reflexos ninjas',
    color: 'from-yellow-600 to-orange-600',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30'
  },
  {
    id: 'godlike' as DifficultyLevel,
    name: 'Divino',
    icon: Sword,
    time: 1.2,
    description: 'Para os deuses do jogo',
    color: 'from-violet-600 to-pink-600',
    bgColor: 'bg-violet-500/10 border-violet-500/30'
  },
  {
    id: 'armageddon' as DifficultyLevel,
    name: 'Armagedon',
    icon: Flame,
    time: 0.6,
    description: '💀 IMPOSSÍVEL - 0.6s de terror puro',
    color: 'from-red-700 via-orange-600 to-yellow-500',
    bgColor: 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-600/50 shadow-lg shadow-red-500/20'
  }
];

const DifficultySelector = ({ onSelect, onBack, onTutorial, currentPlayer }: DifficultySelectorProps) => {
  const { gameStorage, getPlayerProgress, deletePlayer } = usePlayerStorage();

  const handleDeletePlayer = (playerName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja deletar o jogador "${playerName}"?`)) {
      deletePlayer(playerName);
    }
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

          {/* Lista de jogadores salvos */}
          {gameStorage.players.length > 0 && (
            <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Jogadores Salvos:</h3>
              <div className="space-y-2">
                {gameStorage.players.map((player) => (
                  <div key={player.name} className="flex items-center justify-between bg-gray-700/30 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${player.name === currentPlayer ? 'text-blue-400' : 'text-gray-300'}`}>
                        {player.name} {player.name === currentPlayer && '(atual)'}
                      </span>
                      <div className="flex gap-1">
                        {difficulties.map((diff) => {
                          const progress = player.levelProgress[diff.id];
                          if (progress?.isCleared) {
                            return (
                              <Trophy key={diff.id} className="w-4 h-4 text-yellow-400" title={`${diff.name} - Zerado!`} />
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                    <Button
                      onClick={(e) => handleDeletePlayer(player.name, e)}
                      variant="outline"
                      size="sm"
                      className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => {
              const IconComponent = difficulty.icon;
              const progress = getPlayerProgress(currentPlayer, difficulty.id);
              
              return (
                <Button
                  key={difficulty.id}
                  onClick={() => onSelect(difficulty.id)}
                  className={`h-auto p-6 flex flex-col items-center space-y-3 ${difficulty.bgColor} hover:scale-105 transition-all duration-300 border-2 hover:border-opacity-60 group relative`}
                  variant="outline"
                >
                  {progress.isCleared && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                      <Trophy className="w-4 h-4 text-yellow-900" />
                    </div>
                  )}
                  
                  <IconComponent className="w-8 h-8 text-gray-300 group-hover:text-white transition-colors" />
                  <div className="text-center">
                    <div className={`text-xl font-bold bg-gradient-to-r ${difficulty.color} bg-clip-text text-transparent`}>
                      {difficulty.name}
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs bg-gray-800/50 text-gray-300 border-gray-600">
                      {difficulty.time}s por jogada
                    </Badge>
                    <p className="text-sm text-gray-400 mt-2">{difficulty.description}</p>
                    
                    {/* Progresso do nível */}
                    <div className="mt-3 text-xs">
                      <div className="flex justify-center items-center gap-2">
                        <span className="text-green-400">Vitórias: {progress.consecutiveWins}/7</span>
                        <span className="text-red-400">Derrotas: {progress.totalLosses}/2</span>
                      </div>
                      {progress.isCleared && (
                        <div className="text-yellow-400 font-bold mt-1">✨ ZERADO! ✨</div>
                      )}
                    </div>
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
