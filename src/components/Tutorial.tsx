
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Brain, Gamepad2, Award, Github, Mouse, Keyboard } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial = ({ onClose }: TutorialProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            📖 Tutorial - Velha Suprema
          </CardTitle>
          <p className="text-gray-300">Domine a arte da velocidade e estratégia!</p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Objetivo */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-2xl font-semibold text-yellow-400">
                <Zap className="w-8 h-8" />
                <span>Objetivo: Treinar seu APM</span>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>
                  <strong className="text-white">APM</strong> significa "Ações Por Minuto". É uma medida de quão rápido um jogador pode realizar ações em um jogo.
                </p>
                <p>
                  Em jogos competitivos, um APM alto permite reações mais rápidas, melhor microgerenciamento e uma vantagem decisiva sobre os oponentes. <strong className="text-white">Velha Suprema</strong> foi projetado para levar seu APM ao limite.
                </p>
              </div>
            </div>

            {/* Regras */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-2xl font-semibold text-purple-400">
                <Brain className="w-8 h-8" />
                <span>Como Jogar</span>
              </div>
              <div className="space-y-3 text-gray-300">
                 <p>O jogo é <strong className="text-white">infinito</strong>. Quando o tabuleiro encher, as peças mais antigas de cada jogador são removidas (alternando entre 3 e 4 peças).</p>
                 <p>O tempo é seu inimigo. Se o cronômetro zerar, você perde a vez.</p>
                 <p>Apenas <strong className="text-white">ESPAÇO</strong> confirma jogadas - mouse e setas apenas selecionam!</p>
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-700 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xl font-semibold text-blue-400">
                <Keyboard className="w-6 h-6" />
                <span>Controles do Teclado</span>
              </div>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong className="text-white">Setas:</strong> Navegam entre os quadrados</p>
                <p><strong className="text-white">ESPAÇO:</strong> Confirma a jogada na posição selecionada</p>
                <p className="text-yellow-400">⚠️ Apenas ESPAÇO faz jogadas!</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xl font-semibold text-cyan-400">
                <Mouse className="w-6 h-6" />
                <span>Controles do Mouse</span>
              </div>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong className="text-white">Hover:</strong> Seleciona automaticamente o quadrado</p>
                <p><strong className="text-white">Click:</strong> Apenas seleciona (não joga!)</p>
                <p>Use <strong className="text-white">ESPAÇO</strong> para confirmar após selecionar</p>
              </div>
            </div>
          </div>
          
          {/* Créditos */}
          <div className="border-t border-gray-700 pt-6 space-y-4">
             <div className="flex items-center gap-3 text-2xl font-semibold text-cyan-400">
                <Award className="w-8 h-8" />
                <span>Créditos</span>
              </div>
              <div className="text-gray-300 space-y-2">
                <p><strong className="text-white">Criador:</strong> Mateus Morais</p>
                <a href="https://github.com/mateusmoraiss" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                  <span>github.com/mateusmoraiss</span>
                </a>
                <p><strong className="text-white">Tecnologias:</strong> React, TypeScript, Vite, Tailwind CSS, shadcn/ui.</p>
              </div>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Entendi! Vamos Jogar <Gamepad2 className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;
