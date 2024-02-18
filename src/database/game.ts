import { IGamePlayersShips, IPlayersWithShips } from "../models/game-players-ships";
import IAddShips from "../models/ships";
import { startGame } from "../services/game";

let games: IGamePlayersShips[] = [];

const addShipsToBase = (shipsData: IAddShips): void => {
  const playerData: IPlayersWithShips = {
    indexPlayer: shipsData.indexPlayer,
    ships: shipsData.ships,
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
      currentGame.playersWithShips.push(playerData);
      startGame(currentGame.playersWithShips);
    }
  };
}

export default addShipsToBase;

