import IPlayer from '../models/player';
import IRoomPlayer from '../models/room-player';
import WebSocketWithId from '../models/websocket';

const players: IPlayer[] = [];

let currentPlayer: IPlayer;

const addPlayer = (player: IPlayer): void => {
  players.push(player);
}

const showPlayers = (): void => {
  console.log(players);
}

const checkPlayer = (player: IPlayer): boolean => {
  return players.find((value) => value.name === player.name) !== undefined ? true : false;
}

const checkPassword = (player: IPlayer): boolean => {
  return players.find((value) => value.password === player.password) !== undefined ? true : false;
}

const setCurrentPlayer = (player: IPlayer): void => {
  currentPlayer = player;
}

const getCurrentPlayer = (): IPlayer => {
  return currentPlayer;
}

const getCurrentPlayerByIdWithoutPassword = (wsSocket: WebSocketWithId): IRoomPlayer => {
  const player: IPlayer = players.filter((player) => player.index === wsSocket.id)[0];
  return {
    name: player.name,
    index: player.index,
  }
}

export { 
  addPlayer,
  showPlayers,
  checkPassword,
  checkPlayer,
  setCurrentPlayer,
  getCurrentPlayer,
  getCurrentPlayerByIdWithoutPassword,
};
  
