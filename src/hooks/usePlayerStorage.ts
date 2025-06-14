
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
        const parsedData = JSON.parse(saved);
        console.log('Dados carregados do localStorage:', parsedData);
        setGameStorage(parsedData);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  const saveToStorage = (data: GameStorage) => {
    console.log('Salvando dados no localStorage:', data);
    setGameStorage(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const getOrCreatePlayer = (playerName: string): PlayerProgress => {
    console.log('Buscando ou criando jogador:', playerName);
    const existingPlayer = gameStorage.players.find(p => p.name === playerName);
    if (existingPlayer) {
      console.log('Jogador encontrado:', existingPlayer);
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
    
    console.log('Criando novo jogador:', newPlayer);
    saveToStorage(updatedStorage);
    return newPlayer;
  };

  const updatePlayerProgress = (playerName: string, level: DifficultyLevel, won: boolean) => {
    console.log(`Atualizando progresso: ${playerName}, ${level}, ganhou: ${won}`);
    
    const updatedPlayers = [...gameStorage.players];
    let playerIndex = updatedPlayers.findIndex(p => p.name === playerName);
    
    if (playerIndex === -1) {
      // Criar jogador se não existir
      const newPlayer: PlayerProgress = {
        name: playerName,
        levelProgress: {}
      };
      updatedPlayers.push(newPlayer);
      playerIndex = updatedPlayers.length - 1;
    }

    const player = updatedPlayers[playerIndex];
    
    if (!player.levelProgress[level]) {
      player.levelProgress[level] = {
        consecutiveWins: 0,
        totalLosses: 0,
        isCleared: false
      };
    }

    const progress = player.levelProgress[level];
    const oldProgress = { ...progress };

    if (won) {
      progress.consecutiveWins++;
      // Verifica se zerou o nível (10 vitórias seguidas)
      if (progress.consecutiveWins >= 10 && !progress.isCleared) {
        progress.isCleared = true;
        console.log(`Jogador ${playerName} zerou o nível ${level}!`);
      }
    } else {
      progress.totalLosses++;
      // Se perdeu 2 vezes, reseta o progresso
      if (progress.totalLosses >= 2) {
        progress.consecutiveWins = 0;
        progress.totalLosses = 0;
        progress.isCleared = false;
        console.log(`Progresso do jogador ${playerName} no nível ${level} foi resetado`);
      }
    }

    console.log(`Progresso anterior:`, oldProgress);
    console.log(`Novo progresso:`, progress);

    const updatedStorage = {
      ...gameStorage,
      players: updatedPlayers,
      currentPlayer: playerName
    };

    saveToStorage(updatedStorage);
  };

  const deletePlayer = (playerName: string) => {
    console.log('Deletando jogador:', playerName);
    const updatedPlayers = gameStorage.players.filter(p => p.name !== playerName);
    const newCurrentPlayer = gameStorage.currentPlayer === playerName ? '' : gameStorage.currentPlayer;
    
    saveToStorage({
      ...gameStorage,
      players: updatedPlayers,
      currentPlayer: newCurrentPlayer
    });
  };

  const getPlayerProgress = (playerName: string, level: DifficultyLevel) => {
    const player = gameStorage.players.find(p => p.name === playerName);
    const progress = player?.levelProgress[level] || {
      consecutiveWins: 0,
      totalLosses: 0,
      isCleared: false
    };
    console.log(`Progresso do jogador ${playerName} no nível ${level}:`, progress);
    return progress;
  };

  return {
    gameStorage,
    getOrCreatePlayer,
    updatePlayerProgress,
    deletePlayer,
    getPlayerProgress
  };
};
