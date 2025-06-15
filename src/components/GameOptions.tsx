
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Keyboard, ArrowLeft } from 'lucide-react';
import { ConfirmKey, CONFIRM_KEY_OPTIONS } from '@/types/gameTypes';

interface GameOptionsProps {
  confirmKey: ConfirmKey;
  onConfirmKeyChange: (key: ConfirmKey) => void;
  onBack: () => void;
  onSave: () => void;
}

const GameOptions = ({ confirmKey, onConfirmKeyChange, onBack, onSave }: GameOptionsProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Settings className="w-12 h-12 text-blue-400 mb-2" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Opções do Jogo
          </CardTitle>
          <p className="text-gray-300">Configure os controles do jogo</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Tecla para confirmar jogada:
            </label>
            <Select value={confirmKey} onValueChange={(value: ConfirmKey) => onConfirmKeyChange(value)}>
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
          
          <div className="flex gap-2">
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex-1 bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <Button 
              onClick={onSave}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOptions;
