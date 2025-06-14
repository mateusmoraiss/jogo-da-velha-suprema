
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, DifficultyLevel } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { checkWinner, removeOldestMoves } from '@/utils/gameLogic';
import { getComputerMove } from '@/utils/aiLogic';

const createInitialGameState = (difficulty: DifficultyLevel): GameState => ({
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
  selectedPosition: 4,
});

export const useDualTicTacToe = (playerName: string, difficulty: DifficultyLevel) => {
  const [games, setGames] = useState<[GameState, GameState]>(() => [
    createInitialGameState(difficulty),
    createInitialGameState(difficulty),
  ]);
  const [activeBoard, setActiveBoard] = useState<1 | 2>(1);
  const [sharedSelectedPosition, setSharedSelectedPosition] = useState(4);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getNextActiveBoard = useCallback((): 1 | 2 | null => {
    // Procura primeiro por um tabuleiro que seja a vez do jogador X e esteja ativo
    for (let i = 0; i < 2; i++) {
      if (games[i].isGameActive && games[i].currentPlayer === 'X') {
        return (i + 1) as 1 | 2;
      }
    }
    // Se não encontrar nenhum para X, procura qualquer ativo
    for (let i = 0; i < 2; i++) {
      if (games[i].isGameActive) {
        return (i + 1) as 1 | 2;
      }
    }
    return null;
  }, [games]);

  const makeMove = useCallback((boardIndex: 1 | 2, cellIndex: number) => {
    setGames(prevGames => {
      const idx = boardIndex - 1;
      const game = prevGames[idx];
      
      if (!game.isGameActive || game.currentPlayer !== 'X' || game.board[cellIndex] || game.winner) {
        return prevGames;
      }

      let newBoard = [...game.board];
      if (newBoard.filter(cell => cell !== null).length >= 6) {
        newBoard = removeOldestMoves(newBoard, 'X');
      }
      newBoard[cellIndex] = 'X';
      
      const winner = checkWinner(newBoard);
      const isGameOver = winner !== null;
      const playerScore = winner === 'X' ? game.playerScore + 1 : game.playerScore;

      const updatedGame: GameState = {
        ...game,
        board: newBoard,
        moveCount: game.moveCount + 1,
        winner,
        isGameActive: !isGameOver,
        playerScore,
        moveHistory: [...game.moveHistory, `${playerName} jogou na posição ${cellIndex + 1}`],
        currentPlayer: isGameOver ? 'X' : 'O',
        timeLeft: difficultySettings[game.difficulty].time,
      };

      const newGames: [GameState, GameState] = [...prevGames] as [GameState, GameState];
      newGames[idx] = updatedGame;
      return newGames;
    });
  }, [playerName]);

  const doComputerMove = useCallback((boardIdx: 0 | 1) => {
    setGames(prevGames => {
      const game = prevGames[boardIdx];
      if (!game.isGameActive || game.currentPlayer !== 'O' || game.winner) {
        return prevGames;
      }

      const moveIndex = getComputerMove(game.board, game.difficulty);
      let newBoard = [...game.board];
      if (newBoard.filter(cell => cell !== null).length >= 6) {
        newBoard = removeOldestMoves(newBoard, 'O');
      }
      newBoard[moveIndex] = 'O';
      
      const winner = checkWinner(newBoard);
      const isGameOver = winner !== null;
      const computerScore = winner === 'O' ? game.computerScore + 1 : game.computerScore;

      const updatedGame: GameState = {
        ...game,
        board: newBoard,
        moveCount: game.moveCount + 1,
        winner,
        isGameActive: !isGameOver,
        computerScore,
        moveHistory: [...game.moveHistory, `Computador jogou na posição ${moveIndex + 1}`],
        currentPlayer: isGameOver ? 'O' : 'X',
        timeLeft: difficultySettings[game.difficulty].time,
      };

      const newGames: [GameState, GameState] = [...prevGames] as [GameState, GameState];
      newGames[boardIdx] = updatedGame;
      return newGames;
    });
  }, []);

  // Effect: Jogadas do computador
  useEffect(() => {
    for (let i = 0; i < 2; i++) {
      if (games[i].isGameActive && games[i].currentPlayer === 'O' && !games[i].winner) {
        const moveTimeout = setTimeout(() => {
          doComputerMove(i as 0 | 1);
        }, 450);
        return () => clearTimeout(moveTimeout);
      }
    }
  }, [games, doComputerMove]);

  // Effect: Timer do jogador
  useEffect(() => {
    const idx = activeBoard - 1;
    const currentGame = games[idx];
    
    if (currentGame.isGameActive && currentGame.currentPlayer === 'X' && !currentGame.winner && currentGame.timeLeft > 0) {
      timerRef.current && clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setGames((prevGames) => {
          const g = prevGames[idx];
          if (!g.isGameActive || g.currentPlayer !== 'X') return prevGames;
          
          const newTimeLeft = Math.max(0, g.timeLeft - 0.1);
          const updatedGame: GameState = {
            ...g,
            timeLeft: newTimeLeft,
            currentPlayer: newTimeLeft <= 0 ? 'O' : 'X'
          };
          
          const newGames: [GameState, GameState] = [...prevGames] as [GameState, GameState];
          newGames[idx] = updatedGame;
          return newGames;
        });
      }, 100);
      
      return () => timerRef.current && clearTimeout(timerRef.current);
    }
  }, [activeBoard, games]);

  // Effect: Gerenciar tabuleiro ativo
  useEffect(() => {
    const currentIdx = activeBoard - 1;
    const currentGame = games[currentIdx];
    
    // Se o tabuleiro atual não pode ser jogado pelo jogador, trocar
    if (!currentGame.isGameActive || currentGame.currentPlayer !== 'X' || currentGame.winner) {
      const nextBoard = getNextActiveBoard();
      if (nextBoard && nextBoard !== activeBoard) {
        setActiveBoard(nextBoard);
      }
    }
  }, [games, activeBoard, getNextActiveBoard]);

  const resetGame = useCallback(() => {
    setGames([
      createInitialGameState(difficulty),
      createInitialGameState(difficulty),
    ]);
    setActiveBoard(1);
    setSharedSelectedPosition(4);
  }, [difficulty]);

  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setGames([
      createInitialGameState(newDifficulty),
      createInitialGameState(newDifficulty),
    ]);
    setActiveBoard(1);
    setSharedSelectedPosition(4);
  }, []);

  return {
    game1: games[0],
    game2: games[1],
    activeBoard,
    sharedSelectedPosition,
    updateSelectedPosition: setSharedSelectedPosition,
    makeMove,
    resetGame,
    changeDifficulty,
  };
};
