import IPlayer from "../models/player";

const players: IPlayer[] = [];

const addPlayer = (player: IPlayer): void => {
  players.push(player);
  const { name } = player;
  console.log(`Registration of player with the name ${name} is successful`);
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

const getPlayerIndex = (player: IPlayer): number => {
  return players.findIndex((value) => value.name === player.name);
}

export { addPlayer, showPlayers, checkPassword, checkPlayer, getPlayerIndex };
  
