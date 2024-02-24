import IAttack from "../models/attack";
import { IAttackFeedback, IStatus } from "../models/attack-feedback";
import { IGamePlayersShips, IPlayersWithShips, IPoint } from "../models/game-players-ships";
import IAddShips from "../models/ships";
import { makeHit, startGame } from "../services/game";

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
    if (direction) {
      for (let i = 0; i < length; i += 1) {
        const vertical = y + i;    
        playerData.playerField[x][vertical].isOccupied = true;
      }
    } else {     
      for (let i = 0; i < length; i += 1) {
        const horizontal = x + i;
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

const checkIfHitInBase = (attack: IAttack): boolean => {
  let isHit = false;
  const { gameId, x, y, indexPlayer } = attack;
  const gameToCheckAttack = games.find((game) => game.gameId === gameId);
  if (gameToCheckAttack !== undefined) {
    gameToCheckAttack.playersWithShips.forEach((game) =>  {
      if (game.indexPlayer !== indexPlayer) {
        game.playerField.forEach((position) => {
          position.forEach((point) => {
            if (point.x === x && point.y === y && point.isOccupied && !point.isAttacked) {
              point.isAttacked = true;
              const hit = checkIfItIsKilled(point, game.playerField);
              makeHit(point, gameToCheckAttack, indexPlayer, hit, game.playerField);
              isHit = true;
            } else if (point.x === x && point.y === y && !point.isAttacked) {
              point.isAttacked = true;
              makeHit(point, gameToCheckAttack, indexPlayer, 'miss');
              isHit = false;
            };
          });          
        })
      };
    });
  };
  return isHit;
}

const checkIfItIsKilled = (point: IPoint, playerField: IPoint[][]): IStatus => {
  const { x, y } = point;
  let sum = 0;
  let i = 1;
  if (x - i >= 0 && playerField[x - i][y].isOccupied) {
    while (x - i >= 0 && playerField[x - i][y].isOccupied) {
      if (playerField[x - i][y].isOccupied && !playerField[x - i][y].isAttacked) {
        sum += 1;
      }
      i += 1;
    }    
  };
  i = 1;
  if (x + i < NUMBER_OF_POINTS_IN_ROW && playerField[x + i][y].isOccupied) {
    while (x + i < NUMBER_OF_POINTS_IN_ROW && playerField[x + i][y].isOccupied) {
      if (playerField[x + i][y].isOccupied && !playerField[x + i][y].isAttacked) {
        sum += 1;
      }
      i += 1;
    }    
  };
  i = 1;
  if (y - i >= 0 && playerField[x][y - i].isOccupied) {
    while (y - i >= 0 && playerField[x][y - i].isOccupied) {
      if (playerField[x][y - i].isOccupied && !playerField[x][y - i].isAttacked) {
        sum += 1;
      }
      i += 1;
    }    
  };
  i = 1;
  if (y + i < NUMBER_OF_POINTS_IN_ROW && playerField[x][y + i].isOccupied) {
    while (y + i < NUMBER_OF_POINTS_IN_ROW && playerField[x][y + i].isOccupied) {
      if (playerField[x][y + i].isOccupied && !playerField[x][y + i].isAttacked) {
        sum += 1;
      }
      i += 1;
    }    
  };
  return sum > 0 ? 'shot' : 'killed'; 
};

const destroyShipArray = (attackFeedback: IAttackFeedback, playerField: IPoint[][]): [{ x: number, y: number }] => {  
  const {
    position: {
      x,
      y,
    }
  } = attackFeedback;
  let destroyArray: [{ x: number, y: number }] = [{ x, y }];
  let i = 1;
  if (x - i >= 0 && playerField[x - i][y].isOccupied) {
    while (x - i >= 0 && playerField[x - i][y].isOccupied) {
      destroyArray.push({ x: x - i, y: y });
      i += 1;
    }
  };
  i = 1;
  if (x + i < NUMBER_OF_POINTS_IN_ROW && playerField[x + i][y].isOccupied) {
    while (x + i < NUMBER_OF_POINTS_IN_ROW && playerField[x + i][y].isOccupied) {
      destroyArray.push({ x: x + i, y: y });
      i += 1;
    }
  };
  i = 1;
  if (y + i < NUMBER_OF_POINTS_IN_ROW && playerField[x][y + i].isOccupied) {
    while (y + i < NUMBER_OF_POINTS_IN_ROW && playerField[x][y + i].isOccupied) {
      destroyArray.push({ x: x, y: y + i });
      i += 1;
    }
  };
  i = 1;
  if (y - i >= 0 && playerField[x][y - i].isOccupied) {
    while (y - i >= 0 && playerField[x][y - i].isOccupied) {
      destroyArray.push({ x: x, y: y - i });
      i += 1;
    }
  };
  return destroyArray;
}

const missedShipArray = (attackFeedback: IAttackFeedback, playerField: IPoint[][]): [{ x: number, y: number }] => {
   const {
    position: {
      x,
      y,
    }
  } = attackFeedback;
  let missedArray: [{ x: number, y: number }] = [{ x: -1, y: -1 }];
  if (y - 1 >= 0 && !playerField[x][y - 1].isOccupied && !playerField[x][y - 1].isAttacked) {
    missedArray.push({ x: x, y: y - 1 });
    playerField[x][y - 1].isAttacked === !playerField[x][y - 1].isAttacked;
  };
  if (x - 1 >= 0 && y - 1 >= 0 && !playerField[x - 1][y - 1].isOccupied && !playerField[x - 1][y - 1].isAttacked) {
    missedArray.push({ x: x - 1, y: y - 1 });
    playerField[x - 1][y - 1].isAttacked === !playerField[x - 1][y - 1].isAttacked;
  };
  if (x + 1 < NUMBER_OF_POINTS_IN_ROW && y - 1 >= 0 && !playerField[x + 1][y - 1].isOccupied && !playerField[x + 1][y - 1].isAttacked) {
    missedArray.push({ x: x + 1, y: y - 1 });
    playerField[x + 1][y - 1].isAttacked === !playerField[x + 1][y - 1];
  };
  if (y + 1 < NUMBER_OF_POINTS_IN_ROW && !playerField[x][y + 1].isOccupied && !playerField[x][y + 1].isAttacked) {
    missedArray.push({ x: x, y: y + 1 });
    playerField[x][y + 1].isAttacked === !playerField[x][y + 1];
  };
  if (x - 1 >= 0 && y + 1 < NUMBER_OF_POINTS_IN_ROW && !playerField[x - 1][y + 1].isOccupied && !playerField[x - 1][y + 1].isAttacked) {
    missedArray.push({ x: x - 1, y: y + 1 });
    playerField[x - 1][y + 1].isAttacked === !playerField[x - 1][y + 1].isAttacked;
  };
  if (x + 1 < NUMBER_OF_POINTS_IN_ROW && y + 1 < NUMBER_OF_POINTS_IN_ROW && !playerField[x + 1][y + 1].isOccupied && !playerField[x + 1][y + 1].isAttacked) {
    missedArray.push({ x: x + 1, y: y + 1 });
    playerField[x + 1][y + 1].isAttacked === !playerField[x + 1][y + 1];
  };
  if (x - 1 >= 0 && !playerField[x - 1][y].isOccupied && !playerField[x - 1][y].isAttacked) {
    missedArray.push({ x: x - 1, y: y });
    playerField[x - 1][y].isAttacked === !playerField[x - 1][y].isAttacked;
  };
  if (x + 1 < NUMBER_OF_POINTS_IN_ROW && !playerField[x + 1][y].isOccupied && !playerField[x + 1][y].isAttacked) {
    missedArray.push({ x: x + 1, y: y });
    playerField[x + 1][y].isAttacked === !playerField[x + 1][y].isAttacked;
  };   
  return missedArray;
};

const checkIfThereArePointWithShips = (playerField: IPoint[][]): boolean => {
  let noShipPoints = true;
  playerField.forEach((points) => {
    points.forEach((point) => {
      if (point.isOccupied && !point.isAttacked) {
        noShipPoints = false;
      }
    })
  })
  return noShipPoints;
}

export {
  addShipsToBase,
  getPlayerTurn,
  getPlayerIdsForGame,
  checkIfItIsPlayersTurn,
  addShipsToField,
  checkIfHitInBase,
  destroyShipArray,
  missedShipArray,
  checkIfThereArePointWithShips
};

