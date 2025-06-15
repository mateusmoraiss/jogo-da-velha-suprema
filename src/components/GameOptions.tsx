
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Keyboard, ArrowLeft } from 'lucide-react';
import { ConfirmKey, CONFIRM_KEY_OPTIONS } from '@/types/gameTypes';

interface GameOptionsProps {
  confirmKey: ConfirmKey;
  customKey?: string;
  onConfirmKeyChange: (key: ConfirmKey) => void;
  onCustomKeyChange?: (key: string) => void;
  onBack: () => void;
  onSave: () => void;
}

const GameOptions = ({ 
  confirmKey, 
  customKey = '', 
  onConfirmKeyChange, 
  onCustomKeyChange, 
  onBack, 
  onSave 
}: GameOptionsProps) => {
  const [localCustomKey, setLocalCustomKey] = useState(customKey);

  const handleCustomKeyChange = (value: string) => {
    // Permite apenas um caractere
    const singleChar = value.slice(-1);
    setLocalCustomKey(singleChar);
    if (onCustomKeyChange) {
      onCustomKeyChange(singleChar);
    }
  };

  const handleSave = () => {
    onSave();
  };

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
            <Label className="text-sm text-gray-300 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Tecla para confirmar jogada:
            </Label>
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

          {confirmKey === 'custom' && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">
                Digite o caractere personalizado:
              </Label>
              <Input
                type="text"
                value={localCustomKey}
                onChange={(e) => handleCustomKeyChange(e.target.value)}
                placeholder="Digite um caractere"
                maxLength={1}
                className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400 text-center text-lg"
              />
              {localCustomKey && (
                <p className="text-xs text-gray-400 text-center">
                  Tecla selecionada: <span className="text-blue-400 font-mono">"{localCustomKey}"</span>
                </p>
              )}
            </div>
          )}
          
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
              onClick={handleSave}
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
