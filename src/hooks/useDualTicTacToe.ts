
import { useState, useEffect, useCallback } from 'react';
import { GameState, DifficultyLevel, Player, Board } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { checkWinner, removeOldestMoves } from '@/utils/gameLogic';
import { getComputerMove } from '@/utils/aiLogic';

const createInitialState = (difficulty: DifficultyLevel): GameState => ({
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
  const [game1, setGame1] = useState<GameState>(() => createInitialState(difficulty));
  const [game2, setGame2] = useState<GameState>(() => createInitialState(difficulty));
  const [sharedSelectedPosition, setSharedSelectedPosition] = useState(4);
  const [activeBoard, setActiveBoard] = useState<1 | 2>(1); // Which board the player should play on

  const makeMove = useCallback((boardIndex: 1 | 2, cellIndex: number) => {
    // Player can only move on the active board and when it's their turn
    if (boardIndex !== activeBoard) return;
    
    const game = boardIndex === 1 ? game1 : game2;
    const setGame = boardIndex === 1 ? setGame1 : setGame2;

    if (!game.isGameActive || game.board[cellIndex] || game.winner || game.currentPlayer !== 'X') {
      return;
    }

    setGame(prevState => {
      let newBoard = [...prevState.board];
      let newMoveCount = prevState.moveCount + 1;
      
      const filledCells = newBoard.filter(cell => cell !== null).length;
      if (filledCells >= 6) {
        newBoard = removeOldestMoves(newBoard, 'X');
      }

      newBoard[cellIndex] = 'X';
      
      const winner = checkWinner(newBoard);
      const newHistory = [...prevState.moveHistory, `${playerName} jogou na posição ${cellIndex + 1}`];

      let newPlayerScore = prevState.playerScore;
      if (winner === 'X') newPlayerScore++;

      return {
        ...prevState,
        board: newBoard,
        winner,
        isGameActive: !winner,
        playerScore: newPlayerScore,
        moveHistory: newHistory,
        moveCount: newMoveCount,
        currentPlayer: 'O', // Pass turn to computer
        timeLeft: difficultySettings[prevState.difficulty].time,
      };
    });
    
    // Switch to the other board for the next player move
    setActiveBoard(boardIndex === 1 ? 2 : 1);

  }, [playerName, game1, game2, activeBoard]);

  // Computer move effect for Game 1
  useEffect(() => {
    if (game1.currentPlayer === 'O' && game1.isGameActive && !game1.winner) {
      const timer = setTimeout(() => {
        const computerMoveIndex = getComputerMove(game1.board, game1.difficulty);
        if (computerMoveIndex !== undefined) {
          setGame1(prevState => {
            let newBoard = [...prevState.board];
            const filledCells = newBoard.filter(cell => cell !== null).length;
            if (filledCells >= 6) {
              newBoard = removeOldestMoves(newBoard, 'O');
            }
            newBoard[computerMoveIndex] = 'O';
            const winner = checkWinner(newBoard);
            let newComputerScore = prevState.computerScore;
            if (winner === 'O') newComputerScore++;
            
            return {
              ...prevState,
              board: newBoard,
              winner,
              isGameActive: !winner,
              computerScore: newComputerScore,
              moveHistory: [...prevState.moveHistory, `Computador jogou na posição ${computerMoveIndex + 1}`],
              currentPlayer: 'X', // Switch back to player
            };
          });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [game1.currentPlayer, game1.isGameActive, game1.winner, game1.board, game1.difficulty]);

  // Computer move effect for Game 2
  useEffect(() => {
    if (game2.currentPlayer === 'O' && game2.isGameActive && !game2.winner) {
      const timer = setTimeout(() => {
        const computerMoveIndex = getComputerMove(game2.board, game2.difficulty);
        if (computerMoveIndex !== undefined) {
          setGame2(prevState => {
            let newBoard = [...prevState.board];
            const filledCells = newBoard.filter(cell => cell !== null).length;
            if (filledCells >= 6) {
              newBoard = removeOldestMoves(newBoard, 'O');
            }
            newBoard[computerMoveIndex] = 'O';
            const winner = checkWinner(newBoard);
            let newComputerScore = prevState.computerScore;
            if (winner === 'O') newComputerScore++;
            
            return {
              ...prevState,
              board: newBoard,
              winner,
              isGameActive: !winner,
              computerScore: newComputerScore,
              moveHistory: [...prevState.moveHistory, `Computador jogou na posição ${computerMoveIndex + 1}`],
              currentPlayer: 'X', // Switch back to player
            };
          });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [game2.currentPlayer, game2.isGameActive, game2.winner, game2.board, game2.difficulty]);

  // Timer effect for player's turn
  useEffect(() => {
    const activeGame = activeBoard === 1 ? game1 : game2;
    const setActiveGame = activeBoard === 1 ? setGame1 : setGame2;

    if (activeGame.currentPlayer === 'X' && activeGame.isGameActive && !activeGame.winner && activeGame.timeLeft > 0) {
      const timer = setTimeout(() => {
        setActiveGame(prev => ({ ...prev, timeLeft: prev.timeLeft - 0.1 }));
      }, 100);
      return () => clearTimeout(timer);
    } else if (activeGame.currentPlayer === 'X' && activeGame.timeLeft <= 0) {
      // Time ran out, pass turn to computer
      setActiveGame(prev => ({ 
        ...prev, 
        currentPlayer: 'O',
        timeLeft: difficultySettings[prev.difficulty].time
      }));
    }
  }, [game1, game2, activeBoard]);

  const resetGame = useCallback(() => {
    setGame1(createInitialState(difficulty));
    setGame2(createInitialState(difficulty));
    setActiveBoard(1);
  }, [difficulty]);

  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setGame1(createInitialState(newDifficulty));
    setGame2(createInitialState(newDifficulty));
    setActiveBoard(1);
  }, []);

  return {
    game1,
    game2,
    activeBoard,
    sharedSelectedPosition,
    updateSelectedPosition: setSharedSelectedPosition,
    makeMove,
    resetGame,
    changeDifficulty,
  };
};
