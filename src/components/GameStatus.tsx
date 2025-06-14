
import React from 'react';

interface GameStatusProps {
  winner: string | null;
  currentPlayer: string;
  playerName: string;
  isGameActive: boolean;
}

const GameStatus = ({ winner, currentPlayer, playerName, isGameActive }: GameStatusProps) => {
  if (winner) {
    return (
      <div className="text-2xl font-bold text-yellow-400">
        🎉 {winner === 'X' ? playerName : 'Computador'} Venceu! 🎉
      </div>
    );
  }

  if (!isGameActive) {
    return null;
  }

  // Só mostra "Vez de:" quando é a vez do jogador humano
  if (currentPlayer === 'X') {
    return (
      <div className="text-xl font-semibold text-gray-200">
        Vez de: <span className="text-blue-400">{playerName}</span>
      </div>
    );
  }

  // Não mostra nada quando é a vez do computador (ele joga instantaneamente)
  return null;
};

export default GameStatus;
