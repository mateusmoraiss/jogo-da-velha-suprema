
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Gamepad2, BookOpen, Award, Keyboard } from 'lucide-react';
import { ConfirmKey, CONFIRM_KEY_OPTIONS } from '@/types/gameTypes';

interface PlayerNameDialogProps {
  onSubmit: (name: string, confirmKey: ConfirmKey) => void;
  onTutorial: () => void;
  onCredits: () => void;
}

const PlayerNameDialog = ({ onSubmit, onTutorial, onCredits }: PlayerNameDialogProps) => {
  const [name, setName] = useState('');
  const [confirmKey, setConfirmKey] = useState<ConfirmKey>('space');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), confirmKey);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Gamepad2 className="w-12 h-12 text-blue-400 mb-2" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Velha Suprema
            </CardTitle>
            <p className="text-sm text-gray-400 font-medium">
              Criado por <span className="text-gray-300">Mateus Morais</span>
            </p>
          </div>
          <p className="text-gray-300">Digite seu nome e configure os controles!</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Seu nome..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Tecla para confirmar jogada:
              </label>
              <Select value={confirmKey} onValueChange={(value: ConfirmKey) => setConfirmKey(value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {CONFIRM_KEY_OPTIONS.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit" 
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Começar Jogo
            </Button>
          </form>
          
          <Button 
            onClick={onTutorial}
            variant="outline"
            className="w-full bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700/50 py-2"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Ver Tutorial dos Controles
          </Button>

          <Button 
            onClick={onCredits}
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
