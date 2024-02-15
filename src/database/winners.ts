import IWinner from "../models/winner";

let winners: IWinner[] = [];

const addWinner = (winner: IWinner) => {
  winners.push(winner);
  console.log('Winner added');
};

const getWinners = (): IWinner[] => {
  return winners;
}

export { addWinner, getWinners };