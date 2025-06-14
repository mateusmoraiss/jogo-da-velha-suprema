
import { useState, useEffect } from 'react';
import { PlayerProgress, GameStorage } from '@/types/playerTypes';
import { DifficultyLevel } from '@/types/gameTypes';

const STORAGE_KEY = 'velha-suprema-players';

export const usePlayerStorage = () => {
  const [gameStorage, setGameStorage] = useState<GameStorage>({
    players: [],
    currentPlayer: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setGameStorage(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  const saveToStorage = (data: GameStorage) => {
    setGameStorage(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const getOrCreatePlayer = (playerName: string): PlayerProgress => {
    const existingPlayer = gameStorage.players.find(p => p.name === playerName);
    if (existingPlayer) {
      return existingPlayer;
    }

    const newPlayer: PlayerProgress = {
      name: playerName,
      levelProgress: {}
    };

    const updatedStorage = {
      ...gameStorage,
      players: [...gameStorage.players, newPlayer],
      currentPlayer: playerName
    };
    
    saveToStorage(updatedStorage);
    return newPlayer;
  };

  const updatePlayerProgress = (playerName: string, level: DifficultyLevel, won: boolean) => {
    const player = getOrCreatePlayer(playerName);
    
    if (!player.levelProgress[level]) {
      player.levelProgress[level] = {
        consecutiveWins: 0,
        totalLosses: 0,
        isCleared: false
      };
    }

    const progress = player.levelProgress[level];

    if (won) {
      progress.consecutiveWins++;
      // Verifica se zerou o nível (7 vitórias seguidas)
      if (progress.consecutiveWins >= 7 && !progress.isCleared) {
        progress.isCleared = true;
      }
    } else {
      progress.totalLosses++;
      // Se perdeu 2 vezes, reseta o progresso
      if (progress.totalLosses >= 2) {
        progress.consecutiveWins = 0;
        progress.totalLosses = 0;
        progress.isCleared = false;
      }
    }

    const updatedPlayers = gameStorage.players.map(p => 
      p.name === playerName ? player : p
    );

    saveToStorage({
      ...gameStorage,
      players: updatedPlayers,
      currentPlayer: playerName
    });
  };

  const deletePlayer = (playerName: string) => {
    const updatedPlayers = gameStorage.players.filter(p => p.name !== playerName);
    saveToStorage({
      ...gameStorage,
      players: updatedPlayers
    });
  };

  const getPlayerProgress = (playerName: string, level: DifficultyLevel) => {
    const player = gameStorage.players.find(p => p.name === playerName);
    return player?.levelProgress[level] || {
      consecutiveWins: 0,
      totalLosses: 0,
      isCleared: false
    };
  };

  return {
    gameStorage,
    getOrCreatePlayer,
    updatePlayerProgress,
    deletePlayer,
    getPlayerProgress
  };
};
