
import { useState, useEffect, useCallback } from 'react';
import { GameState, DifficultyLevel, Player } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { checkWinner } from '@/utils/gameLogic';
import { getComputerMove } from '@/utils/aiLogic';

export const useInfiniteTicTacToe = (playerName: string, difficulty: DifficultyLevel = 'medium') => {
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

  const makeMove = useCallback((index: number) => {
    if (!gameState.isGameActive || gameState.board[index] || gameState.winner) {
      return;
    }

    let newBoard = [...gameState.board];
    let currentPieceOrder = [...pieceOrder];
    const currentPlayer = gameState.currentPlayer;

    // Se o jogador já tem 4 peças, remove as 2 mais antigas antes de colocar a nova.
    const playerPiecesInOrder = currentPieceOrder.filter(p => p.player === currentPlayer);
    if (playerPiecesInOrder.length >= 4) {
      const piecesToRemove = playerPiecesInOrder.slice(0, 2);
      piecesToRemove.forEach(p => {
        newBoard[p.position] = null;
      });
      const positionsToRemove = piecesToRemove.map(p => p.position);
      currentPieceOrder = currentPieceOrder.filter(p => !positionsToRemove.includes(p.position));
    }

    // Coloca a nova peça
    newBoard[index] = currentPlayer;
    const nextPieceOrder = [...currentPieceOrder, { position: index, player: currentPlayer }];
    
    // Verifica o vencedor
    const winner = checkWinner(newBoard);
    
    // Atualiza o histórico de jogadas
    const newHistory = [...gameState.moveHistory];
    const playerDisplayName = currentPlayer === 'X' ? playerName : 'Computador';
    const moveDescription = `${playerDisplayName} jogou na posição ${index + 1}`;
    
    if (winner) {
      newHistory.push(`${moveDescription} - VITÓRIA!`);
    } else {
      newHistory.push(moveDescription);
    }

    if (newHistory.length > 10) {
      newHistory.splice(0, newHistory.length - 10);
    }

    // Atualiza o placar
    let newPlayerScore = gameState.playerScore;
    let newComputerScore = gameState.computerScore;
    if (winner === 'X') {
      newPlayerScore++;
    } else if (winner === 'O') {
      newComputerScore++;
    }

    // Atualiza os estados de uma vez
    setPieceOrder(nextPieceOrder);
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
  }, [gameState, pieceOrder, playerName]);

  const updateSelectedPosition = useCallback((newPosition: number) => {
    setGameState(prev => ({
      ...prev,
      selectedPosition: newPosition
    }));
  }, []);

  // Enhanced timer effect with more precise timing
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

  // Time out effect - player loses turn when time runs out
  useEffect(() => {
    if (gameState.currentPlayer === 'X' && gameState.timeLeft <= 0 && gameState.isGameActive && !gameState.winner) {
      const newHistory = [...gameState.moveHistory, `${playerName} perdeu o turno - tempo esgotado!`];
      
      setGameState(prev => ({
        ...prev,
        currentPlayer: 'O',
        timeLeft: difficultySettings[prev.difficulty].time,
        moveHistory: newHistory.slice(-10) // Keep only last 10 moves
      }));
    }
  }, [gameState.timeLeft, gameState.currentPlayer, gameState.isGameActive, gameState.winner, playerName]);

  // Enhanced computer move effect with better timing and move selection
  useEffect(() => {
    if (gameState.currentPlayer === 'O' && gameState.isGameActive && !gameState.winner) {
      // Variable delay based on difficulty - harder difficulties "think" longer
      const thinkingTime = gameState.difficulty === 'easy' ? 500 : 
                          gameState.difficulty === 'medium' ? 750 :
                          gameState.difficulty === 'hard' ? 1000 :
                          gameState.difficulty === 'nightmare' ? 1250 :
                          gameState.difficulty === 'insane' ? 1500 :
                          gameState.difficulty === 'godlike' ? 1750 : 2000;

      const timer = setTimeout(() => {
        const computerMoveIndex = getComputerMove(gameState.board, gameState.difficulty);
        if (computerMoveIndex !== undefined && computerMoveIndex >= 0 && computerMoveIndex < 9) {
          makeMove(computerMoveIndex);
        }
      }, thinkingTime);

      return () => clearTimeout(timer);
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
