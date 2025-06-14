
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
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Gamepad2 className="w-12 h-12 text-purple-400 mb-2" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Jogo da Velha Infinito
          </CardTitle>
          <p className="text-white/70">Digite seu nome para começar!</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                type="text"
                placeholder="Seu nome..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                autoFocus
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
