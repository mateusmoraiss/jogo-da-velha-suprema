
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Gamepad2 } from 'lucide-react';

interface PlayerNameDialogProps {
  onSubmit: (name: string) => void;
}

const PlayerNameDialog = ({ onSubmit }: PlayerNameDialogProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Gamepad2 className="w-12 h-12 text-blue-400 mb-2" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Jogo da Velha Infinito
          </CardTitle>
          <p className="text-gray-300">Digite seu nome para começar!</p>
        </CardHeader>
        
        <CardContent>
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
            
            <Button 
              type="submit" 
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Começar Jogo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerNameDialog;
