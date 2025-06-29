
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Settings } from 'lucide-react';
import { playClickSound } from '@/utils/soundUtils';

interface PlayerNameDialogProps {
  onStart: () => void;
  onTutorial: () => void;
  onCredits: () => void;
  onOptions: () => void;
}

const PlayerNameDialog = ({ onStart, onTutorial, onCredits, onOptions }: PlayerNameDialogProps) => {

  const handleClick = (callback: () => void) => {
    playClickSound();
    callback();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">👵</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="-11.5 -10.23174 23 20.46348" 
                className="w-8 h-8 text-cyan-400 animate-spin"
                style={{ animationDuration: '20s' }}
              >
                <title>React Logo</title>
                <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
                <g stroke="currentColor" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                </g>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold flex items-center justify-center">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Velha Suprema
              </span>
            </CardTitle>
            <p className="text-sm text-gray-400 font-medium">
              Criado por <span className="text-gray-300">Mateus Morais</span>
            </p>
          </div>
          <p className="text-gray-300">Prepare-se para o desafio!</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={() => handleClick(onStart)}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Começar Jogo
          </Button>
          
          <Button 
            onClick={() => handleClick(onOptions)}
            variant="outline"
            className="w-full bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700/50 py-2"
          >
            <Settings className="w-4 h-4 mr-2" />
            Opções
          </Button>
          
          <Button 
            onClick={() => handleClick(onTutorial)}
            variant="outline"
            className="w-full bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700/50 py-2"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Tutorial
          </Button>

          <Button 
            onClick={() => handleClick(onCredits)}
            variant="outline"
            className="w-full bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700/50 py-2"
          >
            <Award className="w-4 h-4 mr-2" />
            Créditos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerNameDialog;
