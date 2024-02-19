import IShip from "./ship";

export interface IGamePlayersShips {
  gameId: string;
  playersWithShips: IPlayersWithShips[];  
}

export interface IPlayersWithShips {
  indexPlayer: string;
  ships: IShip[];
  isTurn: boolean,
}