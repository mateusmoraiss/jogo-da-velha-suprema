
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Keyboard, Target, Timer, Trophy } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial = ({ onClose }: TutorialProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            📖 Tutorial - Jogo da Velha Infinito
          </CardTitle>
          <p className="text-gray-300">Aprenda a jogar com controles de teclado!</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controles */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-blue-400">
                <Keyboard className="w-6 h-6" />
                Controles do Teclado
              </div>
              
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <ArrowUp className="w-5 h-5 text-green-400" />
                    <ArrowLeft className="w-5 h-5 text-green-400" />
                  </div>
                  <span>Canto superior esquerdo</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <ArrowUp className="w-5 h-5 text-green-400" />
                  <span>Meio superior</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <ArrowUp className="w-5 h-5 text-green-400" />
                    <ArrowRight className="w-5 h-5 text-green-400" />
                  </div>
                  <span>Canto superior direito</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <ArrowLeft className="w-5 h-5 text-green-400" />
                  <span>Meio esquerdo</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <ArrowUp className="w-5 h-5 text-green-400" />
                    <ArrowDown className="w-5 h-5 text-green-400" />
                  </div>
                  <span>Centro</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-green-400" />
                  <span>Meio direito</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <ArrowDown className="w-5 h-5 text-green-400" />
                    <ArrowLeft className="w-5 h-5 text-green-400" />
                  </div>
                  <span>Canto inferior esquerdo</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <ArrowDown className="w-5 h-5 text-green-400" />
                  <span>Meio inferior</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <ArrowDown className="w-5 h-5 text-green-400" />
                    <ArrowRight className="w-5 h-5 text-green-400" />
                  </div>
                  <span>Canto inferior direito</span>
                </div>
                
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 font-semibold">ESPAÇO</span> - Confirmar jogada
                </div>
              </div>
            </div>

            {/* Regras */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-purple-400">
                <Target className="w-6 h-6" />
                Regras do Jogo
              </div>
              
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-start gap-2">
                  <Timer className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <span>Você tem tempo limitado para fazer cada jogada (varia por dificuldade)</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Faça 3 em linha (horizontal, vertical ou diagonal) para vencer</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">♾️</span>
                  <span>O jogo é infinito: após 6 peças no tabuleiro, a mais antiga é removida</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">⚠️</span>
                  <span>Se o tempo acabar, você perde a vez e o computador joga</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">🎯</span>
                  <span>Use as setas do teclado para navegar e ESPAÇO para confirmar</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
                <h4 className="text-purple-400 font-semibold mb-2">Dica Pro:</h4>
                <p className="text-gray-300 text-sm">
                  No modo Armagedon (0.6s), você precisa ser extremamente rápido! 
                  Treine nos níveis mais fáceis primeiro para se acostumar com os controles.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-4">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Entendi! Vamos Jogar 🎮
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;
