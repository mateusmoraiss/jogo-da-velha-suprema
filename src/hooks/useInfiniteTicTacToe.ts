import { useState, useEffect, useCallback } from 'react';
import { GameState, DifficultyLevel, Player } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { checkWinner } from '@/utils/gameLogic';
import { getComputerMove } from '@/utils/aiLogic';
import { usePlayerStorage } from '@/hooks/usePlayerStorage';

export const useInfiniteTicTacToe = (playerName: string, difficulty: DifficultyLevel = 'medium') => {
  const { updatePlayerProgress } = usePlayerStorage();
  
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isGameActive: true,
    playerScore: 0,
    computerScore: 0,
    moveHistory: [],
    moveCount: 0,
    timeLeft: difficultySettings[difficulty].time,
    difficulty,
    selectedPosition: 4
  });
  const [pieceOrder, setPieceOrder] = useState<{ position: number; player: Player }[]>([]);
  const [removalCycle, setRemovalCycle] = useState<3 | 4>(3);

  const makeMove = useCallback((index: number) => {
    if (!gameState.isGameActive || gameState.board[index] || gameState.winner) {
      return;
    }

    let newBoard = [...gameState.board];
    let currentPieceOrder = [...pieceOrder];
    const currentPlayer = gameState.currentPlayer;

    newBoard[index] = currentPlayer;
    currentPieceOrder.push({ position: index, player: currentPlayer });

    const isBoardFull = !newBoard.includes(null);

    if (isBoardFull) {
      const playerXPieces = currentPieceOrder.filter(p => p.player === 'X');
      const piecesToRemoveX = playerXPieces.slice(0, removalCycle);
      
      const playerOPieces = currentPieceOrder.filter(p => p.player === 'O');
      const piecesToRemoveO = playerOPieces.slice(0, removalCycle);

      const allPiecesToRemove = [...piecesToRemoveX, ...piecesToRemoveO];
      const positionsToRemove = allPiecesToRemove.map(p => p.position);

      positionsToRemove.forEach(pos => {
        newBoard[pos] = null;
      });
      
      currentPieceOrder = currentPieceOrder.filter(p => !positionsToRemove.includes(p.position));
      setRemovalCycle(prev => prev === 3 ? 4 : 3);
    }
    
    const winner = checkWinner(newBoard);
    
    const newHistory = [...gameState.moveHistory];
    const playerDisplayName = currentPlayer === 'X' ? playerName : 'Computador';
    const moveDescription = `${playerDisplayName} jogou na posição ${index + 1}`;
    
    if (winner) {
      newHistory.push(`${moveDescription} - VITÓRIA!`);
      updatePlayerProgress(playerName, difficulty, winner === 'X');
    } else {
      newHistory.push(moveDescription);
    }

    if (newHistory.length > 10) {
      newHistory.splice(0, newHistory.length - 10);
    }

    let newPlayerScore = gameState.playerScore;
    let newComputerScore = gameState.computerScore;
    if (winner === 'X') {
      newPlayerScore++;
    } else if (winner === 'O') {
      newComputerScore++;
    }

    setPieceOrder(currentPieceOrder);
    setGameState(prevState => ({
      ...prevState,
      board: newBoard,
      currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      winner,
      isGameActive: !winner,
      playerScore: newPlayerScore,
      computerScore: newComputerScore,
      moveHistory: newHistory,
      moveCount: prevState.moveCount + 1,
      timeLeft: difficultySettings[prevState.difficulty].time,
    }));
  }, [gameState, pieceOrder, playerName, removalCycle, difficulty, updatePlayerProgress]);

  const updateSelectedPosition = useCallback((newPosition: number) => {
    setGameState(prev => ({
      ...prev,
      selectedPosition: newPosition
    }));
  }, []);

  useEffect(() => {
    if (gameState.currentPlayer === 'X' && gameState.isGameActive && !gameState.winner && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 0.1)
        }));
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [gameState.timeLeft, gameState.currentPlayer, gameState.isGameActive, gameState.winner]);

  useEffect(() => {
    if (gameState.currentPlayer === 'X' && gameState.timeLeft <= 0 && gameState.isGameActive && !gameState.winner) {
      const newHistory = [...gameState.moveHistory, `${playerName} perdeu o turno - tempo esgotado!`];
      
      setGameState(prev => ({
        ...prev,
        currentPlayer: 'O',
        timeLeft: difficultySettings[prev.difficulty].time,
        moveHistory: newHistory.slice(-10)
      }));
    }
  }, [gameState.timeLeft, gameState.currentPlayer, gameState.isGameActive, gameState.winner, playerName]);

  useEffect(() => {
    if (gameState.currentPlayer === 'O' && gameState.isGameActive && !gameState.winner) {
      const computerMoveIndex = getComputerMove(gameState.board, gameState.difficulty);
      if (computerMoveIndex !== undefined && computerMoveIndex >= 0 && computerMoveIndex < 9) {
        makeMove(computerMoveIndex);
      }
    }
  }, [gameState.currentPlayer, gameState.isGameActive, gameState.winner, gameState.board, gameState.difficulty, makeMove]);

  const resetGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isGameActive: true,
      moveHistory: [],
      moveCount: 0,
      timeLeft: difficultySettings[prevState.difficulty].time,
      selectedPosition: 4
    }));
    setPieceOrder([]);
    setRemovalCycle(3);
  }, []);

  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setGameState(prevState => ({
      ...prevState,
      difficulty: newDifficulty,
      timeLeft: difficultySettings[newDifficulty].time,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isGameActive: true,
      moveHistory: [],
      moveCount: 0,
      selectedPosition: 4
    }));
    setPieceOrder([]);
    setRemovalCycle(3);
  }, []);

  return {
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    winner: gameState.winner,
    isGameActive: gameState.isGameActive,
    playerScore: gameState.playerScore,
    computerScore: gameState.computerScore,
    moveHistory: gameState.moveHistory,
    timeLeft: gameState.timeLeft,
    difficulty: gameState.difficulty,
    selectedPosition: gameState.selectedPosition,
    makeMove,
    resetGame,
    changeDifficulty,
    updateSelectedPosition
  };
};
