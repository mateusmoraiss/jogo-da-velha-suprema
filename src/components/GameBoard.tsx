
import React from 'react';

interface GameBoardProps {
  board: (string | null)[];
  selectedPosition: number;
  onCellClick: (index: number) => void;
  onCellHover: (index: number) => void;
}

const GameBoard = ({ board, selectedPosition, onCellClick, onCellHover }: GameBoardProps) => {
  const getCellClass = (index: number) => {
    const baseClass = "w-20 h-20 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-600 rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 hover:bg-gray-700/50 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20";
    const isSelected = index === selectedPosition;
    const selectedClass = isSelected ? "ring-2 ring-yellow-400 ring-opacity-75 bg-yellow-500/10" : "";
    
    if (board[index] === 'X') return `${baseClass} ${selectedClass} text-blue-400 bg-blue-500/20 border-blue-500/40 shadow-lg shadow-blue-500/20`;
    if (board[index] === 'O') return `${baseClass} ${selectedClass} text-cyan-400 bg-cyan-500/20 border-cyan-500/40 shadow-lg shadow-cyan-500/20`;
    
    return `${baseClass} ${selectedClass} hover:border-gray-500`;
  };

  return (
    <div className="grid grid-cols-3 gap-3 mx-auto w-fit">
      {board.map((cell, index) => (
        <div
          key={index}
          className={getCellClass(index)}
          onClick={() => onCellClick(index)}
          onMouseEnter={() => onCellHover(index)}
        >
          {cell && (
            <span className="animate-scale-in">
              {cell}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
