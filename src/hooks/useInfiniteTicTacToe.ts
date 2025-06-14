
import { useState, useEffect, useCallback } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface GameState {
  board: Board;
  currentPlayer: 'X' | 'O';
  winner: Player;
  isGameActive: boolean;
  playerScore: number;
  computerScore: number;
  moveHistory: string[];
  moveCount: number;
}

export const useInfiniteTicTacToe = (playerName: string) => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isGameActive: true,
    playerScore: 0,
    computerScore: 0,
    moveHistory: [],
    moveCount: 0
  });

  const checkWinner = useCallback((board: Board): Player => {
    const winningLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of winningLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }, []);

  const getComputerMove = useCallback((board: Board): number => {
    // Check if computer can win
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const testBoard = [...board];
        testBoard[i] = 'O';
        if (checkWinner(testBoard) === 'O') {
          return i;
        }
      }
    }

    // Check if computer needs to block player
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const testBoard = [...board];
        testBoard[i] = 'X';
        if (checkWinner(testBoard) === 'X') {
          return i;
        }
      }
    }

    // Take center if available
    if (!board[4]) {
      return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !board[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available spot
    const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)] as number;
  }, [checkWinner]);

  const removeOldestMove = useCallback((board: Board, player: 'X' | 'O'): Board => {
    const newBoard = [...board];
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === player) {
        newBoard[i] = null;
        break;
      }
    }
    return newBoard;
  }, []);

  const makeMove = useCallback((index: number) => {
    setGameState(prevState => {
      if (!prevState.isGameActive || prevState.board[index] || prevState.winner) {
        return prevState;
      }

      let newBoard = [...prevState.board];
      let newMoveCount = prevState.moveCount + 1;
      
      // Check if board is full and we need to remove oldest move
      const filledCells = newBoard.filter(cell => cell !== null).length;
      if (filledCells >= 6) {
        // Remove oldest move of current player before placing new one
        newBoard = removeOldestMove(newBoard, prevState.currentPlayer);
      }

      newBoard[index] = prevState.currentPlayer;
      
      const winner = checkWinner(newBoard);
      const newHistory = [...prevState.moveHistory];
      const playerDisplayName = prevState.currentPlayer === 'X' ? playerName : 'Computador';
      newHistory.push(`${playerDisplayName} jogou na posição ${index + 1}`);

      let newPlayerScore = prevState.playerScore;
      let newComputerScore = prevState.computerScore;
      
      if (winner === 'X') {
        newPlayerScore++;
      } else if (winner === 'O') {
        newComputerScore++;
      }

      return {
        ...prevState,
        board: newBoard,
        currentPlayer: prevState.currentPlayer === 'X' ? 'O' : 'X',
        winner,
        isGameActive: !winner,
        playerScore: newPlayerScore,
        computerScore: newComputerScore,
        moveHistory: newHistory,
        moveCount: newMoveCount
      };
    });
  }, [checkWinner, removeOldestMove, playerName]);

  // Computer move effect
  useEffect(() => {
    if (gameState.currentPlayer === 'O' && gameState.isGameActive && !gameState.winner) {
      const timer = setTimeout(() => {
        const computerMoveIndex = getComputerMove(gameState.board);
        if (computerMoveIndex !== undefined) {
          makeMove(computerMoveIndex);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.isGameActive, gameState.winner, gameState.board, getComputerMove, makeMove]);

  const resetGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isGameActive: true,
      moveHistory: [],
      moveCount: 0
    }));
  }, []);

  return {
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    winner: gameState.winner,
    isGameActive: gameState.isGameActive,
    playerScore: gameState.playerScore,
    computerScore: gameState.computerScore,
    moveHistory: gameState.moveHistory,
    makeMove,
    resetGame
  };
};
