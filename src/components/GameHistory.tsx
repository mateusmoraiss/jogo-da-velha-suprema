
import React from 'react';

interface GameHistoryProps {
  moveHistory: string[];
}

const GameHistory = ({ moveHistory }: GameHistoryProps) => {
  return (
    <div className="text-center h-32 flex flex-col justify-start">
      <div className="text-sm text-gray-400 mb-2">Histórico de Jogadas:</div>
      <div className="text-sm text-gray-300 h-24 overflow-y-auto flex-1">
        {moveHistory.length > 0 ? (
          <div className="space-y-1">
            {moveHistory.slice(-5).reverse().map((move, index) => (
              <div key={index} className="py-0.5">
                {move}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic pt-8">
            Nenhuma jogada ainda
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHistory;
