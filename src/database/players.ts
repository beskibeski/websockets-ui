import IPlayer from "../models/player";

const players: IPlayer[] = [];

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

const getPlayerIndex = (player: IPlayer): string => {
  let index = '';
  players.filter((value) => {
    if (value.name === player.name) {
      index = value.index;      
      return value.index;               
    }
  }
  );  
  return index;
}

export { addPlayer, showPlayers, checkPassword, checkPlayer, getPlayerIndex };
  
