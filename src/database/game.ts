import { IGamePlayersShips, IPlayersWithShips } from "../models/game-players-ships";
import IAddShips from "../models/ships";
import { startGame } from "../services/game";

let games: IGamePlayersShips[] = [];

const addShipsToBase = (shipsData: IAddShips): void => {
  const playerData: IPlayersWithShips = {
    indexPlayer: shipsData.indexPlayer,
    ships: shipsData.ships,
    isTurn: true,
  }
  if (games.find((game) => game.gameId === shipsData.gameId) === undefined) {    
    const newGame: IGamePlayersShips = {
      gameId: shipsData.gameId,
      playersWithShips: [],      
    }
    newGame.playersWithShips.push(playerData);    
    games.push(newGame);   
  } else {
    const currentGame = games.find((game) => game.gameId === shipsData.gameId);
    if (currentGame !== undefined) {
      playerData.isTurn = false;
      currentGame.playersWithShips.push(playerData);            
      startGame(currentGame.playersWithShips, shipsData.gameId);      
    }
  };
}

const getPlayerTurnForStart = (gameId: string): string => {
  let playerToMakeTurnId = '';
  const players = games.find((game) => 
    game.gameId === gameId
  );
  players?.playersWithShips.forEach((player) => {
    if (player.isTurn) {    
      playerToMakeTurnId = player.indexPlayer;      
    }
  })
  return playerToMakeTurnId;
}

const getPlayerTurn = (gameId: string): string => {
  let playerToMakeTurnId = '';
  const players = games.find((game) => 
    game.gameId === gameId
  );
  players?.playersWithShips.forEach((player) => {
    if (!player.isTurn) {
      player.isTurn = !player.isTurn;
    } else {      
      player.isTurn = !player.isTurn;
      playerToMakeTurnId = player.indexPlayer;      
    }
  })
  return playerToMakeTurnId;
}

const getPlayerIdsForGame = (gameId: string): string[] => {
  let playerIds: string[] = []
  games.forEach((game) => {
    if (game.gameId === gameId) {
      game.playersWithShips.forEach((player) => {
        playerIds.push(player.indexPlayer);
      })
    }
  })
  return playerIds;
}

const checkIfItIsPlayersTurn = (playerId: string): boolean => {
  let isPlayerTurn = false;
  games.forEach((game) => {
    game.playersWithShips.forEach((player) => {
      if (player.indexPlayer === playerId) {
        isPlayerTurn = player.isTurn;
      }
    })
  })
  return isPlayerTurn;
}

export { addShipsToBase, getPlayerTurn, getPlayerTurnForStart, getPlayerIdsForGame, checkIfItIsPlayersTurn };

