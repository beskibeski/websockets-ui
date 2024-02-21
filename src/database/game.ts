import { IGamePlayersShips, IPlayersWithShips, IPoint } from "../models/game-players-ships";
import IAddShips from "../models/ships";
import { startGame } from "../services/game";

let games: IGamePlayersShips[] = [];

const NUMBER_OF_POINTS_IN_ROW = 10;

const addShipsToBase = (shipsData: IAddShips): void => {
  const playerData: IPlayersWithShips = {
    indexPlayer: shipsData.indexPlayer,
    ships: shipsData.ships,
    isTurn: true,
    playerField: makeEmptyField(),
    enemyField: makeEmptyField(),
  }
  addShipsToField(playerData);
  console.log(playerData.playerField)
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

const addShipsToField = (playerData: IPlayersWithShips) => {  
  playerData.ships.forEach((ship) => {
    const {
      direction,
      length,
      position: {
        x,
        y,
      }
    } = ship;
    const vertical = y + 1;
    const horizontal = x + 1; 
    if (direction) {
      for (let i = 0; i < length; i += 1) {  
        playerData.playerField[x][vertical].isOccupied = true;
      }
    } else {
      for (let i = 0; i < length; i += 1) {
        playerData.playerField[horizontal][y].isOccupied = true;
      }
    }
  });
}

const makeEmptyField = () => {
  const emptyField: IPoint[][] = [];
    for (let i = 0; i < NUMBER_OF_POINTS_IN_ROW; i += 1) {
        const horizontal = [];
        for (let j = 0; j < NUMBER_OF_POINTS_IN_ROW; j += 1) {
          const point: IPoint = {
            x: i,
            y: j,
            isOccupied: false,
            isAttacked: false,
          }
          horizontal.push(point);
        }
        emptyField.push(horizontal);
      };
  return emptyField;
}


export { addShipsToBase, getPlayerTurn, getPlayerTurnForStart, getPlayerIdsForGame, checkIfItIsPlayersTurn, addShipsToField };

