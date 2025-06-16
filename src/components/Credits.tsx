
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Github, User } from 'lucide-react';

interface CreditsProps {
  onClose: () => void;
}

const Credits = ({ onClose }: CreditsProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <span>🏆</span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Créditos - Velha Suprema</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Desenvolvedor */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-2xl font-semibold text-cyan-400">
              <User className="w-8 h-8" />
              <span>Desenvolvedor</span>
            </div>
            <div className="text-gray-300 space-y-2">
              <p><strong className="text-white">Criador:</strong> Mateus Morais</p>
              <a href="https://github.com/mateusmoraiss" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
                <span>github.com/mateusmoraiss</span>
              </a>
              <a href="https://github.com/mateusmoraiss/jogo-da-velha-suprema" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
                <span>Repositório: github.com/mateusmoraiss/jogo-da-velha-suprema</span>
              </a>
            </div>
          </div>

          {/* Sobre o Projeto */}
          <div className="border-t border-gray-700 pt-6 space-y-4">
            <div className="flex items-center gap-3 text-2xl font-semibold text-purple-400">
              <Award className="w-8 h-8" />
              <span>Sobre o Projeto</span>
            </div>
            <div className="text-gray-300 space-y-3">
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600/50 p-4 rounded-lg space-y-2">
                <p><strong className="text-purple-400">🚀 Projeto desenvolvido com Lovable</strong></p>
                <p className="text-sm">Criado durante a semana grátis de disputa entre Anthropic, OpenAI e Google (14/06/2025). IA foi usada para toda a implementação visual e de código, exceto a <strong className="text-white">lógica do jogo e sistema de balanceamento</strong>, que foram desenvolvidos 100% por mim.</p>
              </div>
              <p><strong className="text-white">Tecnologias:</strong> React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Web Audio API.</p>
              <p><strong className="text-white">Recursos:</strong> Efeitos sonoros procedurais, controles híbridos, sistema de balanceamento dinâmico.</p>
            </div>
          </div>

          {/* Objetivo do Jogo */}
          <div className="border-t border-gray-700 pt-6 space-y-4">
            <div className="text-xl font-semibold text-yellow-400">
              🎯 Missão do Velha Suprema
            </div>
            <div className="text-gray-300 space-y-2">
              <p>Treinar seu <strong className="text-white">APM (Ações Por Minuto)</strong> através de um jogo de velha infinito com tempo limitado.</p>
              <p>Desenvolvido para jogadores que querem melhorar sua velocidade e precisão em jogos competitivos.</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Credits;
