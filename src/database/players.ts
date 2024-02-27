import IPlayer from '../models/player';
import IRoomPlayer from '../models/room-player';

const players: IPlayer[] = [];

const addPlayer = (player: IPlayer): void => {
  players.push(player);
}

const getPlayers = (): IPlayer[] => {
  return players;
}

const checkPlayer = (player: IPlayer): boolean => {
  return players.find((value) => value.name === player.name) !== undefined ? true : false;
}

const checkPassword = (player: IPlayer): boolean => {
  return players.find((value) => value.password === player.password) !== undefined ? true : false;
}

const getPlayerNameById = (playerId: string): string => {
  const player = players.find((player) => player.index === playerId)?.name;
  if(player !== undefined) {
    return player;
  }
  return '';
}

const getPlayerById = (playerId: string): IRoomPlayer => {
  const player: IPlayer = players.filter((player) => player.index === playerId)[0];  
  return {
    name: player.name,
    index: player.index,
  }
};

const getPlayerIdByName = (playerName: string): string => {
  const newPlayer = players.find((player) => player.name === playerName);
  if (newPlayer !== undefined) {
    return newPlayer.index;
  } else {
    return '';
  }
}

export { 
  addPlayer,
  getPlayers,
  checkPassword,
  checkPlayer, 
  getPlayerNameById,
  getPlayerById,
  getPlayerIdByName,
};
  
