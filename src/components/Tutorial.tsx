import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Brain, Gamepad2, Award, Github, Mouse, Keyboard, RotateCw, Trophy, ShieldCheck, TrendingUp } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial = ({ onClose }: TutorialProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <span>📖</span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Tutorial - Velha Suprema</span>
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
                 <p>O jogo é <strong className="text-white">infinito</strong>. Quando o tabuleiro encher, as peças mais antigas de cada jogador são removidas automaticamente.</p>
                 <p>O tempo é seu inimigo. Se o cronômetro zerar, você perde a vez automaticamente.</p>
                 <p>Apenas <strong className="text-white">SHIFT</strong> confirma jogadas - mouse e teclas apenas selecionam!</p>
              </div>
            </div>
          </div>

          {/* Recomendações de Treinamento */}
          <div className="border-t border-gray-700 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-2xl font-semibold text-cyan-400">
                <Gamepad2 className="w-8 h-8" />
                <span>Estilos de Treinamento</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-600/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-blue-400">
                    <Keyboard className="w-6 h-6" />
                    <span>Treinamento WASD</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Recomendado para APM!</strong> Use WASD para navegar pelo tabuleiro. Este método treina:
                  </p>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• <strong className="text-white">APM (Ações Por Minuto)</strong> - Velocidade de execução</li>
                    <li>• <strong className="text-white">Velocidade de Raciocínio</strong> - Decisões rápidas</li>
                    <li>• <strong className="text-white">Coordenação Mão-Cérebro</strong> - Automatização</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-600/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-cyan-400">
                    <Mouse className="w-6 h-6" />
                    <span>Treinamento Mouse</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Ótimo para reflexos!</strong> Use o mouse para selecionar posições. Este método treina:
                  </p>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• <strong className="text-white">Reflexos</strong> - Reações instantâneas</li>
                    <li>• <strong className="text-white">Precisão</strong> - Mira e controle</li>
                    <li>• <strong className="text-white">Velocidade</strong> - Movimentos rápidos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sistema de Balanceamento */}
          <div className="border-t border-gray-700 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-2xl font-semibold text-green-400">
                <RotateCw className="w-8 h-8" />
                <span>Sistema de Balanceamento Inteligente</span>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>
                  O jogo usa um sistema de balanceamento dinâmico para manter a competição equilibrada:
                </p>
                <div className="bg-gray-800/50 p-4 rounded-lg space-y-2">
                  <p><strong className="text-white">🔄 Ciclo Alternado:</strong> O jogo alterna entre remover <strong className="text-yellow-400">3 peças</strong> e <strong className="text-cyan-400">4 peças</strong> de cada jogador quando o tabuleiro fica cheio.</p>
                  <p><strong className="text-white">⚖️ Equilíbrio Estratégico:</strong> Isso garante que nenhum jogador tenha vantagem permanente, criando oportunidades para ambos os lados.</p>
                  <p><strong className="text-white">🎯 Estratégia Adaptativa:</strong> Você precisa ajustar sua estratégia conforme o ciclo muda, mantendo o jogo sempre desafiador!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mecânicas de Desafio */}
          <div className="border-t border-gray-700 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-2xl font-semibold text-orange-400">
                <Trophy className="w-8 h-8" />
                <span>Mecânicas de Desafio</span>
              </div>
              <p className="text-gray-300">
                O jogo registra seus melhores desempenhos na dificuldade atual para você sempre ter um novo recorde para quebrar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-lg space-y-2">
                   <div className="flex items-center gap-2 text-lg font-semibold text-red-400">
                     <ShieldCheck className="w-6 h-6" />
                     <span>Top Sobrevivência</span>
                   </div>
                   <p className="text-gray-300 text-sm">
                     Aparece quando você <strong className="text-white">perde</strong>. Marca o <strong className="text-white">maior número de jogadas que você sobreviveu</strong>. Desafie-se a durar mais contra a IA!
                   </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg space-y-2">
                   <div className="flex items-center gap-2 text-lg font-semibold text-teal-400">
                     <TrendingUp className="w-6 h-6" />
                     <span>Top APM</span>
                   </div>
                   <p className="text-gray-300 text-sm">
                     Aparece quando você <strong className="text-white">ganha</strong>. Registra seu <strong className="text-white">maior APM (Ações Por Minuto)</strong>. Desafie-se a vencer cada vez mais rápido!
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-700 pt-6">
            <div className="space-y-4 flex flex-col">
              <div className="flex items-center gap-3 text-xl font-semibold text-blue-400">
                <Keyboard className="w-6 h-6" />
                <span>Controles do Teclado</span>
              </div>
              <div className="text-gray-300 text-sm flex-grow flex flex-col">
                <div className="flex-grow space-y-2">
                  <p><strong className="text-white">WASD:</strong> Navegam entre os quadrados (W=cima, A=esquerda, S=baixo, D=direita)</p>
                  <p><strong className="text-white">SHIFT (padrão):</strong> Confirma a jogada na posição selecionada</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-600/50 p-2 rounded mt-2">
                  <p className="text-yellow-400">⚠️ A tecla de confirmação pode ser alterada nas Opções!</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col">
              <div className="flex items-center gap-3 text-xl font-semibold text-cyan-400">
                <Mouse className="w-6 h-6" />
                <span>Controles do Mouse</span>
              </div>
              <div className="text-gray-300 text-sm flex-grow flex flex-col">
                <div className="flex-grow space-y-2">
                  <p><strong className="text-white">Hover (passar por cima):</strong> Seleciona automaticamente o quadrado</p>
                  <p>Use a <strong className="text-white">tecla de confirmação</strong> (SHIFT por padrão) após selecionar</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-600/50 p-2 rounded mt-2">
                  <p className="text-blue-400">💡 Dica: Combine mouse para seleção rápida + tecla de confirmação!</p>
                </div>
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
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600/50 p-3 rounded-lg space-y-2">
                  <p><strong className="text-purple-400">🚀 Projeto desenvolvido com Lovable</strong></p>
                  <p className="text-sm">Criado durante a semana grátis de disputa entre Anthropic, OpenAI e Google (14/06/2025). IA foi usada para toda a implementação visual e de código, exceto a <strong className="text-white">lógica do jogo e sistema de balanceamento</strong>, que foram desenvolvidos 100% por mim.</p>
                </div>
                <p><strong className="text-white">Tecnologias:</strong> React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Web Audio API.</p>
                <p><strong className="text-white">Recursos:</strong> Efeitos sonoros procedurais, controles híbridos, sistema de balanceamento dinâmico.</p>
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
