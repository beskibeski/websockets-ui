import IShip from "./ship";

interface IAddShips {
  gameId: string,
  ships: IShip[],
  indexPlayer: string,  
}

export default IAddShips;
